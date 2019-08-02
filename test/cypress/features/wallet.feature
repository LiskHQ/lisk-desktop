Feature: Wallet

  Scenario: 30 tx are shown, clicking show more loads more transactions
    Given I autologin as genesis to devnet
    Given I am on Wallet page
    Then I should see 30 transactions
    When I click show more
    Then I should see more than 30 transactions

  Scenario: Click leads to tx details
    Given I autologin as genesis to devnet
    Given I am on Wallet page
    When I click on recent transaction
    Then I should be on Tx Details page

  Scenario: Incoming/Outgoing/All filtering works
    Given I autologin as second_passphrase_account to devnet
    Given I am on Wallet page
    Then I should see incoming transaction in table
    Then I should see outgoing transaction in table
    Then I click filter incoming
    Then I should see incoming transaction in table
    Then I should not see outgoing transaction in table
    Then I click filter outgoing
    Then I should see outgoing transaction in table
    Then I should not see incoming transaction in table

  Scenario: Send LSK to this account
    Given I autologin as genesis to devnet
    Given I am on Wallet page of delegate
    When I send LSK
    Then I should see delegate in recipient

