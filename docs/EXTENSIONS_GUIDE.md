# Lisk Hub Extension Guideline
``` ⚠️ Extension System is only avaliable in development mode ⚠️```

## How to create a new extension?
In your extension, you will have access to `React` and `LiskHubExtensions` that allows adding Your extension to specified areas in our code.

![Alt text](./assets/create_extension_1.png?raw=true "Github File with extension")

For building Your Component, You can use es6 and our wrapper will transpaile it for You.

![Alt text](./assets/create_extension_2.png?raw=true "Github File with extension")

#### LiskHubExtensions
| Properties          |                    Description                 |
| --------------- |---------------------------------------------|
| `addModule({ identifier, component })` | identifier: `String`, component: `Component` <br/> Adds new component to the place we specify               |
| `components`            | Contains shared styled components that We use in our app.             |
| `identifiers`            | Identifier you pass to addModule() `dashboardColumn1, dashboardColumn2, dashboardColumn3`. It will add your component below dashboard components in specific column          |

![Alt text](./assets/create_extension_3.png?raw=true "Github File with extension")

#### Props
Data from our store is accessible via `this.props.data` and actions to modify our store are in `this.props.actions`. Keep in mind that We are not sharing all data and actions. In case You want to access sth that is unavailable let us know by creating a feature proposal/ticket in our repo.

#### How to Share Your extension with others?
Once Your component was created You need to add it our [repository](https://github.com/michaeltomasik/extensions-lisk). In order to do it 
1. Create your own fork or branch.
2. Add your component.
3. Create Pull Request.

First We need to verify Your code and then We will merge Your extension.
## How to add a new extension?

1. Open our [repository](https://github.com/michaeltomasik/extensions-lisk) with all extensions.
2. Click on the module you want to integrate.
3. Once You have file open click `Raw` to get the code.

![Alt text](./assets/add_extension_raw.png?raw=true "Github File with extension")

4. Copy url link.

![Alt text](./assets/add_extension_link.png?raw=true "Github raw link")

5. Open `/extensions` page
6. Paste Your url to input field and press Add Extension.

![Alt text](./assets/add_extension_page.png?raw=true "Extension page")

7. Open page where You targeted Your component to be in lisk-hub.

![Alt text](./assets/add_extension_dashboard.png?raw=true "Extension added to dashboard")


