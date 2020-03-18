Feature: Delegate

  Scenario: Displays 101 delegates and loads more as I scroll to bottom
    Given I login as genesis on testnet
    Given I am on Delegates page
    And I see 90 delegates on page
    When I click load more button
    And I see 180 delegates on page

  Scenario: Bulk vote/unvote delegates by URL
    Given I login as delegate_candidate on devnet
    When I use launch protocol link to vote
    Then I see 3 added vote
    Then I see 0 removed vote
    And I click on confirmButton
    And I go back to delegates
    And I wait for pending vote to be approved
    When I use launch protocol link to unvote
    Then I see 0 added vote
    Then I see 1 removed vote
    When I use launch protocol link to vote for already voted
    Then I see 2 already voted
    Then I see 0 added vote
    Then I see 0 removed vote

