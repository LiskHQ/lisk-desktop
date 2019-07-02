Feature: Delegate

  Scenario: Displays 101 delegates and loads more as I scroll to bottom
    Given I autologin as genesis to testnet
    Given I am on Delegates page
    And I see 101 delegates on page
    When I click load more button
    And I see 202 delegates on page
