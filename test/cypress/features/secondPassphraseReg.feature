Feature: Second Passphrase Registration

  Scenario: Register second passphrase
    Given I login as second_passphrase_candidate on devnet
    Given I am on Dashboard page
    Given I click on settingsMenu
    Then I see this title: Settings
    Given I click on registerSecondPassphraseBtn
    Then I see this title: Register 2nd passphrase
    And I remember my passphrase
    And I confirm my passphrase
    Then I click on confirmationCheckbox
    And I click on confirmButton
    When I am on Wallet page
    Then The latest transaction is Second passphrase registration
