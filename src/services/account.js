
import lisk from 'lisk-js'

import app from '../app'

app.factory('account', ($http) => {
  return (passphrase) => {
    let kp = lisk.crypto.getKeys(passphrase)

    return {
      address: lisk.crypto.getAddress(kp.publicKey),
      publicKey: kp.publicKey,
      privateKey: kp.privateKey,
      balance: function () {
        console.log(this)
        cb(null, 123)
      }
    }
  }
})
