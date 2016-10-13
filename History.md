
v0.1.1 / 2016-10-13
==================

  * Add support for second passphrases. Fix #1.
  * Change new account entropy
  * Auto login after new account is created
  * Changing validation of BIP39, now allows passphrases with 12, 15, 18, 21 or 24 words. Fix #2.
  * Fix webpack warning

v0.1.0 / 2016-08-17
===================

  * Updating build.
  * Changing input type to password.
  * Adding “Edit” submenu with clipboard roles.
  * Removing win.iconUrl property.
  * Changing win target to nsis.
  * Adding electron-builder dependency.
  * Updating build.
  * Fix ngAnnotate in mdDialog controller
  * Remove console.log
  * Remove wrong import.
  * Add a dialog to notify user to save the passphrase and validate a random word
  * Bumping version.
  * Fixing app-category-type deprecation.
  * Adding productName option.
  * Updating build.
  * Disabling "Dev Test Account" button.
  * Changing label.
  * Adding Ricardo as author.
  * Adding missing command.
  * Adding electron instructions.
  * Replacing logo.
  * Removing margins from .logo / .logout.
  * Adding min-width on body.
  * Ignoring .DS_Store files.
  * Fix orderBy field in getTransactions

v0.0.1 / 2016-08-01
===================

  * Update bundle
  * New build config
  * Update dependencies
  * New npm scripts
  * Remove icon in BrowserWindow
  * Add build icons
  * Update dependencies
  * New devDependencies and update npm scripts
  * Change BrowserWindow config
  * Add electron icons
  * Update build
  * Fix webpack config
  * Update electron package.json
  * Update gitignore
  * Fix webpack configuration
  * Add electron dependencies
  * Update both package.json
  * Change folder structure to electron
  * Remove build folder
  * Update build
  * Add max validation to (balance - 0.1) in send component
  * Create the ‘from’ method in lsk service to convert amount to raw value
  * Update dependencies
  * Update build
  * Fix layout issue in Safari
  * Add meta viewport
  * Add host 0.0.0.0 in webpack-dev-server
  * Update build
  * Change peer status view
  * Change logout button
  * Update build
  * Add fonts imports
  * Remove cdn
  * Add fonts
  * Webpack config improvements
  * New npm scripts and dependencies
  * Add new webpack config
  * Fix imports of vendor dependencies
  * Remove webpack directory
  * Remove 'app' imports
  * Rename src to app
  * Add webpack-merge and webpack-validator dependencies
  * Update build
  * Big error handling improvements and ping check on $peers
  * Add check on peer selection
  * Fix onError message
  * New top component with peer check view
  * Add a check  in peer service
  * Loading improvements in transactions component
  * Reset account in logout()
  * Change service structure
  * $peers improvements
  * Update build
  * Remove auto login
  * Update build
  * Transactions component improvements
  * Peers selection improvements
  * New lsk component
  * Change webpack-dev-server config
  * Transations component improvements
  * Change LSK number format
  * Change timestamp view
  * Peer selection improvements in main component
  * New peers service
  * Rename peer service
  * Improvements in login component and remove peer selection
  * Add lodash dependency
  * Update build
  * New main component
  * New top component
  * Add option in lsk component to append 'LSK'
  * Change column name in transactions
  * Fix limit in transactions request
  * Add updates on broadcast calls
  * Change full date view in transactions
  * Add broadcast call on peer update
  * Change timestamp directive to component
  * Remove timestamp service and filter
  * Add transaction id column in transactions component
  * Fix addresses in transactions component
  * Remove address component
  * Change address directive to component and fix calls
  * Lsk component design improvements
  * Bindings improvements
  * Remove debug
  * Change lsk directive to component and fix calls
  * Fix class names
  * Main directive improvements
  * Update build
  * Change send directive to component
  * Change transactions directive to component
  * Change top directive to component
  * Fix main template
  * Transactions design improvements
  * Fix getAccount to get only the balance when "Account not found" error
  * Fix send directive scope
  * Add testnet
  * Change login directive to component
  * Change main directive to component
  * Beautifying code
  * Add log.info to peer requests
  * Transactions improvements
  * Remove debug
  * Update build
  * Peer select in login improvements
  * Peer choose improvements
  * Add a select field in top directive to choose the peer
  * Update default params of peer service
  * New peers service
  * Update build
  * Fix default peer type
  * Send directive improvements to isolated scope
  * Main directive improvements
  * Add isolated scope in top and send directives
  * Fix address directive scope
  * Improve error handling in peer service
  * Create getAccount method in peer service
  * Update build
  * New transactions directive with "load more" button and isolated scope
  * Change return of getTransactions
  * Fix timestamp directive to use the service
  * Fix imports
  * Create lsk filter using service
  * Create timestamp service and change the timestamp filter
  * Update build
  * Update top component design
  * Remove txtype column
  * Update template of address directive
  * Design improvements
  * Timestamp directive improvements
  * Transactions directive improvements and TxType view
  * LSK directive improvements
  * Send directive improvements
  * Change timestamp format in transactions list
  * Main directive improvements
  * LSK directive improvements
  * Login directive improvements
  * Address directive improvements
  * Top directive improvements
  * Transactions directive improvements
  * Add lsk service
  * Transactions directive improvements
  * Create timestamp filter
  * Change default getTransactions limit
  * Add timestamp filter
  * Update build
  * Improve updating in timestamp directive
  * Improve ngrepeat speed in transactions component
  * Show confirmations in transactions directive
  * Update lsk directive
  * Update timestamp directive
  * Transactions directive improvements
  * Top directive improvements
  * Create address component
  * Create timestamp directive and remove unused filters
  * Add moment dependency
  * Beautifying code
  * Change account directive to top
  * Change history to transactions
  * Change logout button
  * Remove preloading
  * Main template improvements
  * Remove preloading
  * Add angular material loading
  * Update main css
  * Update account directive
  * LSK directive improvements
  * Add new lsk directive
  * Remove lsk filter
  * Update README.md
  * Update build
  * Error service improvements
  * Add select to choose the peer type and login directive improvements
  * Fix in login directive
  * Remove defualt values in send directive
  * History directive improvements
  * Fix timeout in history component
  * New send component
  * Add import of success directive
  * New main css
  * Peer service improvements and final version of sendTransaction
  * Update default official peers to testnet
  * Create success service
  * Add cancel timeout to updateBalance
  * Add error service
  * Remove console.log
  * Add ngMessages in module dependencies
  * Change dev test account
  * Fix design width
  * Create getNetHash and sendTransaction methods in peer directive
  * Peer directive improvements
  * Update timeouts
  * Change main design width
  * Remove test timeout
  * Peers directives improvements
  * Update build
  * Remove my peer from official list, not synchronized yet
  * New history component
  * Add new imports
  * Add angular-material-data-table dependency and fix angular version
  * Add css loader in webpack
  * Create timestamp filter
  * Create epochStamp filter
  * Move timeouts stack to scope
  * LSK filter improvements
  * Change account view
  * Create getHistory method in peer directive
  * Main directive improvements
  * Peer directive improvements
  * Change default list of official peers
  * Add a temporaty button to use only official peers
  * Peers directive improvements
  * Peer directive improvements
  * Add the peer url on the view and fix balance view
  * Main directive improvements to use the new peer and peers directive
  * Add peers import
  * Create peers and peer directives
  * Update build
  * New peer factory with endpoint fallback
  * Update build
  * Rename wallet directive to main and structure improvements
  * New send and history directive
  * Remove balance directive
  * New main css
  * Remove usd filter
  * New login directive
  * Crete peer service to manage the endpoint connections
  * Update cdn versions of angular and angular-*
  * Add debug module dependency
  * Design improvements
  * Change usd filter
  * Change structure
  * Remove services folder
  * New account component design
  * Fix imports
  * Beautifying code
  * Create component balance
  * Add usd and lsk filters
  * Add numeral dependency
  * Update build
  * Change to fix a bug in safari
  * Data update improvements
  * Update build
  * Design improvements
  * Beautifying code
  * Update build
  * Improvements in balances update and directives
  * Update build
  * Switch pug to jade to fix requires
  * Update build
  * Components improvements
  * Add lisk icons and update readme
  * Design improvements
  * Wallet and login improvements
  * Fix components load
  * New structure and design
  * Update build
  * New webpack config
  * Update wallet component
  * Preloading improvements
  * New structure
  * webpack-dev-server improvements
  * Add lisk-js dependency
  * New webpack config
  * Webpack improvements and build update
  * New webpack structure
  * New webpack config to separate dev and dist builds
  * Update dist
  * New webpack config
  * Style improvements
  * New structure
  * Fixes to ng-annotate-webpack-plugin
  * Add tooltip in close button
  * Add ng-annotate-webpack-plugin dependency
  * Npm scripts improvements
  * Change the timeout to simulate the load
  * Remove byte directive
  * Update dist
  * Login directive improvements
  * Add dist folder with compiled version
  * Remove dist from gitignore
  * Change entropy factor
  * Fix theme.js
  * Remove js folder unused
  * Fix dependency injection of angular
  * Fix wallet directive fullscreen style
  * Fix wallet directive fullscreen style
  * New structure and directives
  * Add material icons cdn
  * New main style
  * Add Robot import
  * Change theme background
  * Login directive improvements and random creation
  * Add directive animateOnChange
  * Add ngAnimate dependency
  * Add material theme with lisk's media kit colors
  * New structure of angular and passphrase login validation
  * Add bitcore-mnemonic and json-loader
  * Dev server improvements
  * README improvements
  * Npm scripts improvements
  * New npm scripts and structure improvements
  * New gitignore
  * New npm scripts
  * Fix webpack with ExtractTextPlugin
  * Move preload css to main style
  * Add pug and less to webpack resolve extensions
  * New npm scripts
  * Add cdn to angular, jquery and material
  * New webpack config with plugin html-webpack-plugin and babel support
  * Add html-webpack-plugin in devDependencies
  * README improvements
  * Add rimraf to devDependencies
  * New npm scripts
  * New gitignore
  * Change directive template to inline with webpack
  * Update style
  * Fixes to webpack
  * Remove gulp
  * Remove build folder and add to gitignore
  * Replacement of jspm by webpack
  * Improvements in main template
  * Update app style
  * Fixes in gulp tasks
  * Update README with development steps
  * Add gulp-concat and gulp-order in devDependencies
  * Fix README
  * Add start structure of project and your build dir
  * Add gulpfile and gulp tasks
  * Update gitignore to exclude jspm temporary files
  * Add config.json with gulp and cdn config
  * Update package.json with new devDependencies and jspm config and dependencies
  * Add jspm dependency
  * Initial structure
