Feature: Search
  Background:
    Given I am on Login page
    Given I login as genesis on devnet
    Given I am on Dashboard page
    When I click on searchIcon

  Scenario: Search for Transaction in mainnet, signed off
    And I search for transaction 881002485778658401
    Then I click on searchTransactionRow
    Then I should be on Tx Details page of 881002485778658401

  Scenario: Search for Lisk ID
    And I search for account 6566229458323231555L
    Then I click on searchAccountRow
    Then I should be on Account page of 656622...1555L

  Scenario: Search for non-existent account
    And I search for delegate 43th3j4bt324
    Then I should see no results

