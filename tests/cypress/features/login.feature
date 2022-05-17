Feature: Login

  @basic
  Scenario: Log in to Mainnet (Network switcher is not enabled)
    Given Network switcher is disabled
    Given I am on Login page
    When I enter the passphrase of mainnet_guy
    When I login
    Then I should be connected to mainnet
    Given  I wait 4 seconds

  @basic
  Scenario: Log in to Testnet
    Given Network switcher is disabled
    Given I am on Login page
    And I click on settingsMenu
    And I click on switchNetworksTrigger
    And I click on closeDialog
    When I choose testnet
    When I enter the passphrase of testnet_guy
    When I login
    Then I should be connected to testnet

  @basic
  Scenario: Log in on customNode
    Given I am on Login page
    When I choose customNode
    When I enter the passphrase of genesis
    When I login
    Then I should be connected to customNode
    And I wait 2 seconds
    When I click on logoutBtn
    And I click on networkDropdown
    Then I should see customNodeReadMode
