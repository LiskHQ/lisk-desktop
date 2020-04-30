Feature: Wallet Votes

  Background:
    Given I login as genesis on devnet
    Given I am on Wallet page
    Given I open votes tab

  Scenario: 30 votes are shown, clicking show more loads more votes
    When I see 30 delegates
    And I click show more
    Then I see more than 30 votes

  Scenario: Filtering votes works
    When I filter votes
    Then I see 1 delegates in table

  Scenario: Click on voted delegate leads to account page
    When I click on voteRow
    Then I should be on Account page


