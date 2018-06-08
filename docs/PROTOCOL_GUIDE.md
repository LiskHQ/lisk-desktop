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
`lisk://main/voting/vote?votes=thepool,4miners.net` or `lisk://delegates/vote?votes=thepool,4miners.net`
It will open lisk app and select delegates automatically `thepool` and `4miners.net`

:exclamation: Please keep in mind that We don't use `/main` route anymore but some websites still relay on an old url so We are allowing `/main` in this particular case `main/voting/vote`.

![Alt text](./assets/voting_protocol.png?raw=true "Lisk voting protocol")

#### Network switcher protocol
Opens the login page and enables the network switcher options.

`lisk://add-account?showNetwork=true`

![Alt text](./assets/network_switcher.png?raw=true "Lisk voting protocol")

#### Send protocol
Opens the wallet and prefills the send form with recipient and amount.

`lisk://wallet?recipient=16313739661670634666L&amount=5`

![Alt text](./assets/send.png?raw=true "Lisk voting protocol")

#### Sign message protocol
Opens the sign message form and prefills it with your message.

`lisk://sign-message?message=my message`

![Alt text](./assets/sign_message.png?raw=true "Lisk voting protocol")

