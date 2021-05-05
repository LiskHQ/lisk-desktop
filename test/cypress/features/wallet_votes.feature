Feature: Wallet Votes

  Background:
    Given I login as genesis on devnet

  Scenario: See all votes
    Given I am on Wallet page
    Given I open votes tab
    Then I see 2 delegates in table
