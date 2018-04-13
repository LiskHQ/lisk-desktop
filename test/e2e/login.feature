Feature: Login page
  Scenario: should allow to login to Mainnet and there must be no transactions
    Given I'm on login page
    When I fill in passphrase of "genesis" to "passphrase" field
    And I select option no. 1 from "network" select
    And I click "login button"
    Then I should be logged in as "genesis" account
    And I should see no "peer network"
    When I click "transactions" menu
    And I should see 0 rows
    Then I should see text "No activity yet" in "empty message" element
    When I go to "second-passphrase"
    And "next" should be disabled
