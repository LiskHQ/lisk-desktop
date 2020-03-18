Feature: Dashboard
  Scenario: Open last transaction and open a bookmark item
    Given I login as genesis on devnet
    Given I have a bookmark saved
    Given I am on Dashboard page
    When I click on transactionRow
    Then I should be on Tx Details page
    Then I click on goBack
    When I click on bookmarkAccount
    Then I should be on Account page
