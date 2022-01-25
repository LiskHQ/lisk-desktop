Feature: Transactions 

  Background:
    Given I login as testnet_guy on testnet
    And I wait 5 seconds
    Given I am on Transactions page

  Scenario: Load Latest Transactions
    Then I should see 20 transactions in table
    When I click on showMoreButton
    Then I should see more than 20 transactions in table

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
    When I fill lskgpfj26e3uogvr5wbono75hzn5myds4pncv3zm8 in senderAddressFilter field
    Then I should see more than 5 transactions in table

  Scenario: Filter by all filters combined, clear all filters
    When I click on filterTransactionsBtn
    Then I should see filterDropdown
    When I fill 100 in amountFromInputFilter field
    When I fill 1000 in amountToInputFilter field
    When I click on moreLessSwitch
    When I fill 15424425 in heightFilter field
    And I click on applyFilters
    Then I should see 1 transactions in table
    And I click on clearAllFiltersBtn
    Then I should see 20 transactions in table