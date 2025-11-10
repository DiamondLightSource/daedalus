# Daedalus

Daedalus is a demo EPICS React application. It uses [cs-web-lib](https://github.com/DiamondLightSource/cs-web-lib) to display CSStudio and Phoebus .opi and .bob files.


## Demos

There are several demos of different features included. These are:

- `/` - Various beamline synoptics. This includes a demo of the Phoebus .bob screens and a hierarchy tree, alongside breadcrumbs to navigate the screen hierarchy
- `/demo` - This is a demo page that allows you to open any screen from a URL and see how it looks in Daedalus
- `/editor` - A demo of a .bob screen editor, which mimics Phoebus in appearance.

## How to run

To run locally:

```
npm install
npm run dev
```

### PVWS configuration

The configuration of the PVWS service is managed via the json configuration file 
`public/config/config.json`. The hostname of the pvws instance is set using the `PVWS_SOCKET` parameter.

### B23 synoptic demo

The B23 synoptic demo requires [techui-builder](https://github.com/DiamondLightSource/techui-builder) files to be served locally, including the JSON map. The steps to do this are:

1. Clone https://github.com/DiamondLightSource/techui-builder 
2. Follow the steps to generate the json-map.json file for B23 using the `create-gui.yaml` command.
3. Use a local fileserver with CORS enabled to serve the techui-builder directory at `localhost:8000`. A fileserver can be created using a simple python script like:

```
import sys
import socketserver
from http import server

class MyHTTPRequestHandler(server.SimpleHTTPRequestHandler):
    def end_headers(self): 
        self.send_my_headers()
        # Include additional response headers here. CORS for example:           
        server.SimpleHTTPRequestHandler.end_headers(self)

    def send_my_headers(self):
        self.send_header("Access-Control-Allow-Origin", "*")

if __name__ == '__main__':
    server.test(HandlerClass=MyHTTPRequestHandler)
```
To execute, run `python -m server` at the root of the directory.

With this running, B23 should now appear in the beamline dropdown.