Feature: AddAccount
    Background: Navigate to add account options
        Given I navigate to page "wallet"
        Then I should exactly see "Welcome to Lisk"
        And I should exactly see "If you are new to Lisk ecosystem, create an account by clicking on the “Create account”. If you have an account, then add it to your wallet by clicking on “Add account”."
        Given I click on a button with exact text "Add account"
        Then  I should be redirected to route: "account/add"
        And I should exactly see "Add your account"
        And I should exactly see "Choose an option to add your account to Lisk wallet."
        And I should exactly see "Don’t have a Lisk account yet? Create one now"

    Scenario: Add account by passphrase with custom derivation path
        Given I click on a button with exact text "Secret recovery phrase"
        Then  I should be redirected to route: "account/add/secret-recovery"
        And I should exactly see "Add your account"
        And I should exactly see "Enter your secret recovery phrase to manage your account."
        And I should exactly see "Secret recovery phrase (12-24 mnemonic phrases supported)"
        And custom derivation path input field should be "enabled"
        And button with text 'Continue to set password' should be disabled
        Given I click on a button with exact text "Go back"
        Then  I should be redirected to route: "account/add"
        Given I click on a button with exact text "Secret recovery phrase"
        And I fill in mnemonic phrases 'peanut hundred pen hawk invite exclude brain chunk gadget wait wrong ready'
        And I click on a button with exact text "Continue to set password"
        Then I should exactly see "Set up your account password"
        And I should exactly see "I agree to store my encrypted secret recovery phrase on this device."
        And I should exactly see "This password will be used for decrypting your account every time you initiate any transaction from your wallet, and also during backup or removal of an account from the wallet."
        And button with text 'Save Account' should be disabled
        Given I type "Password1$" in "password"
        And I type "Password1$" in "cPassword"
        And I type "test_acc" in "accountName"
        And I click on text "I agree to store my encrypted secret recovery phrase on this device."
        And I click on a button with exact text "Save Account"
        Then I should see the final add account step
        Given I click on a button with exact text "Continue to wallet"
        Then  I should be redirected to route: "wallet"

    Scenario: Add account by passphrase without custom derivation path
        Given I click on text "Settings"
        And I click on text "Enable access to legacy Lisk accounts"
        And I click on a button with testId "dialog-close-button"
        And I click on a button with exact text "Secret recovery phrase"
        Then  I should be redirected to route: "account/add/secret-recovery"
        And I should exactly see "Add your account"
        And I should exactly see "Enter your secret recovery phrase to manage your account."
        And I should exactly see "Secret recovery phrase (12-24 mnemonic phrases supported)"
        And custom derivation path input field should be "disabled"
        And button with text 'Continue to set password' should be disabled
        Given I click on a button with exact text "Go back"
        Then  I should be redirected to route: "account/add"
        Given I click on a button with exact text "Secret recovery phrase"
        And I fill in mnemonic phrases 'peanut hundred pen hawk invite exclude brain chunk gadget wait wrong ready'
        And I click on a button with exact text "Continue to set password"
        Then I should exactly see "Set up your account password"
        And I should exactly see "I agree to store my encrypted secret recovery phrase on this device."
        And I should exactly see "This password will be used for decrypting your account every time you initiate any transaction from your wallet, and also during backup or removal of an account from the wallet."
        And button with text 'Save Account' should be disabled
        Given I type "Password1$" in "password"
        And I type "Password1$" in "cPassword"
        And I type "test_acc" in "accountName"
        And I click on text "I agree to store my encrypted secret recovery phrase on this device."
        And I click on a button with exact text "Save Account"
        Then I should see the final add account step
        Given I click on a button with exact text "Continue to wallet"
        Then  I should be redirected to route: "wallet"

    Scenario: Add account by file
        Given I click on a button with exact text "Restore from backup"
        Then  I should be redirected to route: "account/add/by-file"
        And I should exactly see "Add your account"
        And I should exactly see "Restore your encrypted secret recovery phrase."
        And I should exactly see "Please drag and drop the JSON file from your device."
        And button with text 'Continue' should be disabled
        Given I click on a button with exact text "Go back"
        Then  I should be redirected to route: "account/add"
        Given I click on a button with exact text "Restore from backup"
        And I input encrypted account:
            """
            {
                "crypto": {
                    "ciphertext": "7bbe2ede0c0263eeeefe604eeb6a05ad694739344cfa83b264cf5bac30b38d5e8cfd9ad1e592b1ea61a2621bbf692eca7f55331358a61fe5019616ff78a067899221df98b49ec7228be78e7225927c77a6059885784d25e33ef0ddab293f52612c4fc7539ca7d651747da32931749b491eca066ac4b07a47394296512fc5f3e5ff1fd5cebb1625026b6ccfc04db8f442af02da9519124c706f9286e897b615371103687492adea81dde453da98d11179153b62c002a6e0241131ebc1bdd94187383708f30bf50736aa35e0de69ff0154b48a2a6eca0a27103118e057195affd52943f0ddb01602d293853a410b491c",
                    "mac": "44efae34755f67be152c3de325e9b1a48ae97dee004733c76d2de875ea381597",
                    "kdf": "argon2id",
                    "kdfparams": {
                        "parallelism": 4,
                        "iterations": 1,
                        "memorySize": 2024,
                        "salt": "3cb7451bbeb502f6078aa0dddb6cd0c1"
                    },
                    "cipher": "aes-256-gcm",
                    "cipherparams": {
                        "iv": "007d68ce332797775b31da65",
                        "tag": "84c8b824b27f26fb80a3ace0a005e900"
                    },
                    "version": "1"
                },
                "metadata": {
                    "name": "test_account",
                    "pubkey": "0fe9a3f1a21b5530f27f87a414b549e79a940bf24fdf2b2f05e7f22aeeecc86a",
                    "address": "lskdxc4ta5j43jp9ro3f8zqbxta9fn6jwzjucw7yt",
                    "creationTime": "2023-05-21T23:21:46.922Z"
                },
                "version": 1
            }
            """
        And I click on a button with exact text "Continue"
        Then I should be on the password collection step having address: "lskdxc4ta5j43jp9ro3f8zqbxta9fn6jwzjucw7yt" and account name "test_account"

