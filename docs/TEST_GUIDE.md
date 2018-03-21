# Test guide

This project uses 3 layers of automated tests (unit, integration, and end-to-end). 
It is very powerful setup, but at the same time it can be challenging to choose appropriate 
level of test for the problem at hand. 
This is the reason why this guide was created. 

The goal of this guide is to provide an overview of used types of tests, describe their pros and cons, and give hints for when to use which.

### Why multiple levels of test?
Because it is much easier and faster to test small units, but when testing small units separately it doesn't ensure that they will work together.
So we want to use a lot of smaller (unit) tests to cover all the details, because running bigger tests to check all the small details would take much longer.
But then we also need several bigger (integration) tests to make sure that the units work well together and we won't end up like 
[this](https://giphy.com/gifs/unit-test-integration-3o7rbPDRHIHwbmcOBy/fullscreen) or
[this](https://giphy.com/gifs/fail-technology-i5RWkVZzVScmY/fullscreen).
The same argument holds true for unit vs. integration tests as well as for integration vs. end-to-end (E2E) tests. 


## Unit tests

### What do they test?
One unit ([component](/LiskHQ/lisk-hub/blob/development/src/components),
[util](/LiskHQ/lisk-hub/blob/development/src/utils),
[action](/LiskHQ/lisk-hub/blob/development/src/actions),
[reducer](/LiskHQ/lisk-hub/blob/development/src/store/reducers),
[middleware](/LiskHQ/lisk-hub/blob/development/src/store/middlewares), or
[subscriber](/LiskHQ/lisk-hub/blob/development/src/store/subscribers)) in isolation.

### How are they organized?
Each unit test live in the same folder as the unit that it tests. E.g. tests for [/src/components/login/login.js](/LiskHQ/lisk-hub/blob/development/src/components/login/login.js) are in [/src/components/login/login.test.js](/LiskHQ/lisk-hub/blob/development/src/components/login/login.test.js).

Configuration is in [karma.conf.js](/LiskHQ/lisk-hub/blob/development/karma.conf.js) and [config/webpack.config.test.js](/LiskHQ/lisk-hub/blob/development/config/webpack.config.test.js).

### How to run them?
See [relevant sections of README](/LiskHQ/lisk-hub#run-unit-tests)

### What tools are used?
- **Assertions** use `expect` syntax of [chai](http://www.chaijs.com/), e.g.:
https://github.com/LiskHQ/lisk-hub/blob/80afda8289b75cb70bf345d14d36117fde2bdd90/src/utils/passphrase.test.js#L136
- **Spies, stubs, ands mocks** use [sinon](http://sinonjs.org/), e.g.:
https://github.com/LiskHQ/lisk-hub/blob/19a2a613fa08a34fe3088b0e40c11c7fa37a645d/src/store/middlewares/savedSettings.test.js#L20
- To test **React compoments** we use [enzyme](http://airbnb.io/enzyme/), e.g.:
https://github.com/LiskHQ/lisk-hub/blob/79165170a326a7f98efee098732e55be37d31223/src/components/toolbox/sliderCheckbox/index.test.js#L21
- To **assert on React compopnents** we use [chai-enzyme](https://github.com/producthunt/chai-enzyme) because it gives more descriptive messages when the assertion fails, e.g.: https://github.com/LiskHQ/lisk-hub/commit/bc7677c6d5c205449311ac4e18fd3de6fe2b23ff
- To **assert on spies, stubs and mocks** we use [sinon-chai](https://github.com/domenic/sinon-chai), often together with [sinon.match](http://sinonjs.org/releases/v1.17.7/matchers/), e.g.: https://github.com/LiskHQ/lisk-hub/blob/c82683df85b2bc3277c697ebacff24463a8fed2c/src/components/register/register.test.js#L64-L67


## Integration tests

### What do they test?
Integration of all components, utils, reducers and middlewares on one page, e.g. [Login](/LiskHQ/lisk-hub/blob/development/test/integration/login.test.js), [Wallet](/LiskHQ/lisk-hub/blob/development/test/integration/wallet.test.js), [Delegates](/LiskHQ/lisk-hub/blob/development/test/integration/voting.test.js).

### How are they organized?
Integration tests for each page have their own `*.test.js` file in [/test/integration/](/LiskHQ/lisk-hub/blob/development/test/integration).

Configuration is common with unit tests.

### How to run them?
They are run together with unit tests.

### What tools are used?
- All that are used for unit tests.
- [mocha-steps](https://www.npmjs.com/package/mocha-steps) to write the tests in a more [BDD](https://en.wikipedia.org/wiki/Behavior-driven_development) way.
- Our own **generic step definitions** [/test/utils/genericStepDefinition.js](LiskHQ/lisk-hub/blob/bfc94e4f46b4e2393bcc1a0ecd6f1bc85590b6a6/test/utils/genericStepDefinition.js)
- Our own **mount helper** that wraps `enzyme.mount` to avoid some code repetition: [/test/utils/mountHelpers.js](https://github.com/LiskHQ/lisk-hub/blob/bfc94e4f46b4e2393bcc1a0ecd6f1bc85590b6a6/test/utils/mountHelpers.js)


## E2E tests

### What do they test?
Full user scenarios in the application as a whole, including the communication with Lisk Core. 

### How to run them?
See [relevant sections of README](/LiskHQ/lisk-hub#run-end-to-end-tests)

### How are they organized?
E2E tests for each major feature have the tests specified in its own `*.feature` in [/test/e2e/](/LiskHQ/lisk-hub/blob/development/test/e2e). The test specifications in `*.feature` files use [Gherkin](https://github.com/cucumber/cucumber/wiki/Gherkin) language. The implementation of the steps is in [/test/e2e/step_definitions](/LiskHQ/lisk-hub/blob/development/test/e2e/step_definitions). If the step is used just in multiple `*.feature` files, then its definition is in [test/e2e/step_definitions/generic.step.js](test/e2e/step_definitions/generic.step.js). Definition for unique steps of `featureName.feature` is in `featurename.step.js`.

Configuration is in [protractor.conf.js](/LiskHQ/lisk-hub/blob/development/protractor.conf.js).

### What tools are used?
- [Cucumber-js](https://github.com/cucumber/cucumber-js) for Given-When-Then Scenarios and Behaviour-Driven Development.
- [protractor](https://www.protractortest.org/) for E2E test implementation. We use `expect` syntax of [chai](http://www.chaijs.com/) assertions (`expect(...).to.equal(...)`) instead of protractor default jasmine assertions (`expect(...).toEqual(...)`)  to be consistent with unit and integration tests.
- [protractor-cucumber-framework](https://github.com/protractor-cucumber-framework/protractor-cucumber-framework) to connect Cucumber with protractor.
