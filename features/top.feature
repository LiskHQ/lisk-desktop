Feature: Main page top area
  Scenario: should allow to logout
    Given I'm logged in as "any account"
    When I click "logout button"
    Then I should be on login page

  Scenario: should show peer
    Given I'm logged in as "any account"
    Then I should see text "localhost : 4000" in "peer" element

  Scenario: should show address
    Given I'm logged in as "genesis"
    Then I should see text "16313739661670634666L" in "address" element

  Scenario: should show balance
    Given I'm logged in as "empty account"
    Then I should see text "0 LSK" in "balance value" element

