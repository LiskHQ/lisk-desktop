Feature: Wallet Votes

  Scenario: See all votes
    Given Network is set to testnet
    Given I am on login page
    When I click on searchIcon
    And I search for account lskohh78u44eaxat4rvzbsrmde8ke3z93yjxywqr5
    Then I click on searchAccountRow
    Then I should be on Account page of billy_eilish
    Given I open votes tab
    Then I should see 7 delegates in table
