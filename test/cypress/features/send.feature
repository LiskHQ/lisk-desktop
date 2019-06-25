Feature: Send
@focus
  Scenario: Transfer tx
    Given I autologin as genesis to devnet
    Given I am on Send page
    And I remember my balance
    When I fill in recipient
    And I fill in amount
    And I fill in message
    And I go to confirmation
    And I confirm transfer
    And I click ok
    Then I see the transaction in transaction list
    Then The balance is subtracted

  Scenario: Transfer tx with second passphrase
    Given showNetwork setting is true
    Given I am on Splashscreen page
    When I choose mainnet
    When I explore as guest
    Then I should be connected to mainnet

  Scenario: Launch protocol prefills fields  - from logged in state
    Given showNetwork setting is true
    Given I am on Splashscreen page
    When I choose testnet
    When I explore as guest
    Then I should be connected to testnet

  Scenario: Launch protocol prefills fields  - from logged out state
    Given showNetwork setting is true
    Given I am on Splashscreen page
    When I choose devnet
    When I explore as guest
    Then I should be connected to devnet

  Scenario: Error message is shown if transfer tx fails
    Given showNetwork setting is true
    Given I am on Splashscreen page
    When I choose devnet
    When I explore as guest
    Then I should be connected to devnet


