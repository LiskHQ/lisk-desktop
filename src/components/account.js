
import lisk from 'lisk-js'

import app from '../app'

app.factory('account', () => {
  return (passphrase) => {
    let kp = lisk.crypto.getKeys(passphrase)

    return {
      address: lisk.crypto.getAddress(kp.publicKey),
      publicKey: kp.publicKey,
      privateKey: kp.privateKey,
    }
  }
})
