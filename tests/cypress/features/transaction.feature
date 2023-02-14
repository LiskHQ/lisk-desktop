Feature: Transactions

  # Background:
  #   Given Network is set to customNode
  #   Given I am on login page
  #   And I wait 2 seconds
  #   Given I am on Transactions page

  # @basic
  # Scenario: Load Latest Transactions
  #   Then I should see 20 transactions in table
  #   When I click on showMoreButton
  #   Then I should see 40 transactions in table

  # # @advanced
  # @basic
  # Scenario: Filter by one amount then add second and third filters for another amount and sender respectively
  #   When I click on filterTransactionsBtn
  #   Then I should see filterDropdown
  #   When I fill 100 in amountFromInputFilter field
  #   And I click on applyFilters
  #   Then I should see 20 transactions in table
  #   When I click on filterTransactionsBtn
  #   Then I should see filterDropdown
  #   When I fill 1000 in amountToInputFilter field
  #   And I click on applyFilters
  #   Then I should see 20 transactions in table
  #   When I click on filterTransactionsBtn
  #   Then I should see filterDropdown
  #   When I fill lskwagrurebrnhwsazpmfsjm3hzqc9apbagwftqbt in senderAddressFilter field
  #   And I click on applyFilters
  #   And I wait 2 seconds
  #   Then I should see 1 transactions in table

  # # @advanced
  # @skip
  # Scenario: Filter by transaction type
  #   When I click on filterTransactionsBtn
  #   Then I should see filterDropdown
  #   When I click on moreLessSwitch
  #   When I select Stake in transactionTypeFilter field
  #   And I click on applyFilters
  #   And I wait 2 seconds
  #   Then I should see 20 transactions in table

  # # @advanced
  # @basic
  # Scenario: Filter by all filters combined, clear all filters
  #   When I click on filterTransactionsBtn
  #   Then I should see filterDropdown
  #   When I fill 100 in amountFromInputFilter field
  #   When I fill 1000 in amountToInputFilter field
  #   When I click on moreLessSwitch
  #   When I fill 424 in heightFilter field
  #   And I click on applyFilters
  #   Then I should see 1 transactions in table
  #   And I click on clearAllFiltersBtn
  #   Then I should see 20 transactions in table

  # @basic
  # Scenario: Navigate to the transaction details page if transaction is clicked
  #   When I click on filterTransactionsBtn
  #   Then I should see filterDropdown
  #   When I fill 100 in amountFromInputFilter field
  #   When I fill lsk37c5adc39ux7vdq8s7tpfduvzz9ec7zkj7n9xs in senderAddressFilter field
  #   And I click on applyFilters
  #   And I wait 2 seconds
  #   Then I should see 1 transactions in table
  #   When I click on transactionRow
  #   Then I should be on transaction details modal
