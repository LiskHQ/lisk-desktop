Feature: Explorer page
  Scenario: should show search results on mainnet for an account while being logged out
    Given I go to "/"
    And I wait 1 seconds
    When I click "explorer" menu
    When I fill in "16313739661670634666L" to "search input" field
    And I click "input search button"
    And I wait 2 seconds
    Then I should see text "No activity yet" in "empty message" element
    When I clear "search bar input" field
    And I fill in "15610359283786884938L" to "search bar input" field
    When I click "search bar button"
    And I wait 2 seconds
    Then I should see 25 rows
    When I click "send to address"
    And I wait 1 seconds
    Then I should be on url "/?referrer=/main/transactions%3Faddress%3D15610359283786884938L"
    When I click "explorer" menu
    When I fill in "1465651642158264047" to "search input" field
    And I click "input search button"
    Then I should see text "No results" in "empty message" element
    When I clear "search bar input" field
    And I fill in "9938914350729699234" to "search bar input" field
    When I click "search bar button"
    Then I should see ID "9938914350729699234" in transaction header

  @advanced
  Scenario: should show search results on custom node for an account and a transactions while being logged in
    Given I'm logged in as "genesis"
    And I wait 1 seconds
    When I click "explorer" menu
    When I fill in "15610359283786884938L" to "search input" field
    And I click "input search button"
    And I wait 3 seconds
    Then I should see text "No activity yet" in "empty message" element
    When I clear "search bar input" field
    And I fill in "16313739661670634666L" to "search bar input" field
    When I click "search bar button"
    And I wait 1 seconds
    Then I should see 25 rows
    When I click "explorer" menu
    And I wait 1 seconds
    And I click "search result"
    Then I should be on url "/explorer/accounts/16313739661670634666L"
    When I click "send to address"
    Then I should see "16313739661670634666L" in "recipient" field
    When I click "explorer" menu
    When I fill in "9938914350729699234" to "search input" field
    And I click "input search button"
    Then I should see text "No results" in "empty message" element
    When I clear "search bar input" field
    And I fill in "1465651642158264047" to "search bar input" field
    When I click "search bar button"
    Then I should see ID "1465651642158264047" in transaction header
