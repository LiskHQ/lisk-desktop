# Lisk Hub Extension Guideline

## How to create new extension?
In your extension you will have access to `React` and `LiskHubExtensions` that allows to add Your extension to specified ares in our code.

![Alt text](./assets/create_extension_1.png?raw=true "Github File with extension")

For building Your Component You can use ES6 and babel plugin in our app will handle everything else for You.

![Alt text](./assets/create_extension_2.png?raw=true "Github File with extension")

#### LiskHubExtensions
| Properties          |                    Description                 |
| --------------- |---------------------------------------------|
| `addModule({ identifier, component })` | identifier: `String`, component: `Component` <br/> Adds new component to the place we specify               |
| `components`            | Contains shared styled components that We use in our app.             |
| `identifiers`            | Identifier you pass to addModule() `dashboardColumn1, dashboardColumn2, dashboardColumn3`. It will add your component below dashboard components in specific column          |

![Alt text](./assets/create_extension_3.png?raw=true "Github File with extension")

#### Props
Data from our store is accessible via `this.props.data` and actions to modify our store are in `this.props.actions`. Keep in mind that We are not sharing all data and actions. In case You want to access sth that is unavaliable let us know by creating a feature proposal/ticket in our repo.

## How to add new extension?

1. Open our [repository](https://github.com/michaeltomasik/extensions-lisk) with all extensions.
2. Click on the component you want to integrate.
3. Once You have file open click `Raw`.

![Alt text](./assets/add_extension_raw.png?raw=true "Github File with extension")

4. Copy url link.

![Alt text](./assets/add_extension_link.png?raw=true "Github raw link")

5. Paste Your url to input field and press Add Extension.

![Alt text](./assets/add_extension_page.png?raw=true "Extension page")

6. Open page where You targeted Your component to be in lisk-hub.

![Alt text](./assets/add_extension_dashboard.png?raw=true "Extension added to dashboard")

## How to Share Your extension with others?
Once Your component was created You need to add it our [repository](https://github.com/michaeltomasik/extensions-lisk). In order to do it 
1. Create your own fork or branch.
2. Add your component.
3. Create Pull Request.

First We need to verify Your code and then We will merge Your extension.


