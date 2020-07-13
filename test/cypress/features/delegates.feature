Feature: Delegate

  Scenario: Displays 101 delegates and loads more as I scroll to bottom
    Given I login as genesis on testnet
    Given I am on Delegates page
    And I see 90 delegates on page
    When I click load more button
    And I see 180 delegates on page
