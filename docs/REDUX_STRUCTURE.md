# Redux Multi Currencies Structure

## Store structure
For being able to store multi currencies data, we should need a store structure more similar to the one at [lisk-mobile](https://github.com/liskHQ/lisk-mobile).

### Lisk Mobile
Showing here just the parts related to the multi currencies structure.
```json
// lisk-mobile store example
{
  "..."
  "accounts": {
    "passphrase": "",
    "followed": { "tokenKey": [{}] },
    "info": { "tokenKey": { "address": "", "balance": "", "publickey": "", "..." } }
  },
  "service": {},
  "settings": {
    "token": {
      "active": "tokenKey",
      "list": { "tokenKey": true }
    },
    "..."
  }
}
```
Where we have the accounts information and the followed accounts separated per token type, and other informations that are relevant for more than one token being directly on the `accounts` node.  
On `settings` we have which token is the active one, and also a list with the tokens, of which token is enabled by the user.  
And also a unified `service` node, not just as liskService as we have right now on Lisk-Hub.  

### Lisk Hub
In the case of Lisk-Hub we could have initialy a structure that integrate some of the changes just for other currencies, while we don't update the current LSK structure.  
To have a better structure for new currencies, while also keeping the LSK token working without too much work, something like:
```json
// lisk-hub intermediate store example
{
  "..."
  "account": { "LSK account info" },
  "accounts": { "info": { "BTC": {} }, "followed": {} },
  "BTC": { "BTC specific data" },
  "service": {},
  "delegate": {},
  "voting": {},
  "filters": {},
  "..."
}
```
- Rename `liskService` to just `service` so we can have all service information centralized in one place.  
- New token accounts being already on the `accounts` structure.
- Specific new token data grouped inside a `tokenKey` node.

Ideally in the future we should end up with a structure similar to:
```json
// lisk-hub final store example
{
  "accounts": { "info": { "tokenKey": {} }, "passphrase": "", "other account common info" },
  "followed": [{ "address": "", "balance": "", "tokenType": "LSK" }],
  "service": { "all service related data" },
  "LSK": { "delegate": {}, "voting": {}, "filters": {}, },
  "tokenKey": { "specific data for token" },
  "wallets": { "tokenKey": { "netCode": [] } },
  "..."
}
```
Data used by all token types couls be put into a common node or at the root as it's right now, like the `extensions` and `search` node, having `tokenKeys` node inside if needed.
Transactions node can keep the same structure given that we use a normalize so all the transactions have the same structure of information so we can display them in a similar way and since we won't show transactions of different tokens at the same time.

## Actions
Actions should be generic and fetch the active token from the store, so the calls to the actions creators shouldn't be specific per token. So the components don't need to know which token is currently being used.  
Also there would be some action creators that don't fetch the active token, when they have to share the data among multiple tokens.
```javascript
// account - token based
const login = (payload) => (dispatch, getState) => {
  const activeToken = getState().settings.token.active;
  dispatch({
    type: 'login',
    data: {
      payload,
      activeToken,
    },
  });
}
// bookmark - no token
const addBookmark = (payload) => (dispatch, getState) => {
  dispatch({
    type: 'add',
    data: payload
  });
}
```
Above actions are not real use cases, just examples to illustrate.

## Reducers
The reducers would have to take in account the token type, or if no token is set consider it as being common data and not putting inside a node, but directly on the root.  
Meaning that we should not create specific reducers for each multicurrency, but have a reducer that can handle different tokens.  
The token should always be set on the action level, not on the component level.  
Something like:
```javascript
function account(state = {}, action) {
  switch(action.type) {
    case login: {
      const hasToken = !!action.data.activeToken || false;
      const data = hasToken
        ? { ...state, [action.data.activeToken]: { ...action.data.payload } }
        : { ...state, ...action.data.payload, };
      return data;
    }
    default:
      return state;
  }
}
```
Above actions are not real use cases, just examples to illustrate.

## APIs
APIs should go through the [functionMapper](../src/utils/api/functionMapper.js) function so it's only needed to import the function after the functionMapper, and passing the desired token, resource and function, BTC API have some examples for `account`, we would need to move the `LSK` resources and calls to the same structure, so we can just call the same API function and get the desired result.  
The function would be something similar to:
```javascript
// account API example
/**
 * @param {String} tokenKey - Token key. eg. LSK, BTC
 * @param {Object} data - Data that will be passed to mapped function
 * @param {String} data.address - Address of the account.
 * @param {Number} [data.netCode=1] - 0 = mainnet, 1 = testnet
 */
export const getAccount = (tokenKey, { address, netCode }) =>
  getMappedFunction(tokenKey, 'account', 'getAccount')(address, netCode);
```
In the example above we have a mapped function `getAccount` that expects a `tokenKey`, and the data that will be passed to the real API call, by normalizing the input and output of the API calls it's possible to have a generic API function that only needs the `tokenKey` and the normalized data.  
And each token having it's own implementation on how to fetch the data and how to normalize it to save on the store.
