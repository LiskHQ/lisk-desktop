Feature: Wallet Votes

  @basic
  Scenario: See all votes
    Given Network is set to devnet
    Given I am on login page
    When I click on searchIcon
    And I search for account lsk29eqdkm88v4zc6tbjv8435td54u33m3a3kgjjk
    Then I click on searchAccountRow
    Then I should be on Account page of dshjcrtyipnjbmycevil
    Given I open votes tab
    Then I should see 2 delegates in table
