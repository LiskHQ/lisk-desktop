## Protocols

Lisk-hub as a part of electron application can use custom protocols.
In the other words You are able to open Lisk-hub desktop application using our custom protocol `lisk`.

:exclamation: Please keep in mind that not all browsers has handling custom protocols handled as default.

#### Basic usage
After installing lisk-hub on your device you will be able to use `lisk` protocol.
Example: `lisk://wallet`
![Alt text](./assets/lisk_wallet.png?raw=true "Lisk protocol basic")
Everything that comes after `lisk://` is treated as a route so this example will open lisk-hub app on wallet page.

#### Voting protocol
Makes voting for delegates easier 
`lisk://main/voting/vote?votes=thepool,4miners.net`
It will open lisk app and select delegates automatically `thepool` and `4miners.net`
![Alt text](./assets/voting_protocol.png?raw=true "Lisk voting protocol")
