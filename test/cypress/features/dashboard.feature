Feature: Dashboard
  Scenario: Open last transaction and open a bookmark item
    Given I login as genesis on devnet
    Given I have a bookmark saved
    Given I am on Dashboard page
    When I click on transactionRow
    Then I see this title: Transaction details
    Then I click on closeDialog
    When I click on bookmarkListToggle
    Then I click on bookmarkAccount
    And I scroll to top
    Then I should be on Account page
