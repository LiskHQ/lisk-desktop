# Lisk Nano

[![Build Status](https://travis-ci.org/LiskHQ/lisk-nano.svg?branch=development)](https://travis-ci.org/LiskHQ/lisk-nano)
[![Coverage Status](https://coveralls.io/repos/github/LiskHQ/lisk-nano/badge.svg?branch=development)](https://coveralls.io/github/LiskHQ/lisk-nano?branch=development)
[![License: GPL v3](https://img.shields.io/badge/License-GPL%20v3-blue.svg)](http://www.gnu.org/licenses/gpl-3.0)

## Development

```
git clone https://github.com/LiskHQ/lisk-nano.git
cd lisk-nano
npm install
cd src
npm install
npm run dev
```

Open http://localhost:8080

## Build

```
npm run build
```

## Electron

### Start

Start the Electron client.

```
npm run start
```

### Windows

Build package for Windows.

```
npm run dist:win
```

### Mac OS X

Build package for Mac OS X.

```
npm run dist:osx
```

### Linux

Build package for Linux.

```
npm run dist:linux
```

## Run unit tests

### Single run
```
npm run test
```

### Run each time a file changes
```
npm run test-live
```

## Run end-to-end tests

### Setup

To setup protractor as described on http://www.protractortest.org/#/ run:

```
npm install -g protractor
webdriver-manager update
webdriver-manager start
```

Setup a lisk test node to run on localhost:4000 as described in https://github.com/LiskHQ/lisk#tests

Make sure that the Lisk version of the node matches version in https://github.com/LiskHQ/lisk-nano/blob/development/src/app/services/peers/peer.js#L16

Make sure there are some transactions on the master account so we can test they display correctly:
```
for i in {1..20}
do
   curl -k -H "Content-Type: application/json" -X PUT -d '{"secret":"wagon stock borrow episode laundry kitten salute link globe zero feed marble","amount":'"$i"'0000000,"recipientId":"537318935439898807L"}' http://localhost:4000/api/transactions; echo ''
done
```

### Run

Start the development version of lisk-nano:

```
cd src
npm run dev
```

Run the protractor tests:

```
npm run e2e-test
```

## Authors

- Ricardo Ferro <ricardo.ferro@gmail.com>
- Oliver Beddows <oliver@lightcurve.io>
- Vít Stanislav <vit@lightcurve.io>
- Tobias Schwarz <tobias@lightcurve.io>
- Ali Haghighatkhah <ali@lightcurve.io>

## License

Copyright © 2016-2017 Lisk Foundation

This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.

This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License for more details.

You should have received a copy of the [GNU General Public License](https://github.com/LiskHQ/lisk-nano/tree/master/LICENSE) along with this program.  If not, see <http://www.gnu.org/licenses/>.

***

This program also incorporates work previously released with lisk-nano `0.1.2` (and earlier) versions under the [MIT License](https://opensource.org/licenses/MIT). To comply with the requirements of that license, the following permission notice, applicable to those parts of the code only, is included below:

Copyright © 2016-2017 Lisk Foundation  
Copyright © 2015 Crypti

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
