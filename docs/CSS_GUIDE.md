1. Define class names in camel-case. 
2. For the styling purpose, prefer class names to IDs. 
3. Prefer defining variables for all CSS values describing a certain presentational behaviour and used in multiple places (We use ‘css-next’ variables. Read [this](http://cssnext.io/features/#custom-properties-var) for more information). 
4. There is common css file in app component and if you use a class Name in more than one components, Add it to this file (don’t use this for child and depend components). 
5. Vendor prefixes are not needed since autoprefixer performs this. Read [docs](https://github.com/postcss/autoprefixer) for more information. 
6. Please ensure cross browser compatibility for all major browsers. 
7. Use ‘:global’ before any global classes because we use css modules and it adds a hash to non global class names. 
8. SVG is the preferred format for all the images. 
9. Avoid storing images in directories other than [src/assets/images](/src/assets/images). 
10. Try restricting CSS nesting feature to no more than three levels. 
11. Flexbox is the exploited layout and hence it’s preferred project wide (check [docs](https://css-tricks.com/snippets/css/a-guide-to-flexbox/) for more information). 
12. Use kebab-case for naming the assets. 
13. Try to encapsulate global variables with another variable in the component specific stylesheet. 
14. Use kebab-case to define variables.