Feature: Login
  Scenario: should allow to login to Mainnet through network options launch protocol
    Given I go to "/"
    Then I should see no "network"
    When I'm on login page
    And I fill in passphrase of "genesis" to "passphrase" field
    And I select option no. 1 from "network" select
    And I click "login button"
    Then I should be logged in as "genesis" account
    And I should see no "peer network"
    When I click "transactions" menu
    And I should see 0 rows
    Then I should see text "No activity yet" in "empty message" element
    When I go to "second-passphrase"
    And "next" should be disabled

  Scenario: should allow to login to Testnet through network options launch protocol
    Given I go to "/"
    Then I should see no "network"
    When I'm on login page
    Then I fill in passphrase of "genesis" to "passphrase" field
    And I select option no. 2 from "network" select
    And I click "login button"
    Then I should be logged in as "genesis" account
    And I should see text "testnet" in "peer network" element
    When I click "transactions" menu
    Then I should see 25 rows

  Scenario: should allow to login to Custom node through network options launch protocol
    Given I go to "/"
    Then I should see no "network"
    When I'm on login page
    Then I fill in passphrase of "genesis" to "passphrase" field
    And I select option no. 3 from "network" select
    When I fill in "localhost:4000" to "address" field
    And I click "login button"
    Then I should be logged in as "genesis" account
    And I should see text "custom node" in "peer network" element
    When I click "transactions" menu
    Then I should see 25 rows