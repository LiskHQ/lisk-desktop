Feature: Main page top area
  Scenario: should allow to logout
    Given I'm logged in as "any account"
    When I click "logout button"
    Then I should be on login page
  Scenario: should show peer
    Given I'm logged in as "any account"
    Then I should see "peer"
  Scenario: should show address
    Given I'm logged in as "any account"
    Then I should see "address"
  Scenario: should show balance
    Given I'm logged in as "any account"
    Then I should see "balance"

