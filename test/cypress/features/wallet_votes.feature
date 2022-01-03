Feature: Wallet Votes

  Scenario: See all votes
    Given Network is set to devnet
    Given I am on login page
    When I click on searchIcon
    And I search for account lskdxc4ta5j43jp9ro3f8zqbxta9fn6jwzjucw7yt
    Then I click on searchAccountRow
    Then I should be on Account page of overheated
    Given I open votes tab
    Then I should see 1 delegates in table
