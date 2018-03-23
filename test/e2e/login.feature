Feature: Login page
  Scenario: should allow to login to Mainnet 
    Given I'm on login page
    When I fill in passphrase of "genesis" to "passphrase" field
    And I select option no. 1 from "network" select
    And I click "login button"
    Then I should be logged in as "genesis" account
    And I should see no "peer network"

  Scenario: should allow to create a new account
    Given I'm on login page
    When I click "new account button"
    And I wait 0.5 seconds
    And I 250 times move mouse randomly
    And I wait 2 seconds
    And I click "get passphrase button"
    And I wait 0.5 seconds
    And I swipe "i understand checkbox" to right
    And I wait 1 seconds
    And I swipe "reveal checkbox" to right
    And I wait 0.5 seconds
    And I remember passphrase, click "yes its safe button", choose missing words
    And I wait 1 seconds
    And I click "get to your dashboard button"
    Then I should be logged in
