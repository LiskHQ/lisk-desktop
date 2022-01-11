Feature: Wallet

  Background:
    Given I login as genesis on devnet
    Given I am on wallet page
    
  Scenario: 30 tx are shown, clicking show more loads more transactions
    Then I should see 20 transactions in table
    When I click on showMoreButton
    And I wait 1 seconds
    Then I should see more than 20 transactions

  Scenario: Click leads to tx details
    When I click on transactionRow
    Then I should be on Tx Details page

  Scenario: Send LSK to this account
    Given I am on Wallet page of delegate
    And I wait 1 seconds
    When I send LSK
    Then I should have lskdxwf9kgmfghoeevqhrkcruy8j7xpkw57un9avq in recipient field

