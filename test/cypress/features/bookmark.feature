Feature: Add bookmark

  Background:
    Given I login as genesis on testnet
    Given I am on wallet page
    When I click on searchIcon

  Scenario: Add a delegate to bookmarks
    And I search for account lskgonvfdxt3m6mm7jaeojrj5fnxx7vwmkxq72v79
    Then I click on searchAccountRow
    Then I should be on Account page
    Then I click on addBookmarkIcon
    Then The saveButton button must be active
    Then I click on saveButton
    When I click on bookmarkListToggle
    Then The bookmarkList should contain delegate

  Scenario: Add regular account to bookmarks
    And I search for account lskckzngagcs4d5gvsgxmgnabyfyj8pz266gv8s8t
    Then I click on searchAccountRow
    Then I should be on Account page
    Then I click on addBookmarkIcon
    Then The saveButton button must not be active
    And I fill testBmark in inputLabel field
    Then I click on saveButton
    When I click on bookmarkListToggle
    Then The bookmarkList should contain testBmark
