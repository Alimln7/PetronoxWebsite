"""
server.py -- Petronox API + Static File Server

Serves both the website static files AND the vehicle data API.

Configuration via environment variables:
  PETRONOX_PORT           (default: 8080)
  PETRONOX_DB_PATH        (default: petronox.db)
  PETRONOX_CORS_ORIGIN    (default: * — set to https://petronox-de.com for prod)
  PETRONOX_CACHE_MAX_AGE  (default: 86400 = 1 day — set to 0 for dev)

Usage: python server.py
"""

import http.server
import json
import sqlite3
import urllib.parse
import os
import sys
import gzip
import time as _time

# -- Configuration --
DB_PATH = os.environ.get('PETRONOX_DB_PATH', 'petronox.db')
PORT = int(os.environ.get('PETRONOX_PORT', '8080'))
CORS_ORIGIN = os.environ.get('PETRONOX_CORS_ORIGIN', '*')
CACHE_MAX_AGE = int(os.environ.get('PETRONOX_CACHE_MAX_AGE', '86400'))

# Sensitive paths that must never be served
BLOCKED_EXTENSIONS = {'.py', '.db', '.log', '.pyc'}
BLOCKED_PATHS = {'/__pycache__', '/.git', '/.claude', '/.gitignore', '/.env'}


class PetronoxHandler(http.server.SimpleHTTPRequestHandler):
    """Serves static files and API endpoints from SQLite."""

    def log_message(self, format, *args):
        """Log all requests with timestamp and response time."""
        elapsed = ''
        if hasattr(self, '_request_start'):
            ms = (_time.monotonic() - self._request_start) * 1000
            elapsed = f' {ms:.0f}ms'
        sys.stderr.write(
            f"[{self.log_date_time_string()}] {format % args}{elapsed}\n"
        )

    # MIME types that benefit from gzip
    COMPRESSIBLE = {'.html', '.css', '.js', '.json', '.svg', '.txt', '.xml'}

    def end_headers(self):
        # Cache headers for images (CSS/JS handled by serve_gzipped, API by send_json)
        ext = os.path.splitext(self.path)[1].lower()
        if ext in ('.jpg', '.jpeg', '.png', '.webp', '.gif', '.ico'):
            self.send_header('Cache-Control', f'public, max-age={CACHE_MAX_AGE}')
        super().end_headers()

    def do_GET(self):
        self._request_start = _time.monotonic()
        parsed = urllib.parse.urlparse(self.path)
        path = parsed.path

        # Block access to sensitive files
        path_lower = path.lower()
        ext = os.path.splitext(path_lower)[1]
        if (ext in BLOCKED_EXTENSIONS
                or any(path_lower.startswith(bp) for bp in BLOCKED_PATHS)):
            self.send_error(404, 'Not Found')
            return

        # Health check for monitoring
        if path == '/health':
            body = b'{"status":"ok"}'
            self.send_response(200)
            self.send_header('Content-Type', 'application/json')
            self.send_header('Content-Length', str(len(body)))
            self.end_headers()
            self.wfile.write(body)
            return

        if path.startswith('/api/'):
            self.handle_api(path, parsed.query)
        else:
            # Check if this is a compressible static file
            ext = os.path.splitext(path)[1].lower()
            accept_enc = self.headers.get('Accept-Encoding', '')
            if ext in self.COMPRESSIBLE and 'gzip' in accept_enc:
                self.serve_gzipped(path)
            else:
                super().do_GET()

    def serve_gzipped(self, path):
        """Serve a static file with gzip compression."""
        fpath = self.translate_path(path)
        if not os.path.isfile(fpath):
            super().do_GET()
            return

        try:
            with open(fpath, 'rb') as f:
                content = f.read()
        except IOError:
            super().do_GET()
            return

        compressed = gzip.compress(content)
        ctype = self.guess_type(fpath)

        self.send_response(200)
        self.send_header('Content-Type', ctype)
        self.send_header('Content-Length', str(len(compressed)))
        self.send_header('Content-Encoding', 'gzip')
        self.send_header('Cache-Control', f'public, max-age={CACHE_MAX_AGE}')
        super().end_headers()  # bypass our end_headers to avoid duplicate Cache-Control
        self.wfile.write(compressed)

    def handle_api(self, path, query_string):
        params = {}
        if query_string:
            for k, v in urllib.parse.parse_qs(query_string).items():
                params[k] = v[0]

        routes = {
            '/api/categories': self.api_categories,
            '/api/brands': self.api_brands,
            '/api/models': self.api_models,
            '/api/types': self.api_types,
            '/api/vehicle': self.api_vehicle,
            '/api/search': self.api_search,
            '/api/products': self.api_products,
        }

        handler = routes.get(path)
        if handler:
            try:
                result = handler(params)
                self.send_json(result)
            except Exception as e:
                self.send_json({'error': str(e)}, status=500)
        else:
            self.send_json({'error': 'Not found'}, status=404)

    def send_json(self, data, status=200):
        body = json.dumps(data, ensure_ascii=False).encode('utf-8')

        # Gzip if client supports it and body is worth compressing
        accept_enc = self.headers.get('Accept-Encoding', '')
        if 'gzip' in accept_enc and len(body) > 256:
            body = gzip.compress(body)
            encoding = 'gzip'
        else:
            encoding = None

        self.send_response(status)
        self.send_header('Content-Type', 'application/json; charset=utf-8')
        self.send_header('Content-Length', str(len(body)))
        if encoding:
            self.send_header('Content-Encoding', encoding)
        self.send_header('Access-Control-Allow-Origin', CORS_ORIGIN)
        self.send_header('Cache-Control', 'no-cache')
        super().end_headers()  # bypass our end_headers for API responses
        self.wfile.write(body)

    def get_db(self):
        conn = sqlite3.connect(DB_PATH)
        conn.row_factory = sqlite3.Row
        return conn

    # -- API Endpoints --

    def api_categories(self, params):
        """GET /api/categories -> ["Agriculture", "Cars", ...]"""
        db = self.get_db()
        rows = db.execute("SELECT name FROM categories ORDER BY name").fetchall()
        db.close()
        return [r['name'] for r in rows]

    def api_brands(self, params):
        """GET /api/brands?category=X -> ["BMW", "Toyota", ...]"""
        category = params.get('category', '')
        db = self.get_db()
        rows = db.execute("""
            SELECT b.name FROM brands b
            JOIN categories c ON b.category_id = c.id
            WHERE c.name = ?
            ORDER BY b.name
        """, (category,)).fetchall()
        db.close()
        return [r['name'] for r in rows]

    def api_models(self, params):
        """GET /api/models?category=X&brand=Y -> ["3 Series", ...]"""
        category = params.get('category', '')
        brand = params.get('brand', '')
        db = self.get_db()
        rows = db.execute("""
            SELECT m.name FROM models m
            JOIN brands b ON m.brand_id = b.id
            JOIN categories c ON b.category_id = c.id
            WHERE c.name = ? AND b.name = ?
            ORDER BY m.name
        """, (category, brand)).fetchall()
        db.close()
        return [r['name'] for r in rows]

    def api_types(self, params):
        """GET /api/types?category=X&brand=Y&model=Z -> ["320i", ...]"""
        category = params.get('category', '')
        brand = params.get('brand', '')
        model = params.get('model', '')
        db = self.get_db()
        rows = db.execute("""
            SELECT t.name FROM types t
            JOIN models m ON t.model_id = m.id
            JOIN brands b ON m.brand_id = b.id
            JOIN categories c ON b.category_id = c.id
            WHERE c.name = ? AND b.name = ? AND m.name = ?
            ORDER BY t.name
        """, (category, brand, model)).fetchall()
        db.close()
        return [r['name'] for r in rows]

    def api_vehicle(self, params):
        """GET /api/vehicle?category=X&brand=Y&model=Z&type=T
        Returns full component data for one vehicle."""
        category = params.get('category', '')
        brand = params.get('brand', '')
        model = params.get('model', '')
        type_name = params.get('type', '')

        db = self.get_db()
        rows = db.execute("""
            SELECT comp.name as comp_name, comp.sort_order,
                   os.section_key, os.oil_names, os.oil_properties
            FROM components comp
            JOIN types t ON comp.type_id = t.id
            JOIN models m ON t.model_id = m.id
            JOIN brands b ON m.brand_id = b.id
            JOIN categories c ON b.category_id = c.id
            LEFT JOIN oil_sections os ON os.component_id = comp.id
            WHERE c.name = ? AND b.name = ? AND m.name = ? AND t.name = ?
            ORDER BY comp.sort_order, os.section_key
        """, (category, brand, model, type_name)).fetchall()
        db.close()

        # Reconstruct nested dict matching original JSON structure
        result = {}
        for row in rows:
            comp_name = row['comp_name']
            if comp_name not in result:
                result[comp_name] = {}
            if row['section_key']:
                result[comp_name][row['section_key']] = {
                    'oil_names': json.loads(row['oil_names']),
                    'oil_properties': json.loads(row['oil_properties'])
                }

        return result

    def api_search(self, params):
        """GET /api/search?q=query -> [{type, category, brand, model}, ...]
        Returns max 10 results for autocomplete."""
        query = params.get('q', '').strip()
        if not query:
            return []

        db = self.get_db()
        rows = db.execute("""
            SELECT DISTINCT type_name, category_name, brand_name, model_name
            FROM search_index
            WHERE type_name_lower LIKE ?
            LIMIT 10
        """, (f'%{query.lower()}%',)).fetchall()
        db.close()

        return [
            {
                'type': r['type_name'],
                'category': r['category_name'],
                'brand': r['brand_name'],
                'model': r['model_name']
            }
            for r in rows
        ]

    def api_products(self, params):
        """GET /api/products -> {"Diesel Engine Oil": {"description": "..."}, ...}"""
        db = self.get_db()
        rows = db.execute("SELECT name, description FROM products ORDER BY id").fetchall()
        db.close()
        return {r['name']: {'description': r['description']} for r in rows}


if __name__ == '__main__':
    os.chdir(os.path.dirname(os.path.abspath(__file__)))

    if not os.path.exists(DB_PATH):
        print(f"Error: {DB_PATH} not found. Run 'python import_data.py' first.")
        sys.exit(1)

    server = http.server.ThreadingHTTPServer(('', PORT), PetronoxHandler)
    print(f"Petronox server running on http://localhost:{PORT}")
    print(f"Database: {DB_PATH} ({os.path.getsize(DB_PATH) / 1024 / 1024:.1f} MB)")
    print(f"CORS origin: {CORS_ORIGIN}")
    print(f"Cache max-age: {CACHE_MAX_AGE}s")
    print("Press Ctrl+C to stop")

    try:
        server.serve_forever()
    except KeyboardInterrupt:
        print("\nServer stopped.")
        server.server_close()
