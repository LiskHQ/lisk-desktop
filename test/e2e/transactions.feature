Feature: Transactions page
  Scenario: should show transactions and more on scroll
    Given I'm logged in as "genesis"
    When I click "transactions" menu
    Then I should see 25 rows
    When I scroll to the bottom of "transaction results"
    Then I should see 45 rows

  Scenario: should provide "Receive LSK" modal if there are "No transactions" 
    Given I'm logged in as "empty account"
    When I click "transactions" menu
    And I should see 0 rows
    And I should see text "There are no transactions, yet.  RECEIVE LSK" in "empty message" element
    And I click "receive lsk button"
    And I wait 1 seconds
    Then I should see text "5932438298200837883L" in "receive modal address" element
