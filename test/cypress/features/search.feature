Feature: Search

  Background:
    Given I am on Dashboard page
    Then I open search

  Scenario: Search for Transaction in mainnet, signed off
    When I search for transaction 881002485778658401
    And I open transaction suggestion
    Then I should be on Tx Details page of 881002485778658401

  Scenario: Search for Transaction in devnet, signed in
    Given I autologin as genesis to devnet
    When I search for transaction 18173130528211925456
    And I open transaction suggestion
    Then I should be on Tx Details page of 18173130528211925456

  Scenario: Search for Delegate in testnet, signed in
    Given I autologin as genesis to testnet
    When I search for delegate zero
    And I open delegate suggestion
    Then I should be on Delegate page of zero

  Scenario: Search for Lisk ID
    When I search for account 537318935439898807L
    And I open account suggestion
    Then I should be on Account page of 537318935439898807L

  Scenario: Search for non-existent account
    When I search for delegate 43th3j4bt324
    Then I should see no results

