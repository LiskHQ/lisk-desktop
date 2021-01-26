Feature: Dashboard
  Background:
    Given I have a bookmark saved
    Given I login as genesis on devnet
    Given I am on wallet page

  Scenario: Open last transaction and open a bookmark item
    Given I am on Dashboard page
    When I click on transactionRow
    Then I see this title: Transaction details
    Then I click on closeDialog
    When I click on bookmarkListToggle
    Then I click on bookmarkAccount
    Then I should be on Account page
