Feature: Login

  Scenario: Log in to Mainnet (Network switcher is not enabled)
    Given I am on Login page
    When I enter first passphrase of genesis
    When I login
    Then I should be connected to mainnet

  Scenario: Log in to Mainnet (Network switcher is enabled)
    Given showNetwork setting is true
    Given I am on Login page
    When I choose mainnet
    When I enter first passphrase of genesis
    When I login
    Then I should be connected to mainnet

  Scenario: Log in to Testnet
    Given showNetwork setting is true
    Given I am on Login page
    When I choose testnet
    When I enter first passphrase of testnet_guy
    When I login
    Then I should be connected to testnet

  Scenario: Log in on devnet
    Given showNetwork setting is true
    Given I am on Login page
    When I choose devnet
    When I enter first passphrase of genesis
    When I login
    Then I should be connected to devnet

  Scenario: Log in to Mainnet (Network switcher is not enabled)
    Given I am on Login page
    When I am on dashboard page
    Then I should be connected to network mainnet

  Scenario: Log in to Mainnet (Network switcher is enabled)
    Given showNetwork setting is true
    Given I am on Login page
    When I choose mainnet
    When I am on dashboard page
    Then I should be connected to network mainnet

  Scenario: Log in to Testnet
    Given showNetwork setting is true
    Given I am on Login page
    When I choose testnet
    When I am on dashboard page
    Then I should be connected to network testnet

  Scenario: Log in to devnet
    Given showNetwork setting is true
    Given I am on Login page
    When I choose devnet
    When I am on dashboard page
    Then I should be connected to network devnet

  Scenario: Log out
    Given showNetwork setting is true
    Given I am on Login page
    When I choose testnet
    When I am on dashboard page
    Given I change active token to BTC
    Then I should see lisk monitor features


