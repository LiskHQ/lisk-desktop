Feature: Wallet Votes

  Scenario: See all votes
    Given I login as genesis on devnet
    Given I am on Wallet page
    Given I open votes tab
    Then I see 1 delegates in table
