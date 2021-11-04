Feature: Search

  Scenario: Search for Transaction while signed out
    Given Network is set to testnet
    Given I am on login page
    When I click on searchIcon
    And I search for transaction 21f537cddf1701a586788a266e1fa3664cd9441e922942c55eef2cf4d0b441c4
    Then I click on searchTransactionRow
    Then I should be on Tx Details page of 21f537...441c4

  Scenario: Search for Lisk ID
    Given Network is set to testnet
    Given I login as genesis on testnet
    Given I am on Dashboard page
    When I click on searchIcon
    And I search for account lsks3nfpf5bt6xa5qo73ftgaersg89t8fx5ov9d9z
    Then I click on searchAccountRow
    Then I should be on Account page of gr33ndrag0n

  Scenario: Search for non-existent account
    Given Network is set to testnet
    Given I login as genesis on testnet
    When I click on searchIcon
    And I search for delegate 43th3j4bt324
    Then I should see no results

