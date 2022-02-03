Feature: Transactions 

  Background:
    Given Network is set to devnet
    Given I am on login page
    And I wait 2 seconds
    Given I am on Transactions page

  Scenario: Load Latest Transactions
    Then I should see 20 transactions in table
    When I click on showMoreButton
    Then I should see 40 transactions in table

  Scenario: Filter by one amount then add second and third filters for another amount and sender respectively
    When I click on filterTransactionsBtn
    Then I should see filterDropdown
    When I fill 100 in amountFromInputFilter field
    And I click on applyFilters
    Then I should see 20 transactions in table
    When I click on filterTransactionsBtn
    Then I should see filterDropdown
    When I fill 1000 in amountToInputFilter field
    And I click on applyFilters
    Then I should see 20 transactions in table
    When I click on filterTransactionsBtn
    Then I should see filterDropdown
    When I fill lskwagrurebrnhwsazpmfsjm3hzqc9apbagwftqbt in senderAddressFilter field
    And I click on applyFilters
    And I wait 2 seconds
    Then I should see 1 transactions in table

  Scenario: Filter by transaction type
    When I click on filterTransactionsBtn
    Then I should see filterDropdown
    When I click on moreLessSwitch
    When I select Vote in transactionTypeFilter field
    And I click on applyFilters
    And I wait 2 seconds
    Then I should see 20 transactions in table

  Scenario: Filter by all filters combined, clear all filters
    When I click on filterTransactionsBtn
    Then I should see filterDropdown
    When I fill 100 in amountFromInputFilter field
    When I fill 1000 in amountToInputFilter field
    When I click on moreLessSwitch
    When I fill 424 in heightFilter field
    And I click on applyFilters
    Then I should see 1 transactions in table
    And I click on clearAllFiltersBtn
    Then I should see 20 transactions in table

  Scenario: Navigate to the transaction details page if transaction is clicked
    When I click on transactionRow
    Then I should be on transaction details page  