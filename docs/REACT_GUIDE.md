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

## What should be inside render function of a component?

TODO

## How to pass props into a component?

TODO

## How to unit-test components, what should be mocked, what to assert on?

TODO
