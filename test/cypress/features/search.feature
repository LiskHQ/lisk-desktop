Feature: Search
  Background:
    Given I login as genesis on devnet
    Given I am on Dashboard page
    When I click on searchIcon

  # Scenario: Search for Transaction in mainnet, signed off
  #   And I search for transaction 15753715487817769755
  #   Then I click on searchTransactionRow
  #   Then I should be on Tx Details page of 15753715487817769755

  Scenario: Search for Lisk ID
    And I search for account 6566229458323231555L
    Then I click on searchAccountRow
    Then I should be on Account page of 656622...1555L

  Scenario: Search for non-existent account
    And I search for delegate 43th3j4bt324
    Then I should see no results

