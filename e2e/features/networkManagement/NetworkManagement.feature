Feature: Network Management
  Background: Add an account and navigate open Switch network modal
    Given I go to page "wallet"
    And I wait for "1 seconds"
    And I click on a button with text "customNode"
    Then "CustomNode" should be selected in "Switch network" dropdown
    Given I click on text "Add network"
    Then I should be redirected to route: 'wallet?modal=dialogAddNetwork'
    And button with text "Add network" should be disabled
    Given I type "custom_devnet" in "name"
    And I type "http://devnet-service.liskdev.net:9901" in "serviceUrl"
    And I type "ws://devnet-service.liskdev.net:9901" in "wsServiceUrl"
    And I wait for "1 seconds"
    And I click on a button with text "Add network"
    Then I should see 'Custom network added "custom_devnet"'

  Scenario: Edit network name
    Given I open edit network modal for network "custom_devnet"
    And I type "edited_custom_devnet" in "name"
    And I click on a button with text "Save network"
    Then I should see 'Custom network edited "edited_custom_devnet"'

  Scenario: Delete network
    Given I click on a button with testId "selected-menu-item"
    And I hover over "custom_devnet"
    And I click on img with alt text "deleteIcon" next to text "custom_devnet"
    Then I should see "Remove network?"
    Given I click on a button with text "Remove network"
    Then I should see 'Network removed "custom_devnet"'

  Scenario: Switch network
    Given I click on a button with testId "selected-menu-item"
    And I click on exact text "custom_devnet"
    Then "custom_devnet" should be selected in "Switch network" dropdown

  Scenario: Error message when a wrong serviceUrl is inputted
    Given I click on text "Add network"
    Then I should be redirected to route: 'wallet?modal=dialogAddNetwork'
    And button with text "Add network" should be disabled
    Given I type "custom_devnet" in "name"
    And I type "http://devnet-service.liskdev.net:9901" in "serviceUrl"
    And I click on a button with text "Add network"
    Then I should see "Name & ServiceUrl already exists."

  Scenario: Error message add a wrong serviceUrl
    Given I click on text "Add network"
    Then I should be redirected to route: 'wallet?modal=dialogAddNetwork'
    And button with text "Add network" should be disabled
    Given I type "testnet" in "name"
    And I type "https://testnet-doesntexists.lisk.com" in "serviceUrl"
    And I wait for "1 seconds"
    Then I should see "Failed to fetch: onchain, offchain data. Please check the URL."
