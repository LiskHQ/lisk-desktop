Feature: Send

  Scenario: Transfer tx + Header balance is affected
    Given I autologin as genesis to devnet
    Given I am on Send page
    And I remember my balance
    When I fill random recipient
    And I fill random amount
    And I go to transfer confirmation
    And I confirm transfer
    And I go back to wallet
    And I dismiss the onboarding
    Then I should see pending transaction
    Then The latest transaction is transfer to random
    Then I should not see pending transaction
    Then The balance is subtracted

  Scenario: Transfer tx with second passphrase
    Given I autologin as second_passphrase_account to devnet
    Given I am on Send page
    When I fill random recipient
    And I fill random amount
    And I go to transfer confirmation
    And I enter second passphrase of second_passphrase_account
    And I confirm transfer
    And I go back to wallet
    Then The latest transaction is transfer to random

  Scenario: Launch protocol prefills fields  - from logged in state
    Given I autologin as genesis to devnet
    When I follow the launch protokol link
    Then Send form fields are prefilled

  Scenario: Launch protocol prefills fields  - from logged out state
    Given I follow the launch protokol link
    When I enter first passphrase of genesis
    When I login
    Then Send form fields are prefilled

  Scenario: Error message is shown if transfer tx fails
    Given I mock api /transactions
    Given I autologin as genesis to devnet
    Given I am on Send page
    When I fill random recipient
    And I fill random amount
    And I go to transfer confirmation
    And I confirm transfer
    Then I see error message


