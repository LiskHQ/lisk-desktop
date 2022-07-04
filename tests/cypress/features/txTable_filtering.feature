Feature: Transaction table filtering

  Background:
    Given I login as genesis on customNode
    And I wait 5 seconds
    Given I am on Wallet page
    And I click on filterTransactionsBtn

  # @advanced
  # @todo: disabled until account management is updated
  # @basic
  # Scenario: Filter by 1 Amount, add second filter by 1 Amount
  #   When I fill 10 in amountToInputFilter field
  #   And I click on applyFilters
  #   Then I should see 3 transactions in table
  #   When I click on filterTransactionsBtn
  #   And I fill 10 in amountFromInputFilter field
  #   And I clear input amountToInputFilter
  #   And I fill 20 in amountToInputFilter field
  #   And I click on applyFilters
  #   Then I should see 4 transactions in table

  # # @advanced
  # @basic
  # Scenario: Filter by all filters combined, clear all filters
  #   When I fill 10 in amountFromInputFilter field
  #   And I fill 50 in amountToInputFilter field
  #   And I click on applyFilters
  #   And I wait 2 seconds
  #   Then I should see 5 transactions in table
  #   And I click on clearAllFiltersBtn
  #   Then I should see 20 transactions in table
