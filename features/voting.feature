Feature: Voting tab
  @ignore
  Scenario: should allow to view delegates
    Given I'm logged in as "any account"
    When I click tab number 2
    Then I should see table with 20 lines

  @ignore
  Scenario: should allow to view delegates with cold account
    Given I'm logged in as "empty account"
    When I click tab number 2
    Then I should see table with 20 lines

  @ignore
  Scenario: should allow to search delegates
    Given I'm logged in as "any account"
    When I click tab number 2
    And I fill in "genesis_42" to "search" field
    Then I should see table with 1 lines

  @ignore
  Scenario: search delegates should provide "no results" message
    Given I'm logged in as "any account"
    When I click tab number 2
    And I fill in "doesntexist" to "search" field
    Then I should see table with 1 lines
    And I should see text "No delegates found" in "empty message" element

  @ignore
  Scenario: should allow to view my votes
    Given I'm logged in as "genesis"
    When I click tab number 2
    And I click "my votes button"
    Then I should see delegates list with 101 lines

  @ignore
  Scenario: should not allow to vote if not enough funds for the fee
    Given I'm logged in as "empty account"
    When I click tab number 2
    And I click checkbox on table row no. 3
    And I click "vote button"
    Then I should see "Not enough LSK to pay 1 LSK fee" error message
    And "submit button" should be disabled

  @ignore
  Scenario: should allow to select delegates in the "Voting" tab and vote for them
    Given I'm logged in as "delegate candidate"
    When I click tab number 2
    And I click checkbox on table row no. 3
    And I click checkbox on table row no. 5
    And I click checkbox on table row no. 8
    And I click "vote button"
    And I click "submit button"
    Then I should see alert dialog with title "Success" and text "Your votes were successfully submitted. It can take several seconds before they are processed."

  @ignore
  Scenario: should allow to vote with second passphrase account
    Given I'm logged in as "second passphrase account"
    When I click tab number 2
    And I click checkbox on table row no. 3
    And I click checkbox on table row no. 5
    And I click checkbox on table row no. 8
    And I click "vote button"
    And I fill in second passphrase of "second passphrase account" to "second passphrase" field
    And I click "submit button"
    Then I should see alert dialog with title "Success" and text "Your votes were successfully submitted. It can take several seconds before they are processed."

  @ignore
  Scenario: should allow to select delegates in the "Vote" dialog and vote for them
    Given I'm logged in as "delegate candidate"
    When I click tab number 2
    And I click "vote button"
    And Search twice for "genesis_7" in vote dialog
    And I click "submit button"
    Then I should see alert dialog with title "Success" and text "Your votes were successfully submitted. It can take several seconds before they are processed."

  @ignore
  Scenario: should allow to remove votes form delegates
    Given I'm logged in as "genesis"
    When I click tab number 2
    And I click checkbox on table row no. 3
    And I click checkbox on table row no. 5
    And I click "vote button"
    And I click "submit button"
    Then I should see alert dialog with title "Success" and text "Your votes were successfully submitted. It can take several seconds before they are processed."

  @ignore
  Scenario: should allow to exit vote dialog
    Given I'm logged in as "genesis"
    When I click tab number 2
    And I click "vote button"
    And I click "cancel button"
    Then I should see no "modal dialog"
