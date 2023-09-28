Feature: AddAccount
  Background: Navigate to add account options
    Given I go to page "wallet"
    And I wait for "1 seconds"
    Then I should see "Welcome to Lisk"
    And I should see "If you are new to the Lisk ecosystem, create an account by clicking on the “Create account”. If you have an account, then add it to your wallet by clicking on “Add account”."
    Given I click on exact text "Add account"
    Then I should be redirected to route: "account/add"
    And I should see "Add your account"
    And I should see "Choose an option to add your account to Lisk wallet."

  Scenario: Add account by passphrase with custom derivation path
    Given I click on exact text "Secret recovery phrase"
    Then I should be redirected to route: "account/add/secret-recovery"
    And I should see "Add your account"
    And I should see "Enter your secret recovery phrase to manage your account."
    And I should see "Secret recovery phrase (12-24 mnemonic phrases supported)"
    And custom derivation path input field should be "enabled"
    And button with text 'Continue to set password' should be disabled
    Given I click on exact text "Go back"
    Then I should be redirected to route: "account/add"
    Given I click on exact text "Secret recovery phrase"
    And I fill in mnemonic phrases 'peanut hundred pen hawk invite exclude brain chunk gadget wait wrong ready'
    And I click on exact text "Continue to set password"
    Then I should see "Set up your account password"
    And I should see "I agree to store my encrypted secret recovery phrase on this device."
    And I should see "This password will be used for decrypting your account every time you initiate any transaction from your wallet, and also during backup or removal of an account from the wallet."
    And button with text 'Save Account' should be disabled
    Given I type "Password1$" in "password"
    And I type "Password1$" in "cPassword"
    And I type "test_acc" in "accountName"
    And I click on text "I agree to store my encrypted secret recovery phrase on this device."
    And I click on exact text "Save Account"
    Then I should see the final add account step
