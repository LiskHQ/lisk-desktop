# Lisk Nano

[![Build Status](https://travis-ci.org/LiskHQ/lisk-nano.svg?branch=development)](https://travis-ci.org/LiskHQ/lisk-nano)

## Development

```
git clone https://github.com/LiskHQ/lisk-nano.git
cd lisk-nano
npm install
cd src
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
   curl -k -H "Content-Type: application/json" -X PUT -d '{"secret":"wagon stock borrow episode laundry kitten salute link globe zero feed marble","amount":'"$i"',"recipientId":"537318935439898807L"}' http://localhost:4000/api/transactions; echo ''
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
protractor spec/conf.js
```

## Authors

Ricardo Ferro <ricardo@lisk.io>

## License

The MIT License (MIT)

Copyright (c) 2016-2017 Lisk

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:  

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
