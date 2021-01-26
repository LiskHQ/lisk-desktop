Feature: Add bookmark

  Background:
    Given I login as genesis on devnet
    Given I am on wallet page
    When I click on searchIcon

  Scenario: Add a delegate to bookmarks
    And I search for account 537318935439898807L
    Then I click on searchAccountRow
    Then I should be on Account page
    Then I click on addBookmarkIcon
    Then The saveButton button must be active
    Then I click on saveButton
    When I click on bookmarkListToggle
    Then The bookmarkList should contain delegate