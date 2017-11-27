1. Use camel-case and avoid dash separation when you define a className. 
2. For the styling purpose, prefer class names to IDs 
3. Define a variable for all colors and sizes that you uses in css file (we use ‘css-next’ variables. read [this](http://cssnext.io/features/#custom-properties-var) for more information. 
4. There is common css file in app component and if you use a class Name in more than one components, Add it to this file(don’t use this for child and depend components)  
5. Don’t use browser css prefixes (like -moz) because we add them by ‘autoprefixer` module. Read [this](https://github.com/postcss/autoprefixer) for more information. 
6. Before submit any codes please check it in all common browsers 
7. Use ‘:global’ before any global classes because we use css modules and it adds a hash to non global class names 
8. All the images should be in svg format  
9. Put all images in images folder in ‘src/assets’ 
10. Don’t use nesting more than three level 
11. Use Flexbox layout and don’t use float to create your layouts ( check [this](https://css-tricks.com/snippets/css/a-guide-to-flexbox/) for more information ) 
12. Use kebab-case for naming the assets 
13. All sizes and colors should define as variable 
14. If you use a variable in more than one component please add it to variables.css in app component 
15. Try to isolate these variables with another variable in the component specific stylesheet 
16. Use kebab-case to define variables