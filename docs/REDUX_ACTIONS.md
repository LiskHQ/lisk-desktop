# Actions flow from user perspective
## Views action execution

## Dashboard
![alt text](assets/dashboard_screen.png "Dashboard Screen")

When entering actions execution:

| Module          |                    Function                 |
| --------------- |---------------------------------------------|
| Latest activity | `loadTransactions()`                        |
| News            | `liskServiceApi.getNewsFeed()`              |
| Price chart     | `liskServiceApi.getCurrencyGraphData(step)` |


## Wallet
![alt text](assets/wallet_screen.png "Wallet Screen")

When entering actions execution order:

1. `TRANSACTION_FILTERED`
2. `ADD_FILTER`
3. `TRANSACTION_LOADED`
4. `ACCOUNT_ADD_VOTES` for *Account Info*

On every tab change it executes `ADD_FILTER` action and reloading transactions except *Account Info*.

## Delegates
![alt text](assets/delegates_screen.png "Delegates Screen")


When entering actions execution order:

1. `VOTE_LOOKUP_STATUS_CLEARED`
2. `DELEGATES_ADDED`
3. `VOTES_ADDED`
4. `VOTES_UPDATED`

## User scenarios action execution

## Login
![alt text](assets/login_screen.png "Login Screen")

After clicking `Log in` it executes:
- `activePeerSet` with passphrase
  ↪️ Login Middleware
  &nbsp;&nbsp;&nbsp;&nbsp;⬇️ `getAccounts`
  &nbsp;&nbsp;&nbsp;&nbsp;↪️ Socket Middleware
  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;⬇️ `socketSetup`

  ↪️ FollowedAccount Middleware
  &nbsp;&nbsp;&nbsp;&nbsp;⬇️ `followedAccountFetchedAndUpdated` for each followed account


## Logout
![alt text](assets/delegates_screen.png "Logout Screen")

After clicking `Logout` it executes:

- `accountLoggedOut`
  ↪️ Socket Middleware
  &nbsp;&nbsp;&nbsp;&nbsp;⬇️ `closeConnection`


### Sending
![alt text](assets/send_screen.png "Sending Screen")


After clicking `Send` it executes:
- Calls `activePeer.transactions.broadcast(transaction)` and then dispatches `TRANSACTION_ADDED`


### Delegates voting
![alt text](assets/voting_confirm_screen.png "Voting Screen")


After clicking `Confirm` it executes:
- Calls `activePeer.transactions.broadcast(transaction)` and then dispatches `TRANSACTION_ADDED`

## Register second passphrase
![alt text](assets/register_second_passphrase.png "Register Second Passphrase")


After going thru whole process and clicking `Confirm` it executes:
- Calls `activePeer.transactions.broadcast(transaction)` and then dispatches `TRANSACTION_ADDED`


## Socket
Socket connects on Login. Websocket listens to `blocks/change`
and constantly dispatches `newBlockCreated` action.

- `newBlockCreated`
  ↪️ Account Middleware
  &nbsp;&nbsp;&nbsp;&nbsp;⬇️ `updateAccountData`
  &nbsp;&nbsp;&nbsp;&nbsp;⬇️ `transactionsUpdated`
  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;↪️ Account Middleware
  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;⬇️ `votesFetched` (sometimes)
  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;⬇️ `updateDelegateAccount` (sometimes)
  ↪️ Followed Account Middleware
  &nbsp;&nbsp;&nbsp;&nbsp;⬇️ `followedAccountFetchedAndUpdated`


## Local Storage
  All data saved in localStorage should be saved in Subscribers files
  `store/subscribers`

  ![alt text](assets/subscribers_code.png "Subscribers Code")