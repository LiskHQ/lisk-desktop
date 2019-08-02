Feature: Delegate

  Scenario: Displays 101 delegates and loads more as I scroll to bottom
    Given I autologin as genesis to testnet
    Given I am on Delegates page
    And I see 101 delegates on page
    When I click load more button
    And I see 202 delegates on page

  Scenario: Unvote and Vote
    Given I autologin as genesis to devnet
    Given I am on Delegates page
    When I start voting
    Then Added votes counter shows 0
    Then Total voting number shows 101
    When I choose the 1 delegate
    Then Removed votes counter shows 1
    Then Total voting number shows 100
    And I go to confirmation
    And I see 1 removed vote
    And I confirm transaction
    And I go back to delegates
    Then I see pending votes
    When I start voting
    And Voted delegate become unchecked
    When I choose the 1 delegate
    Then Added votes counter shows 1
    Then Total voting number shows 101
    And I go to confirmation
    Then I see 1 added vote
    And I confirm transaction
    And I go back to delegates
    Then I see pending votes
    When I start voting
    And Voted delegate become checked
    Given I am on Wallet page
    Then The latest transaction is Delegate vote

  Scenario: Vote with second passphrase
    Given I autologin as second_passphrase_account to devnet
    Given I am on Delegates page
    When I start voting
    When I choose the 1 delegate
    And I go to confirmation
    And I enter second passphrase of second_passphrase_account
    And I confirm transaction
    And I go back to delegates
    Then I see pending votes

  Scenario: Bulk vote/unvote delegates by URL
    Given I autologin as delegate_candidate to devnet
    When I use launch protokol link to vote
    Then I see 3 added vote
    Then I see 0 removed vote
    And I confirm transaction
    And I go back to delegates
    And I wait for pending vote to be approved
    When I use launch protokol link to unvote
    Then I see 0 added vote
    Then I see 1 removed vote
    When I use launch protokol link to vote for already voted
    Then I see 2 already voted
    Then I see 0 added vote
    Then I see 0 removed vote

