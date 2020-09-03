Feature: Login

  Scenario: Log in to Mainnet (Network switcher is not enabled)
    Given I am on Login page
    When I enter first passphrase of genesis
    When I login
    Then I should be connected to mainnet

  Scenario: Log in to Mainnet (Network switcher is enabled)
    Given I am on Login page
    When I click on settingsMenu
    And I click on switchNetworksTrigger
    And I click on closeDialog
    When I choose mainnet
    When I enter first passphrase of genesis
    When I login
    Then I should be connected to mainnet

  Scenario: Log in to Testnet
    Given I am on Login page
    When I click on settingsMenu
    And I click on switchNetworksTrigger
    And I click on closeDialog
    When I choose testnet
    When I enter first passphrase of testnet_guy
    When I login
    Then I should be connected to testnet

  Scenario: Log in on devnet
    Given I am on Login page
    When I click on settingsMenu
    And I click on switchNetworksTrigger
    And I click on closeDialog
    When I choose devnet
    When I enter first passphrase of genesis
    When I login
    Then I should be connected to devnet

  Scenario: Log in to Mainnet (Network switcher is not enabled)
    Given I am on Login page
    When I am on dashboard page
    Then I should be connected to network mainnet

  Scenario: Log in to Mainnet (Network switcher is enabled)
    Given I am on Login page
    When I click on settingsMenu
    And I click on switchNetworksTrigger
    And I click on closeDialog
    When I choose mainnet
    When I am on dashboard page
    Then I should be connected to network mainnet

  Scenario: Log in to Testnet
    Given I am on Login page
    When I click on settingsMenu
    And I click on switchNetworksTrigger
    And I click on closeDialog
    When I choose testnet
    When I am on dashboard page
    Then I should be connected to network testnet

  Scenario: Log in to devnet
    Given I am on Login page
    When I click on settingsMenu
    And I click on switchNetworksTrigger
    And I click on closeDialog
    When I choose devnet
    When I am on dashboard page
    Then I should be connected to network devnet


