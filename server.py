"""
server.py -- Local development static file server

Usage: python server.py
"""

import http.server
import os
import sys

PORT = int(os.environ.get('PETRONOX_PORT', '8080'))

if __name__ == '__main__':
    os.chdir(os.path.dirname(os.path.abspath(__file__)))
    server = http.server.ThreadingHTTPServer(('', PORT), http.server.SimpleHTTPRequestHandler)
    print(f"Serving on http://localhost:{PORT}")
    print("Press Ctrl+C to stop")
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        print("\nStopped.")
        server.server_close()
