Feature: Transaction table filtering

  Background:
    Given I login as genesis on devnet
    Given I am on Wallet page
    And I click on filterTransactionsBtn

  Scenario: Filter by 1 Amount, add second filter by 1 Amount
    When I fill 10 in amountToInputFilter field
    And I click on applyFilters
    Then I should see 1 transactions in table
    When I click on filterTransactionsBtn
    And I fill 10 in amountFromInputFilter field
    And I clear input amountToInputFilter   
    And I fill 20 in amountToInputFilter field
    And I click on applyFilters
    Then I should see 3 transactions in table

  Scenario: Filter by all filters combined, clear all filters
    When I fill 10 in amountFromInputFilter field
    And I fill 50 in amountToInputFilter field
    And I click on applyFilters
    Then I should see 4 transactions in table
    And I click on clearAllFiltersBtn
    Then I should see 20 transactions in table
