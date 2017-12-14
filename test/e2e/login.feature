Feature: Login page
  @pending
  Scenario: should allow to login
    Given I'm on login page
    When I fill in "wagon stock borrow episode laundry kitten salute link globe zero feed marble" to "passphrase" field
    And I click "login button"
    Then I should be logged in

  @integration
  Scenario: should show toast when trying to connect to an unavailable custom node
    Given I'm on login page
    When I fill in "wagon stock borrow episode laundry kitten salute link globe zero feed marble" to "passphrase" field
    And I select option no. 3 from "network" select
    And I clear "address" field
    And I fill in "http://localhost:4218" to "address" field
    And I click "login button"
    And I wait 2 seconds
    Then I should see text "Unable to connect to the node" in "toast" element

  Scenario: should allow to login to Mainnet 
    Given I'm on login page
    When I fill in "wagon stock borrow episode laundry kitten salute link globe zero feed marble" to "passphrase" field
    And I select option no. 1 from "network" select
    And I click "login button"
    Then I should be logged in
    And I should see text "Mainnet" in "peer network" element

  Scenario: should allow to create a new account
    Given I'm on login page
    When I click "new account button"
    And I wait 1 seconds
    And I 250 times move mouse randomly
    And I click "next button"
    And I swipe "i understand checkbox" to right
    And I swipe "reveal checkbox" to right
    And I remember passphrase, click "next button", choose missing words
    And I click "next button"
    Then I should be logged in
