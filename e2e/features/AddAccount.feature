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

    Scenario: Add account by passphrase without custom derivation path
        Given I click on a button with exact text "Secret recovery phrase"
        Then  I should be redirected to route: "account/add/secret-recovery"
        And I should exactly see "Add your account"
        And I should exactly see "Enter your secret recovery phrase to manage your account."
        And I should exactly see "Secret recovery phrase (12-24 mnemonic phrases supported)"
        And custom derivation path input field should be enabled
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

