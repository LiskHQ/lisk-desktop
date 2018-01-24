Feature: Transactions page
  Scenario: should show transactions and more on scroll
    Given I'm logged in as "genesis"
    When I click "transactions" menu
    Then I should see 25 rows
    When I scroll to the bottom of "transaction results"
    Then I should see 50 rows

  @integration
  Scenario: should provide a message if there are "No transactions" 
    Given I'm logged in as "empty account"
    When I click "transactions" menu
    And I should see 0 rows
    Then I should see text "No activity yet" in "empty message" element
