from http.server import ThreadingHTTPServer, SimpleHTTPRequestHandler
import os

PORT = 8000


class RangeRequestHandler(SimpleHTTPRequestHandler):

    def send_head(self):
        path = self.translate_path(self.path)

        if not os.path.isfile(path):
            return super().send_head()

        file_size = os.path.getsize(path)
        range_header = self.headers.get("Range")

        if not range_header:
            return super().send_head()

        try:
            range_value = range_header.strip().replace("bytes=", "")
            start, end = range_value.split("-")

            start = int(start)
            end = int(end) if end else file_size - 1

            if start >= file_size:
                self.send_error(416, "Requested Range Not Satisfiable")
                return None

            end = min(end, file_size - 1)
            length = end - start + 1

            self.send_response(206)
            self.send_header("Content-Type", self.guess_type(path))
            self.send_header("Accept-Ranges", "bytes")
            self.send_header("Content-Range", f"bytes {start}-{end}/{file_size}")
            self.send_header("Content-Length", str(length))
            self.end_headers()

            self.range_start = start
            self.range_length = length

            return open(path, "rb")

        except Exception:
            return super().send_head()

    def copyfile(self, source, outputfile):
        if hasattr(self, "range_start"):
            source.seek(self.range_start)
            remaining = self.range_length

            while remaining > 0:
                buffer = source.read(min(64 * 1024, remaining))

                if not buffer:
                    break

                outputfile.write(buffer)
                remaining -= len(buffer)

            del self.range_start
            del self.range_length

        else:
            super().copyfile(source, outputfile)


print(f"Birthday website server running at:")
print(f"http://localhost:{PORT}")
print("Press Ctrl+C to stop.")

server = ThreadingHTTPServer(("0.0.0.0", PORT), RangeRequestHandler)
server.serve_forever()