Feature: Delegate

  Scenario: Displays 101 delegates and loads more as I scroll to bottom
    Given I login as genesis on devnet
    Given I am on Delegates page
    And I see 90 delegates on page
    When I click load more button
    And I see 103 delegates on page
