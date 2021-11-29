Feature: Wallet Votes

  Scenario: See all votes
    Given Network is set to testnet
    Given I am on login page
    When I click on searchIcon
    And I search for account lskqpfmunzzzbetjxtug6tnkh5mypv8z79rf6prex
    Then I click on searchAccountRow
    Then I should be on Account page of overheated
    Given I open votes tab
    Then I should see 1 delegates in table
