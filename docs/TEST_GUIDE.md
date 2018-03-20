# Test guide

This project uses 3 layers of automated tests (unit, integration, and end-to-end). 
It is very powerful setup, but at the same time it can be challenging to choose appropriate 
level of test for the problem at hand. 
This is the reason why this guide was created. 

The goal of this guide is to provide an overview of used types of tests, describe their pros and cons, and give hints for when to use which.

## Unit tests

### What do they test?
One unit ([component](/src/components), [util](/src/utils), [action](/src/actions), [reducer](/src/store/reducers), [middleware](/src/store/middlewares), or [subscriber](/src/store/subscribers)) in isolation.

### Where do they live?
Each unit test live in the same folder as the unit that it tests. E.g. tests for [/src/components/login/login.js](/src/components/login/login.js) are in [/src/components/login/login.test.js](/src/components/login/login.test.js).

### What tools are used?
- **Assertions** use `expect` syntax of [chai](http://www.chaijs.com/), e.g.:
https://github.com/LiskHQ/lisk-hub/blob/80afda8289b75cb70bf345d14d36117fde2bdd90/src/utils/passphrase.test.js#L136

- **Spies, stubs, ands mocks** use [sinon](http://sinonjs.org/), e.g.:
https://github.com/LiskHQ/lisk-hub/blob/19a2a613fa08a34fe3088b0e40c11c7fa37a645d/src/store/middlewares/savedSettings.test.js#L20

- To test **React compoments** we use [enzyme](http://airbnb.io/enzyme/), e.g.:
https://github.com/LiskHQ/lisk-hub/blob/79165170a326a7f98efee098732e55be37d31223/src/components/toolbox/sliderCheckbox/index.test.js#L21


## Integration tests

### What do they test?
Integration of all components, utils, reducers and middlewares on one page, e.g. [Login](/test/integration/login.test.js), [Wallet](/test/integration/wallet.test.js), [Delegates](/test/integration/voting.test.js).

### Where do they live?
Integration tests for each page have their own file in [/test/integration/](/test/integration).

### What tools are used?
- All that are used for unit tests.
- [mocha-steps](https://www.npmjs.com/package/mocha-steps) to write the tests in a more [BDD](https://en.wikipedia.org/wiki/Behavior-driven_development) way.
- Our own **generic step definitions** https://github.com/LiskHQ/lisk-hub/blob/bfc94e4f46b4e2393bcc1a0ecd6f1bc85590b6a6/test/utils/genericStepDefinition.js
- Our own **mount helper** that wraps `enzyme.mount` to avoid some code repetition: https://github.com/LiskHQ/lisk-hub/blob/bfc94e4f46b4e2393bcc1a0ecd6f1bc85590b6a6/test/utils/mountHelpers.js
