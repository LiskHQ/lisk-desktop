# Redux Multi Currencies Structure

For being able to store multi currencies data, we should need a store structure more similar to the one at [lisk-mobile](https://github.com/liskHQ/lisk-mobile).

Showing here just the parts related to the multi currencies structure.
```json
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

In the case of Lisk-Hub we could have initialy a structure that integrate some of the changes just for the other currencies, while we don't update the current LSK structure.  
To have a new better structure for new currencies, while also keeping the LSK token working without too much work, something like:
```json
{
  "..."
  "account": { "LSK account info" },
  "accounts": { "info": { "BTC": {} }, "followed": {} },
  "service": {},
  "LSK": {"delegate": {}, "voting": {}, "filters" },
  "..."
}
```
- Rename `liskSercice` to just `service` so we can have all service information centralized in one place.  
- New token accounts being already on the `accounts` structure.
- Group all specific token nodes inside a `tokenKey` node, using `LSK` in the example above.

Ideally in the future we should end up with a structure like:
```json
{
  "accounts": { "info": { "tokenKey": {} }, "followed": {}, "passphrase": "", "other account common info" },
  "service": { "all service related data" },
  "LSK": { "LSK specific data" },
  "tokenKey": { "specific data for token" },
  "wallets": { "tokenKey": { "netCode": [] } },
  "..."
}
```
Data used by all token types couls be put into a common node or at the root as it's right now, like the `extensions` and `search` node, having `tokenKeys` node inside if needed.

So the reducers would have to take in account the token type, or if no token is set, consider it as being common data and not putting inside a node, but directly on the root.  
Something like:
```javascript
{
  const hasToken = !!action.activeToken || false;
  const data = hasToken
    ? { ...state, [action.activeToken]: { ...action.data } }
    : { ...state, ...action.data, };
  return data;
}
```
