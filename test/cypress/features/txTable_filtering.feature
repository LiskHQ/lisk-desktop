Feature: Transaction table filtering

  Background:
    Given I login as genesis on testnet
    Given I am on Wallet page
    Then I click filter transactions

  Scenario: Filter by 1 Amount, add second filter by 1 Amount
    When I type amount to 5
    And I apply filters
    Then I should see 20 transactions in table
    And I click filter transactions
    When I type amount from 1600
    When I type amount to 100
    And I apply filters
    Then I should see 2 transactions in table

  Scenario: Filter by all filters combined, clear all filters
    When I type amount from 0.01
    And I type amount to 0.1
    And I apply filters
    Then I should see 1 transactions in table
    When I clear all filters
    Then I should see 20 transactions in table
