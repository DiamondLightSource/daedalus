# Performance testing for Daedalus

This performance directory contains scripts that can be used to run performance testing of Daedalus.

These tests require following the steps laid out in the main README for cloning techui-builder and serving the .bob files and generated JSON Map at localhost:8000.

## Building Daedalus

If you want to test against an unreleased version of cs-web-lib, build your cs-web-lib instance with

   cd cs-web-lib
   npm run rollup
   npm pack

This creates a diamondlightsource-cs-web-lib-***.tgz file. This can be installed into Daedalus.

   cd daedalus
   npm uninstall @diamondlightsource/cs-web-lib
   npm install /path/to/file/diamondlightsource-cs-web-lib-**.tgz

Then, build Daedalus for production

   npm run build
   npm run preview
   
This is reachable at localhost:4173

## Metrics

These scripts are adapted/based on those found on the `performance` branch of cs-web-lib (here)[]

### CPU
The .`/cpu_monitor.sh` script can be used to monitor the CPU and memory usage of a process by passing the PID as an argument:

	./cpu_monitor.sh -p <PID>

The `-a` argument can also be used to average the CPU usage over 10 seconds.

### Load time

The time taken to load the webpage can be timed by eye or using the Network tab in the Browser Developer Tools, which provides a breakdown of render time.

### Other methods

React prvovides a Profiler componeny, which can be used for profiling. This runs by default in dev mode but is disabled in build mode, with additional configuration needed to make it work.

Additionally, the React dev-tools extension can be used in browser. This requires a recent version of Firefox.

## Performance tests

You can test loading various Daedalus pages from the scripts provided.

### Firefox pages

You can modify `browser/openFirefox.js` to change the number, and type, of Daedalus pages opened simply by modifying the contents or length of the array.

By default, this opens all new pages as tabs in the same window. Firefox settings must be modified to open in new windows:

- From a browser navigate to: `about:config`
- Search for the preference: `browser.link.open_newwindow` and set this to `2` (default is `3`).

Run `firefox browser/openFirefox.html` to execute.

### Phoebus

To open multiple Phoebus screens, use `./start_phoebus.sh`. Modify the script to pass in different sized arrays to open different numbers of files. THis script can also be adapted to open Phoebus as new windows instead of new tabs.

