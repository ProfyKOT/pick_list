import http.server
import socketserver

def saveToJson(data):
    fileObj = open("data.json","w")
    fileData = fileObj.write(data)
    fileObj.close()
    return

def uploadFromJson():
    fileObj = open("data.json","r")
    fileData = fileObj.read()
    fileObj.close()
    return fileData

PORT = 9000
class HttpRequestsHandler(http.server.BaseHTTPRequestHandler):
    def do_OPTIONS(self):           
        self.send_response(200, "ok")       
        self.send_header('Access-Control-Allow-Origin', '*')                
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Access-Control-Allow-Headers, Origin, Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers')     
        self.end_headers()

    def do_GET(self):
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header("Content-type",  "application/json")
        self.end_headers()
        self.wfile.write(bytes(uploadFromJson(), "utf-8"))
    def do_POST(self):
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header("Content-type",  "application/json")
        self.end_headers()
        saveToJson(self.rfile.read(int(self.headers['content-length'])).decode('utf-8'))
        

Handler = HttpRequestsHandler

with socketserver.TCPServer(("",PORT),Handler) as httpd:
    print('Server started on:',PORT)
    httpd.serve_forever()