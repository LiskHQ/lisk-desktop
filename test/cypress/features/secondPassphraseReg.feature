Feature: Second Passphrase Registration

  Scenario: Register second passphrase
    Given I autologin as second_passphrase_candidate to devnet
    Given I am on Second passphrase registration page
    And I go to confirmation
    And I confirm transaction
    When I am on Wallet page
    Then The latest transaction is Second passphrase registration
