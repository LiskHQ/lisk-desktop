Feature: Dashboard
  Background:
    Given I have a bookmark saved
    Given I login as genesis on customNode
    And I wait 5 seconds
    Given I am on wallet page

  # @advanced
  @basic
  Scenario: Open last transaction and open a bookmark item
    Given I am on Dashboard page
    When I click on searchIcon
    And I search for account lskehmcfxh7vq6mpjgexe2c2ftq4gdeb5qfkoq8cm
    Then I click on searchAccountRow
    Then I should be on Account page
    Then I click on addBookmarkIcon
    Then The saveButton button must not be active
    And I fill testBmark in inputLabel field
    Then I click on saveButton
    When I click on bookmarkListToggle

    Given I am on Dashboard page
    When I click on transactionRow
    Then I see this title: Transaction details
    Then I click on closeDialog
    When I click on bookmarkListToggle
    Then I click on bookmarkAccount
    Then I should be on Account page
