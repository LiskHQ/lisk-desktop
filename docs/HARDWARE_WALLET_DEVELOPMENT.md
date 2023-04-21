# How to use ledger hardware wallet

## Step 1: Manually add the Lisk ledger app to your Ledger hardware wallet

- Download `installer_nanos.sh` or `installer_nanos_plus.sh` from [ledger-lisk](https://github.com/Zondax/ledger-lisk/releases), depending on your HW test device.
- run `chmod +x ./installer.sh`
- Make sure you have python3 in your environment.
- Connect your ledger nano to your computer.
- run `./installer.sh load` // to push the Lisk app to your ledger)
- It may be necessary to perform a pip install ledgerblue. Ensure you use pip for python3, depending on how you have set up your aliases to handle python2 and python3. If you are using pip3 for python3, then in this case perform a pip3 install ledgerblue.
- Accept all prompts on your connected ledger device.
- After accepting all prompts you should have an app called Lisk.

## Step 2: How to sign in to your ledger wallet
- `git clone git@github.com:LiskHQ/lisk-desktop.git`
- run `npm run build`
- Open two terminals
- In terminal 1 run `npm run dev`
- In terminal 2 run `LISK_DESKTOP_URL="http://localhost:8080" DEBUG=true npm run start` // this will open the Lisk electron app)
- In the Lisk electron app navigate to /dashboard → click “Add account” → click “Use a hardware wallet”
- Open the Lisk app on your ledger (the app you installed in step 1)
