Feature: Transactions
Scenario: Load Latest Transactions
  Given I am on Transactions page
  Then I should see 20 transactions in table
  When I click on showMoreButton
  Then I should see more than 20 transactions