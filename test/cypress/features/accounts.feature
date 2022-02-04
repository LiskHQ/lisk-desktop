Feature: Accounts

  Background:
    Given Network switcher is enabled
    And Network is set to devnet
    Given I am on accounts page
    And I wait 1 seconds
    
  Scenario: I should see initally loaded accounts 
    Then I should have 20 accounts rendered in table

  Scenario: I should be able to load more accounts
    And I click on showMoreAccountsBtn
    And I wait 1 seconds
    Then I should have 40 accounts rendered in table
  
  Scenario: I should be navigated to the accurate account page when an account is clicked
    When I click on accountsRow
    Then I should be on the account page

