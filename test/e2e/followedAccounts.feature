Feature: Followed accounts
  Scenario: should add a followed account to list
    Given I'm logged in as "genesis"
    Then I should see 0 instances of "followed account"
    And I click "add account button"
    And I fill in "94495548317450502L" to "address" field
    When I click "next"
    And I click "next"
    Then I should see 1 instances of "followed account"
    And I should see "94495548317450502L" in "account title" field
    When I click "edit accounts"
    And I clear "account title" field
    When I fill in "Bob" to "account title" field
    And I click "edit accounts"
    And I should see "Bob" in "account title" field
    When I click "followed account"
    Then I should be on url "/explorer/accounts/94495548317450502L"
    And I should see text "Bob" in "account title" element
    When I go to "/dashboard"
    And I click "edit accounts"
    When I click "remove account"
    Then I should see 0 instances of "followed account"
