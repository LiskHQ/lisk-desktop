Feature: Search

  Scenario: Search for Transaction while signed out
    Given Network is set to devnet
    Given I am on login page
    When I click on searchIcon
    And I search for transaction a22d1d1959af42988746d350d4c21c3ffb81086e116de34d29148e6799bc2e8e
    Then I click on searchTransactionRow
    Then I should be on Tx Details page of a22d1d...c2e8e

  Scenario: Search for Lisk ID
    Given Network is set to devnet
    Given I login as genesis on devnet
    Given I am on Dashboard page
    When I click on searchIcon
    And I search for account lsk2df24om24b44hrw473ut66kv5yywk9yohwg4k7
    Then I click on searchAccountRow
    Then I should be on Account page of irvowcxlclonwcfvcpwp

  Scenario: Search for non-existent account
    Given Network is set to devnet
    Given I login as genesis on devnet
    When I click on searchIcon
    And I search for delegate 43th3j4bt324
    And I wait 3 seconds
    Then I should see no results

