# Daedalus

Daedalus is an EPICS React application. It uses [cs-web-lib](https://github.com/DiamondLightSource/cs-web-lib) to display CSStudio and Phoebus .opi and .bob files.


## Pages

There are several pages that provide control screen functionality. These are:

- `/` - The landing page for the application.
- `/demo` - This is a demo page that allows you to open a .bob file hosted on a URL and to view it in Daedalus
- `/synoptic` - Display the synoptic screens for the configured beamlines. This includes a demo of the Phoebus .bob screens and a hierarchy tree, alongside breadcrumbs to navigate the screen hierarchy
- `/editor` - A demo wireframe of a .bob screen editor, which mimics Phoebus in appearance. This is not yet functional.
- `/data-browser` - Display an example data-browser screen showing a plot of live and historic data for the PV SR-DI-DCCT-01:SIGNAL. Most of the control functionality remains to be implemented.

## How to run

### Development mode

To run locally:

```
npm install
npm run dev
```

### Docker Image

We have created a pre-build image of Daedalus, which is hosted on github: https://github.com/DiamondLightSource/daedalus/pkgs/container/daedalus.
This uses an unprivileged NGinx server to host the compiled Daedalus code.

To pull the image:
```
docker pull ghcr.io/diamondlightsource/daedalus:latest
```

To run the image:
```
docker run -d -p 8080:8080 --name daedalus-server ghcr.io/diamondlightsource/daedalus
```
This will serve Daedalus on port 8080.

If you want ot override the default configuration with a configuration file hosted on your local machine, mount the local file on the container path `/usr/share/nginx/html/config/config.json`. For example:
```
docker run -d -p 8080:8080 -v /path/to/local/config.json:/usr/share/nginx/html/config/config.json:ro --name daedalus-server ghcr.io/diamondlightsource/daedalus 
```

### Configuration

The basic configuration parameters for Daedalus are loaded at runtime from the file hosted on /config/config.json.
The configuration parameters are:

| Parameter | type | Description |
|- | -| - |
| PVWS_SOCKET | string | The fully qualified hostname and port of the instance of the PVWS web service |
| PVWS_SSL | boolean | If true use https, if false use http for connecting to the PVWS web service |
| THROTTLE_PERIOD | integer | The period in millseconds between updates of the PV state variables |
| beamlines | object | Object that specifies the configuration of the beam lines. |

#### Beamlines configuration

The beamlines are configured by means of the beamlines parameter, this object has the form:
```
{
  [BEAMLINE_NAME: string]: {
    host: string,
    entrypoint: string
  }
}
```

| Parameter | type | Description |
|- | -| - |
| BEAMLINE_NAME | string | The name of the beamline for this configuration entry |
| host | string | The fully qualified hostname of the server that hosts the beamline .bob files and other screen configuration |
| entryPoint | string | The path to the json file that describes the file strcture of the screeen. |

### Demo Synoptic Screens

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
