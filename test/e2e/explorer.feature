Feature: Transactions page
  @testnet
  Scenario: should show search results for an account while being logged out
    Given I go to "/"
    And I wait 1 seconds
    When I click "explorer" menu
    When I fill in "1234L" to "search input" field
    And I click "input search button"
    And I wait 1 seconds
    Then I should see text "No activity yet" in "empty message" element
    When I clear "search bar input" field
    And I fill in "16313739661670634666L" to "search bar input" field
    When I click "search bar button"
    And I wait 1 seconds
    Then I should see 25 rows
    When I click "explorer" menu
    When I fill in "5" to "search input" field
    And I click "input search button"
    Then I should see text "No results" in "empty message" element
    When I clear "search bar input" field
    And I fill in "7362136860035636443" to "search bar input" field
    When I click "search bar button"
    Then I should see text "7362136860035636443" in "copy title" element

  @testnet
  Scenario: should show search results for an account and a transactions while being logged in
    Given I'm logged in as "genesis"
    And I wait 1 seconds
    When I click "explorer" menu
    When I fill in "1234L" to "search input" field
    And I click "input search button"
    And I wait 1 seconds
    Then I should see text "No activity yet" in "empty message" element
    When I clear "search bar input" field
    And I fill in "16313739661670634666L" to "search bar input" field
    When I click "search bar button"
    And I wait 1 seconds
    Then I should see 25 rows
    When I click "explorer" menu
    When I fill in "5" to "search input" field
    And I click "input search button"
    Then I should see text "No results" in "empty message" element
    When I clear "search bar input" field
    And I fill in "7362136860035636443" to "search bar input" field
    When I click "search bar button"
    Then I should see text "7362136860035636443" in "copy title" element


