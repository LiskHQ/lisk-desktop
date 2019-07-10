Feature: Search

  Background:
    Given I am on Dashboard page
    Then I open search

  Scenario: Search for Lisk ID, signed off
    When I search for account 537318935439898807L
    And I open account suggestion
    Then I should be on Account page of 537318935439898807L

  Scenario: Search for Lisk ID, signed in mainnet
    Given I autologin as genesis to devnet
    When I search for account 537318935439898807L
    And I open account suggestion
    Then I should be on Account page of 537318935439898807L

  Scenario: Search for Transaction, signed off
    When I search for transaction 881002485778658401
    And I open transaction suggestion
    Then I should be on Tx Details page of 881002485778658401

  Scenario: Search for Transaction, signed in testnet
    Given I autologin as genesis to testnet
    When I search for transaction 755251579479131174
    And I open transaction suggestion
    Then I should be on Tx Details page of 755251579479131174

  Scenario: Search for Delegate, signed in devnet
    Given I autologin as genesis to devnet
    When I search for account genesis_17
    And I open account suggestion
    Then I should be on Delegate page of genesis_17


