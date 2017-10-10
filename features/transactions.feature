Feature: Transactions tab
  Scenario: should show transactions
    Given I'm logged in as "genesis"
    When I click tab number 1
    Then I should see table with 40 lines

  Scenario: should show more transactions on scroll
    Given I'm logged in as "genesis"
    When I click tab number 1
    Then I should see table with 40 lines
    When I scroll to the bottom
    Then I should see table with 60 lines

  Scenario: should allow send to address
    Given I'm logged in as "genesis"
    When I click tab number 1
    And I click "from-to" element on table row no. 1
    And I fill in "100" to "amount" field
    And I click "submit button"
    Then I should see alert dialog with title "Success" and text "Your transaction of 100 LSK to 537318935439898807L was accepted and will be processed in a few seconds."

  Scenario: should allow to repeat the transaction
    Given I'm logged in as "genesis"
    When I click tab number 1
    And I click "amount" element on table row no. 1
    And I click "submit button"
    Then I should see alert dialog with title "Success" and text "Your transaction of 100 LSK to 537318935439898807L was accepted and will be processed in a few seconds."

  Scenario: should provide "No transactions" message
    Given I'm logged in as "empty account"
    When I click tab number 1
    Then I should see table with 0 lines
    And I should see text "There are no transactions, yet.  RECEIVE LSK" in "empty message" element

  Scenario: should provide "Receive LSK" modal if there are "No transactions" 
    Given I'm logged in as "empty account"
    When I click tab number 1
    And I click "receive lsk button"
    And I wait 1 seconds
    Then I should see text "5932438298200837883L" in "receive modal address" element
