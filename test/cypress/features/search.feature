Feature: Search

  Scenario: Search for Transaction in mainnet, signed off
    Given I am on Dashboard page
    Then I open search
    When I search for transaction 881002485778658401
    And I open transaction suggestion
    Then I should be on Tx Details page of 881002485778658401

  Scenario: Search for Delegate in testnet, signed in
    Given I autologin as genesis to testnet
    Given I am on Dashboard page
    Then I open search
    When I search for delegate zero
    And I open delegate suggestion
    Then I should be on Delegate page of zero

  Scenario: Search for Lisk ID
    Given I am on Dashboard page
    Then I open search
    When I search for account 537318935439898807L
    And I open account suggestion
    Then I should be on Account page of 537318935439898807L

  Scenario: Search for non-existent account
    Given I am on Dashboard page
    Then I open search
    When I search for delegate 43th3j4bt324
    Then I should see no results

