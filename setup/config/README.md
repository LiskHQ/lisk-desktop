## Config files

This folder contains config files. There are several webpack config files.

The configs are separated so that each file represents one of these options:

- a build targets (e.g. [production build](./webpack.config.prod.js), [dev server](./webpack.config.dev.js), [electron main process](./webpack.config.electron.js))
- common setup imported from two or more targets (e.f. [base](./webpack.config.js), [react](./webpack.config.react.js))

Use of each file should be clear from the name. If in doubt, refer to use of the config files from [package.json](../package.json) `scripts`.
