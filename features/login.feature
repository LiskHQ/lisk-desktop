Feature: Login page
  Scenario: should allow to login
    Given I'm on login page
    When I fill in "wagon stock borrow episode laundry kitten salute link globe zero feed marble" to "passphrase" field
    And I click "login button"
    Then I should be logged in

  Scenario: should allow to change network
    Given I'm on login page
    When I select option no. 2 from "network" select
    Then the option "Testnet" is selected in "network" select

  @ignore
  Scenario: should allow to create a new account
    Given I'm on login page
    When I click "new account button"
    And I click on "next button"
    And I 250 times move mouse randomly
    And I remember passphrase, click "yes its save button", fill in missing word
    And I click "ok button"
    Then I should be logged in
