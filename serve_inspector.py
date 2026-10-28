import http.server
import socketserver
import os
import sys

PORT = 5175
DIRECTORY = "/home/slalglel/rune-age"

class InspectorHandler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=DIRECTORY, **kwargs)

    def do_GET(self):
        # Automatically redirect root path or /index.html directly to /inspect.html
        if self.path in ('/', '/index.html', '/index.htm'):
            self.send_response(302)
            self.send_header('Location', '/inspect.html')
            self.send_header('Cache-Control', 'no-cache')
            self.end_headers()
            return
        super().do_GET()

    def do_HEAD(self):
        if self.path in ('/', '/index.html', '/index.htm'):
            self.send_response(302)
            self.send_header('Location', '/inspect.html')
            self.end_headers()
            return
        super().do_HEAD()

if __name__ == '__main__':
    socketserver.TCPServer.allow_reuse_address = True
    with socketserver.TCPServer(("0.0.0.0", PORT), InspectorHandler) as httpd:
        print(f"Inspector server running on http://0.0.0.0:{PORT} (Auto-redirecting / to /inspect.html)")
        sys.stdout.flush()
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            pass
