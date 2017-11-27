1. Start class names with lowercase letters. 
2. Use camelCase and avoid dash separation. 
3. Don’t use ID to style html elements 
4. Define a variable for all colors and sizes that you uses in css file (we use ‘css-next’ variables. read [this](http://cssnext.io/features/#custom-properties-var) for more information. 
5. There is common css file in app component and if you use a class Name in more than one components, Add it to this file(don’t use this for child and depend components)  
6. Don’t use browser css prefixes (like -moz) because we add them by ‘autoprefixer` module. Read [this](https://github.com/postcss/autoprefixer) for more information. 
7. Before submit any codes please check it in all common browsers 
8. Use ‘:global’ before any global classes because we use css modules and it adds a hash to non global class names 
9. All the images should be in svg format  
10. Put all images in images folder in ‘src/assets’ 
11. Don’t use nesting more than three level 
12. Use Flexbox layout and don’t use float to create your layouts ( check [this](https://css-tricks.com/snippets/css/a-guide-to-flexbox/) for more information ) 
13. Use dash (-) to separate words in name of images 
14. All sizes and colors should define as variable 
15. If you use a variable in more than one component please add it to variables.css in app component 
16. Try to isolate these variables with another variable in the component specific stylesheet 
17. Use dash (-) to separate words in variables