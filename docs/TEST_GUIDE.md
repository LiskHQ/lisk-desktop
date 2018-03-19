# Test guide

This project uses 3 layers of automated tests (unit, integration, and end-to-end). 
It is very powerful setup, but at the same time it can be challenging to choose appropriate 
level of test for the problem at hand. 
This is the reason why this guide was created. 

The goal of this guide is to provide an overview of used types of tests, describe their pros and cons, and give hints for when to use which.

## Unit tests

### What do they test?
One unit (e.g. component, util, reducer, middleware) in isolation.

### Where do they live?
Each unit test live in the same folder as the unit that it tests. E.g. tests for [/src/components/login/login.js](/src/components/login/login.js) are in [/src/components/login/login.test.js](/src/components/login/login.test.js).

### What tools are used?
- **Assertions** use `expect` syntax of [http://www.chaijs.com/](chai), e.g.:
https://github.com/LiskHQ/lisk-hub/blob/80afda8289b75cb70bf345d14d36117fde2bdd90/src/utils/passphrase.test.js#L136

- **Spies, stubs, ands mocks** use [http://sinonjs.org/](sinon), e.g.:
https://github.com/LiskHQ/lisk-hub/blob/19a2a613fa08a34fe3088b0e40c11c7fa37a645d/src/store/middlewares/savedSettings.test.js#L20

- To test **React compoments** we use [http://airbnb.io/enzyme/](enzyme), e.g.:
https://github.com/LiskHQ/lisk-hub/blob/79165170a326a7f98efee098732e55be37d31223/src/components/toolbox/sliderCheckbox/index.test.js#L21
