Feature: Login

  Scenario: Log in to Mainnet (Network switcher is not enabled)
  Given Network switcher is disabled
    Given I am on Login page
    When I enter the passphrase of genesis
    When I login
    Then I should be connected to mainnet

  Scenario: Log in to Mainnet (Network switcher is enabled)
    Given I am on Login page
    And I click on settingsMenu
    And I click on switchNetworksTrigger
    And I click on closeDialog
    When I choose mainnet
    When I enter the passphrase of genesis
    When I login
    Then I should be connected to mainnet

  Scenario: Log in to Testnet
    Given I am on Login page
    When I choose testnet
    When I enter the passphrase of testnet_guy
    When I login
    Then I should be connected to testnet

  Scenario: Log in on devnet
    Given I am on Login page
    When I choose devnet
    When I enter the passphrase of genesis
    When I login
    Then I should be connected to devnet
    And I wait 2 seconds
    When I click on logoutBtn
    And I click on networkDropdown
    Then I should see customNodeReadMode
