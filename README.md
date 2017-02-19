# KTH Facelift Chrome Extension

> Chrome extension for the KTH Facelift research project

## Setup

Install all the dependencies – necessary for anything to work at all.

```bash
$ npm install
```

Build bundle – concatenates and minifies all resources to the `dist` folder.

```bash
$ npm run build
```

Fire up the watch command – watches source files for changes and performs a new build whenever a file is changed/added/removed.

```bash
$ npm run watch
```

Add the `dist` folder as an unpacked extension to Google Chrome.

It's recommended that you use [Extension Reloader](https://chrome.google.com/webstore/detail/extensions-reloader/fimgfedafeadlieiabdeeaodndnlbhid?hl=en) during development. Whenever a change is made to the [dist/manifest.json](dist/manifest.json) file you'll have to remove the extension from Chrome and add it again.
