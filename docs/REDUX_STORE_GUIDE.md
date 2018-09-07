# Lisk Hub Redux State Guideline

## Table Of Contents

1. [Redux state](#redux-stores)
1. [Redux state practices](#redux-practices)

1. [Refactor proposals](#refactor-proposals)
	1. [Reducing number of actions](#reducing-number-of-actions)
	1. [Removal of logic in reducers](#removal-of-logic-in-reducers)

## Redux state

**Current store keys**
```
{
	account: {}, // current account logged in
	peers: {}, // where the application connects to
	dialog: {}, // used internally for application UI interactions
	voting: {}, // which delegates an account has voted
	loading: [], // used internally for application UI interactions
	toaster: [], // used internally for application UI interactions
	transactions: {}, // transactions belonging to logged in account
	transaction: {}, // a single transaction belonging to any account
	followedAccounts: {}, // accounts followed by logged in account
	search: {}, // data entities searched in Core {accounts, transactions, delegates, blocks}
	settings: {}, // flags setted by user for preferences, as well as application settings
	delegate: [], // if the account is a delegate
	liskService: [], // external services outside Core api {price candles, feednews, feedback, analytics}
	filters: {}, // used internally for application UI interactions
}
```

## Redux state practices

_Data belonging to the same entity must hang under the same entity store key._

Lisk Hub and Lisk Core have multiple data entities {account, transaction, block, node, settings,}, and an application also has it's own data entities {dialog status, toast messages, filter setted, application settings, services} etc. 


Patterns should be defined so that data belonging to the same entitiy hang in the tree structure of the parent key they belong.

- `An account has transactions, has some followedAccounts, has voted to some delegates, has some preffered settings`

- `An application has services, has settings, has data entities, has filters, has loading dialogs, has toast messages`

**Ideal store structure**

```
{
	account: {
		followedAccounts: {},
		transactions: {},
		transaction: {},
		voting: {},
		delegate: [],
		settings: {},
	},
	application: {
		peers: {},
		dialog: {},
		loading: [],
		toaster: [],
		search: {
			transaction: {},
		},
		settings: {},
		liskService: [],
		filters: {},
	}
}
```

## Refactor proposals

##### Reducing number of actions
_Group updates on same store key in same action._

On application initialisation two actions are dispatched to update status of key `peers`:
```
"ACTIVE_PEER_SET" // sets all peer data
"ACTIVE_PEER_UPDATE" // sets a flag indicating status {online, offline}
```
When `ACTIVE_PEER_SET` is triggered we request constants to Core.

[At this point](https://github.com/LiskHQ/lisk-hub/blob/e84b99d/src/actions/peers.js#L42), we should already dispatch `peerSet` with the following status flag:

```
status: {
  online: {true|false} // depending if the request to constants resolves, or rejects.
},
```

- We can rehuse here the same action `peerSet` and pass the additional property `status`, the reducer should properly spread and merge, action data fields, thus assuring that for the same action only the status flag is updated.

- We can reduce the ammount of actions only updating certain parts (e.g. `ACTIVE_PEER_UPDATE`), which make the application state management more granular and difficult to trace back and maintain. 

- Additionally, meaningful names should be used, like `updatePeers` which clearly reflects there's going to be an update on one of the store key `peers` field. Actions dispatched are in charge to set which parts of the key should be updated.

##### Removal of logic in reducers
_Use different action names._

There should be no logic in reducers to find out which parts of the store needs an update based on which action data has been passed through.
  [See example](https://github.com/LiskHQ/lisk-hub/blob/e84b99d/src/store/reducers/voting.js#L69)
  - In this example the `refresh` flag is used to update store key `delegates` only if the flag is present.
  - We could split this into two actions, `resetDelegates`, `updateDelegates`, and remove the flag `refresh` to facilitate application state management in the long term.

