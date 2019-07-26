Feature: Splashscreen

  Scenario: Log in to Mainnet (Network switcher is not enabled)
    Given I am on Splashscreen page
    When I explore as guest
    Then I should be connected to mainnet

  Scenario: Log in to Mainnet (Network switcher is enabled)
    Given showNetwork setting is true
    Given I am on Splashscreen page
    When I choose mainnet
    When I explore as guest
    Then I should be connected to mainnet

  Scenario: Log in to Testnet
    Given showNetwork setting is true
    Given I am on Splashscreen page
    When I choose testnet
    When I explore as guest
    Then I should be connected to testnet

  Scenario: Log in to Devnet
    Given showNetwork setting is true
    Given I am on Splashscreen page
    When I choose devnet
    When I explore as guest
    Then I should be connected to devnet


