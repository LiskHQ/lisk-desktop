# React Components Guidelines

## What is the folder/file structure of components?
Components are in folder `/src/components`. Top level folder contains components that are a separate page, a separate module, or shared in multiple places. 

So, each component folder contains at least `index.js` file. 
e.g. here:
https://github.com/LiskHQ/lisk-hub/blob/def4b5f760/src/components/sidechains/index.js

If the component is bigger, it is split into two files `index.js` contains the HOC (connected component) and `<componentName>.js` contains the actual component.
e.g. here:
https://github.com/LiskHQ/lisk-hub/blob/def4b5f760/src/components/converter/converter.js
https://github.com/LiskHQ/lisk-hub/blob/def4b5f760/src/components/converter/index.js

If the component gets bigger than 200 lines, it should be split into multiple components that should reside in the same folder (if used only from this one component).
https://github.com/LiskHQ/lisk-hub/blob/def4b5f760/src/components/login/

### How to process props in a component?
Props should be handled with object destructuring.

In case of stateless component like this:
https://github.com/LiskHQ/lisk-hub/blob/796ce53fa637a6806b2ac3279dcf1d893f0805db/src/components/account/account.js#L14

In case of class component like this:
https://github.com/LiskHQ/lisk-hub/blob/796ce53fa637a6806b2ac3279dcf1d893f0805db/src/components/accountInitialization/index.js#L26-L27

This way we can easily move code between functional and classy components, without changing `props` from/to `this.props` and vice versa.

There are still cases where `this.props` is used, like here https://github.com/LiskHQ/lisk-hub/blob/796ce53fa637a6806b2ac3279dcf1d893f0805db/src/components/accountTransactions/accountTransactions.js#L9-L26 from before this guideline was established. They will be around for some time, but the preferred way for new code is to use object destructuring.

## What should be inside render function of a component?

1. `this.props` destructuring, if props are used.
2. all other variable definitions that are needed, e.g. https://github.com/LiskHQ/lisk-hub/blob/796ce53fa637a6806b2ac3279dcf1d893f0805db/src/components/votesPreview/index.js#L37-L54
3. exactly one `return` statement with JSX of the component

There shouldn't be multiple `return` statements with some `if-else` or `switch-case` statements, this might mean that the component should be split into multiple components. 

There shouldn't any complex computation - it should be in an helper function or method. There shouldn't be any `for` or `while` loop  to compute something. When there is a need for a list view in JSX, `map` function should be used.

All JSX should be in `render` method, there shouldn't be any helper methods with JXS (like in https://github.com/LiskHQ/lisk-hub/blob/796ce53fa637a6806b2ac3279dcf1d893f0805db/src/components/transactions/transactionDetailView/transactionDetailView.js#L53-L65 ) but rather it should be a separate component.

## How to unit-test components, what should be mocked, what to assert on?

TODO
