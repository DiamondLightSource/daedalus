# Daedalus

Daedalus is an EPICS React application. It uses [cs-web-lib](https://github.com/DiamondLightSource/cs-web-lib) to display CSStudio and Phoebus .opi and .bob files.

## Pages

There are several pages that provide control screen functionality. These are:

- `/` - The landing page for the application.
- `/demo` - This is a demo page that allows you to open a .bob file hosted on a URL and to view it in Daedalus
- `/synoptic` - Display the synoptic screens for the configured beamlines. This includes a demo of the Phoebus .bob screens and a hierarchy tree, alongside breadcrumbs to navigate the screen hierarchy
- `/editor` - A demo wireframe of a .bob screen editor, which mimics Phoebus in appearance. This is not yet functional.
- `/data-browser` - Display an example data-browser screen showing a plot of live and historic data for the PV SR-DI-DCCT-01:SIGNAL. Most of the control functionality remains to be implemented.

## Runtime Configuration

The basic configuration parameters for Daedalus are loaded at runtime from the JSON file hosted on `/config/config.json`. The schema/structure of the configuration file is:

```
{
  PVWS_SOCKET: string
  PVWS_SSL: boolean,
  THROTTLE_PERIOD: integer,
  beamlines: {
    [BEAMLINE_NAME: string]: {
      host: string,
      entrypoint: string
    }
  }
}
```

The configuration parameters are:

| Parameter | type | Description |
|- | -| - |
| PVWS_SOCKET | string | The fully qualified hostname and port of the instance of the PVWS web service |
| PVWS_SSL | boolean | If true use https, if false use http for connecting to the PVWS web service |
| THROTTLE_PERIOD | integer | The period in milliseconds between updates of the PV state variables |
| beamlines | object | Object that specifies the configuration zero or more beamlines. |
| BEAMLINE_NAME | string | The beamline key string for this configuration entry, it should be a unique identifier for the beamline within Daedalus. The key string is displayed in the dropdown list of beamlines. |
| host | string | The fully qualified hostname, port and root path of the Tech UI screen files |
| entryPoint | string | The relative path to the jsonMap file that describes the file structure of the screen, this must start with a `/` character. |

## Running from a pre-built Docker image

We have created a pre-built Docker image for Daedalus, which is hosted on github: https://github.com/DiamondLightSource/daedalus/pkgs/container/daedalus.
This uses an unprivileged NGINX server to host the compiled Daedalus code.

To pull the image (change the version as necessary):
```
docker pull ghcr.io/diamondlightsource/daedalus:0.0.0
```

To run the image:
```
docker run -d -p 8080:8080 --name daedalus-server ghcr.io/diamondlightsource/daedalus
```
This will serve Daedalus on http://localhost:8080.

If you want to override the default configuration with a configuration file hosted on your local machine, mount the local file on the container path `/usr/share/nginx/html/config/config.json`. For example:
```
docker run -d -p 8080:8080 -v /path/to/local/config.json:/usr/share/nginx/html/config/config.json:ro --name daedalus-server ghcr.io/diamondlightsource/daedalus 
```

## Development quick start.

**Install Node**

Install Node.js version 22+, if it is not already installed on your machine.

**Clone the repository.**
```
git clone https://github.com/DiamondLightSource/daedalus.git
```

**Install the dependencies, from the root folder of the repo run:**
```
npm ci
```

**To run the unit tests:**
```
npm run test
```

**To run the static analysis and code style checks:**
```
npm run lint
npm run prettier-check
```

**To run in development mode:**

```
npm run dev
```

**To build the application**
```
npm run build
```

### Run using a development version of cs-web-lib

When developing cs-web-lib and Daedalus it is often desirable to run Daedalus using a local development version of cs-web-lib. To do this:

**Clone the cs-web-lib repo:**
```
git clone https://github.com/DiamondLightSource/cs-web-lib.git
```

**Install cs-web-lib's dependencies and rollup the package, run from the root directory of the cs-web-lib repo:**
```
npm ci
npm run rollup
```

**Install the dev cs-web-lib package in Daedalus. From the root directory of the Daedalus repo:**
```
npm install <CS_WEB_LIB_REPO_DIR>/cs-web-lib
```

**Run Daedalus in development mode:**
```
npm run dev
```

Your local version of Daedalus will now be using the rolled up development version of cs-web-lib. You can make changes to the cs-web-lib code and each time you run `npm run rollup` your development version of Daedalus will refresh to use the modified cs-web-lib version.

### Building a docker image from source

To build the docker image, from the root directory run:
```
docker build -t daedalus:dev .
```

## CI builds and versioning

### Automated package audit, unit testing and linting

We have created an automated workflow that will 
* Run npm audit
* Run linting (prettier-check)
* Run unit tests

This is run on all pushes to the repo.

### Build Docker image

We have created an automated workflow that will build the docker image.
* Build the docker image
* Run Trivy Vulnerability scanner
* Push the image to container registry, if the commit has been tagged or the work has been triggered manually.

This is run on all pushes to the repo, but only pushes an image to the container registry if the build commit is tagged or the build is manually triggered.

#### Image Versioning

We currently have a simple scheme for versioning the docker images.
- Images produced from a commit with a tag uses the repo tag as the version identified. We use semantic version tags of the form x.y.z, where x are major versions, y minor version changes and z patch updates.
- Images produced by manually triggered builds of untagged commits are not tagged, but will appear as the "latest" image, until superseded by the next pushed image.


## Demo Synoptic Screens

The B23 synoptic demo requires the screen configuration files and jsonMap.json file to be served as static files by a webserver. You will need to update the configuration file (`config.json`) ensuring that you create or update the beamline entry for B23 with the correct host and entrypoint parameters.
The B23 synoptic demo screen files are generated by the [techui-builder](https://github.com/DiamondLightSource/techui-builder) command line application. 

### Serving the screen files on a development machine

On a development machine:

1. Clone https://github.com/DiamondLightSource/techui-builder using the `--recursive` flag to clone the repository dependencies.
2. Follow the steps to generate the json-map.json file specified in the Readme document. Use the yaml file: `example-synoptic/b23-services/synoptic/techui.yaml` for B23 and the `techui-builder` command line application. You may need to run `uv sync` in the top level folder of the repo to install `techui-builder`.
3. Use a local fileserver with CORS enabled to serve the techui-builder directory.
4. Ensure the host and entryPoint parameters are correctly set in the Daedalus configuration file.

A fileserver can be created by either:
- Using the Serve script: `npm install serve` followed by `npx serve --cors`
- or a simple Python script such as:

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

With the webserver running, B23 will now be selectable in the beamline dropdown.
