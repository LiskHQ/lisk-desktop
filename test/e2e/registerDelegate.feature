Feature: Register delegate
  Scenario: should allow to register a delegate on custom node with second passphrase
    Given I'm logged in as "second passphrase account"
    When I go to "register-delegate"
    And I wait 0.5 seconds
    And I click "choose-name"
    And I wait 0.5 seconds
    And I fill in "test2" to "delegate-name" field
    And I click "submit-delegate-name"
    And I fill in second passphrase of "second passphrase account" to "second-passphrase" field
    And I click "second-passphrase-next"
    And I wait 1 seconds
    And I click "confirm-delegate-registration"
    And I wait 25 seconds
    Then I should see text "Success!" in "success-header" element
    Then I should see text "Your registration is secured on the blockchain" in "success-description" element
    And I click "registration-success"
    And I wait 0.5 seconds
    And I should see 1 instances of "seeAllLink"
