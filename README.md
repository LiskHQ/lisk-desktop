# Lisk Desktop

[![Build Status](https://jenkins.lisk.com/buildStatus/icon?job=lisk-desktop/development)](https://jenkins.lisk.com/job/lisk-desktop/job/development)
[![Coverage Status](https://coveralls.io/repos/github/LiskHQ/lisk-desktop/badge.svg?branch=development)](https://coveralls.io/github/LiskHQ/lisk-desktop?branch=development)
[![License: GPL v3](https://img.shields.io/badge/License-GPL%20v3-blue.svg)](http://www.gnu.org/licenses/gpl-3.0)
![GitHub package.json version](https://img.shields.io/github/package-json/v/LiskHQ/lisk-desktop)
[![DeepScan grade](https://deepscan.io/api/teams/6759/projects/8871/branches/113511/badge/grade.svg)](https://deepscan.io/dashboard#view=project&tid=6759&pid=8871&bid=113511)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](https://makeapullrequest.com)
![Discord](https://img.shields.io/discord/405002561775599619)
[![GitHub issues](https://img.shields.io/github/issues/LiskHQ/lisk-desktop)](https://github.com/LiskHQ/lisk-desktop/issues)
![GitHub closed issues](https://img.shields.io/github/issues-closed/liskhq/lisk-desktop)

## Installation

You can download the latest release from [Lisk.com](https://lisk.com/wallet). The link automatically detects your operating system and downloads the correct app. Currently we are supporting the following operating systems:

- MacOS (individual builds for Apple Silicon and Intel chips)
- Windows
- Linux

## For Contributors

Please see [CONTRIBUTING_GUIDE.md](/docs/CONTRIBUTING_GUIDE.md) for more information.

## Development

### Using Commercial Fonts

`Basier Circle` and `Gilroy` used in the production version are commercial fonts. This repository only contains open fonts and uses `Open Sans` as a replacement for the commercial ones.

If you have licensed copies of `Basier Circle` and `Gilroy`, you can add them to [fonts folder](./src/assets/fonts). If you don't have the fonts, you need to remove lines 25 - 81 of [type.css](./src/components/app/type.css). After that, the `build` and `dev` npm scripts run without any errors.

### Setup environment

The development environment currently depends on:

- [Node.js version 16 (lts/gallium)](https://nodejs.org/download/release/latest-v16.x/). The below instructions assume [nvm](https://github.com/nvm-sh/nvm) is being used to manage Node.js versions.
- [Python version 2.7.18 is required](https://www.python.org/downloads/release/python-2718/) is being used on encrypt/decrypt by the [lisk-sdk](https://github.com/LiskHQ/lisk-sdk/tree/development/sdk#dependencies).

_Note_:
For _Windows_ users, make sure to set the correct [msvs_version](https://www.npmjs.com/package/node-gyp#on-windows) config for installing and packing the Lisk Desktop application.

```
git clone https://github.com/LiskHQ/lisk-desktop.git
cd lisk-desktop
nvm use
npm ci
npm run dev
```

### Run on browser

Open http://localhost:8080

If you are actively developing in a specific route, and want to be automatically signed in every time you reload the page, please add the following input pairs to your localStorage:

_loginKey_: _a valid passphrase_

Add the above pair using the storage tab in your dev tools or via JavaScript command:

```
localStorage.setItem('loginKey', 'wagon stock borrow episode laundry kitten salute link globe zero feed marble') // desired account passphrase
```

When developing with hardware wallet, this will sign you in using the first account on the first connected hardware wallet:

```
localStorage.setItem('hwWalletAutoLogin', true);
```

You can use the same approach to define a desired network to which Lisk Desktop connects:

```
localStorage.setItem('liskServiceUrl', 'http://localhost:4000') // desired node to log in into
```

### Build

#### Production build

To build the project simply run

```
npm run build
```

Under the hood, this script runs

```
npm run build:prod
```

to build the React app under `src/` and

```
npm run build:electron
```

to build the electron app under `app/` using webpack. You can run the above scripts individually if you're looking to see the changes solely on one of the two said applications.

### Run Electron

If you have already built the application as described above, you can launch Electron using

```
npm run start
```

#### Run with parameters

To launch a version which supports hardware wallets, you can run

```
npm run dev:hw
```

or to launch electron and receive live updates from already running `webpack-dev-server` on port `8080` and you can run

```
LISK_DESKTOP_URL="http://localhost:8080" DEBUG=true npm run start
```

This comes with Redux dev tools.

### Distribution

#### Windows

Build package for Windows (on Windows in [Git BASH](https://git-for-windows.github.io/)).

```
npm run pack:win
```

#### macOS

Build package for macOS (on macOs)

```
npm run pack
```

#### Linux

Build package for Linux (on Linux).

```
npm run pack
```

## Testing

### Unit tests

#### Single run

```
npm run test
```

#### Run each time a file changes

```
npm run test:live
```

### E2E tests

In order to run e2e tests you need to install [lisk-core](https://github.com/LiskHQ/lisk-core) as well as [lisk-service](https://github.com/LiskHQ/lisk-service).

#### Setup Lisk Core

Setup a lisk test node as described in Preparing Node headline under [the tests section of Lisk Framework README](https://github.com/LiskHQ/lisk-sdk/tree/development/framework).

#### Setup Service

Run Lisk Service against an already running local node as described in Preparing Node headline under [the installation section of Lisk Service README](https://github.com/liskhq/lisk-service#installation).

#### Run

Start the development version of Lisk:

```
npm run dev
```

Apply blockchain snapshot

```
./test/e2e-test-setup.sh ~/git/lisk/
```

(replace `~/git/lisk/` with your path to lisk core)

Run e2e tests

```
npm run cypress:run
```

## Directory Layout

```
├── __mocks__/                     # Modules used to mock dependencies for testing purpose.
├── app/                           # Electron based application that launces the react app.
├── build/                         # Build specific materials.
├── config/                        # Automation scripts (Webpack configurations, i18n scanner, etc)
├── coverage/                      # Results of Jest test coverage.
├── dist/                          # Platform specific built outputs.
├── docs/                          # Project documentations such as contribution guides and development guidelines.
├── i18n/                          # Localization files inluding setup scripts and translation json files.
├── libs/                          # Modules which can be consumed individually in other projects.
├── node_modules/                  # 3rd-party libraries and utilities.
├── src/                           # Application source code.
│   ├── app/                       # The bootstrap React application
│   ├── assets/                    # Static files (images, fonts, etc)
│   ├── components/                # React presentational components are located here.
│   │   ├── screens/               # These are the component that represent screens with dedicated URL.
│   │   ├── shared/                # These are the React components used at least in 2 other components (calendar, liskAmount, etc)
│   │   └── toolbox/               # Basic elements with basic styles and functionality which are used in numerous places (button, input, etc)
│   ├── constants/                 # Names, addresses, static configurations and other values used throughout the application
│   ├── context/                   # React context configuration files
│   ├── hooks/                     # React custom hooks
│   ├── store/                     # Redux store resides here.
│   │   ├── actions/               # Store actions reside here and are broken into script files dedicated to each system entity.
│   │   ├── middlewares/           # All the Redux middlewares are places here and have their dedicated script files based on the system entities.
│   │   ├── reducers/              # Redux reducers are located here. similar to actions and reducers, they are placed in script files named after the entity they represent.
│   ├── utils/                     # Utility functions
└──test/                           # E2E tests written with Cypress.io and Cucumber; also some helpers used by unit test that live in /src
```

## Contributors

See [contributors section](https://github.com/LiskHQ/lisk-desktop/graphs/contributors).

## License

Copyright © 2016-2023 Lisk Foundation

This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.

This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License for more details.

You should have received a copy of the GNU General Public License along with this program. If not, see [http://www.gnu.org/licenses/.](http://www.gnu.org/licenses/)
