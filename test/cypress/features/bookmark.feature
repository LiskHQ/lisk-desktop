Feature: Add bookmark

  Background:
    Given I am on Login page
    When I click on settingsMenu
    And I click on switchNetworksTrigger
    And I click on closeDialog
    Given I login as genesis on devnet
    Given I am on wallet page
    When I click on searchIcon

  Scenario: Add a delegate to bookmarks
    And I search for account 10016685355739180605L
    Then I click on searchAccountRow
    Then I should be on Account page
    Then I click on addBookmarkIcon
    Then The saveButton button must be active
    Then I click on saveButton
    When I click on bookmarkListToggle
    Then The bookmarkList should contain delegate

  Scenario: Add regular account to bookmarks
    And I search for account 16422276087748907680L
    Then I click on searchAccountRow
    Then I should be on Account page
    Then I click on addBookmarkIcon
    Then The saveButton button must not be active
    And I fill testBmark in inputLabel field
    Then I click on saveButton
    When I click on bookmarkListToggle
    Then The bookmarkList should contain testBmark
