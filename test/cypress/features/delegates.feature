Feature: Delegate

  Scenario: Displays 103 delegates and loads more as I scroll to bottom
    Given I login as genesis on devnet
    Given I am on Voting page
    And I see 90 delegates on page
    When I click load more button
    And I see 104 delegates on page
