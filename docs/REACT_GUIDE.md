# React Components Guidelines

## Functional VS Class components

Use functional components instead of class components.

## What is the folder/file structure of components?

Each component folder contains at least an `index.js` file.

If the component becomes larger than 200 lines, it should be split into multiple components that should reside in the same folder (if used only from this one component).

###  Component Example
```
├── Foo/                           # Component folder Foo
│   ├── index.js                   # Uses <Bar /> and <Baz />
│   ├── Foo.css                    #
│   ├── Bar/                       # Can be used in any component inside Foo/
│   │   ├── index.js               # Uses <Qux />
│   │   ├── Bar.css                #
│   │   ├── Qux/                   # Can be used in any component inside Bar/
│   │       ├── index.js           #
│   │       ├── Qux.css            #
│   ├── Baz/                       # Can be used in any component inside Foo/
│   │   ├── index.js               #
│   │   ├── Baz.css                #
```

### How to process props in a component?

Props should be handled with object destructuring.

`const Foo = ({ className }) => ({});`

NOT

`const Foo = (props) => ({});`
