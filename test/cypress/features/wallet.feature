Feature: Wallet

  Background:
    Given I login as genesis on testnet
    Given I am on wallet page
    
  # Scenario: 30 tx are shown, clicking show more loads more transactions
  #   Then I should see 30 transactions
  #   When I click show more
  #   Then I should see more than 30 transactions

  Scenario: Click leads to tx details
    When I click on transactionRow
    Then I should be on Tx Details page

  Scenario: Send LSK to this account
    Given I am on Wallet page of delegate
    And I wait 1 seconds
    When I send LSK
    Then I should see delegate in recipient

