Feature: Voting tab
  Scenario: should allow to view delegates and more on scroll
    Given I'm logged in as "any account"
    When I click tab number 2
    Then I should see table with 100 lines
    When I scroll to the bottom
    Then I should see table with 200 lines

  Scenario: should allow to view delegates with cold account
    Given I'm logged in as "empty account"
    When I click tab number 2
    Then I should see table with 100 lines

  Scenario: should allow to search delegates
    Given I'm logged in as "any account"
    When I click tab number 2
    And I fill in "genesis_42" to "search" field
    Then I should see table with 1 lines
    And I clear "search" field
    And I fill in "doesntexist" to "search" field
    And I should see table with 0 lines
    And I should see text "No delegates found" in "empty message" element

  @integration
  Scenario: should allow to view my votes
    Given I'm logged in as "genesis"
    When I click tab number 2
    And I click "my votes button"
    Then I should see delegates list with 101 lines

  @integration
  Scenario: should not allow to vote if not enough funds for the fee
    Given I'm logged in as "empty account"
    When I click tab number 2
    And I click checkbox on table row no. 3
    And I click "vote button"
    Then I should see "Insufficient funds for 1 LSK fee" error message
    And "submit button" should be disabled

  @integration
  Scenario: should display voting bar with numbers of selected votes if any selected
    Given I'm logged in as "delegate candidate"
    When I click tab number 2
    And I should see no "voting bar"
    And I click checkbox on table row no. 3
    Then I should see element "voting bar" that contains text:
      """
      Upvotes: 1
      Downvotes: 0
      Total new votes: 1 / 33
      Total votes: 1 / 101
      """
    And I click checkbox on table row no. 5
    And I should see element "voting bar" that contains text:
      """
      Upvotes: 2
      Downvotes: 0
      Total new votes: 2 / 33
      Total votes: 2 / 101
      """
    And I click checkbox on table row no. 3
    And I click checkbox on table row no. 5
    And I should see no "voting bar"

  @testnet
  Scenario: should allow to select delegates in the "Voting" tab and vote for them
    Given I'm logged in as "delegate candidate"
    When I click tab number 2
    And I click checkbox on table row no. 3
    And I click checkbox on table row no. 5
    And I click checkbox on table row no. 8
    And I click "vote button"
    And I wait 1 seconds
    And I click "submit button"
    Then I should see alert dialog with title "Success" and text "Your votes were successfully submitted. It can take several seconds before they are processed."

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

  @integration
  @pending
  Scenario: should allow to select delegates in the "Vote" dialog and vote for them
    Given I'm logged in as "delegate candidate"
    When I click tab number 2
    And I click "vote button"
    And Search twice for "genesis_7" in vote dialog
    And I click "submit button"
    Then I should see alert dialog with title "Success" and text "Your votes were successfully submitted. It can take several seconds before they are processed."

  @integration
  Scenario: should allow to remove votes form delegates
    Given I'm logged in as "genesis"
    When I click tab number 2
    And I click checkbox on table row no. 3
    And I click checkbox on table row no. 5
    And I click "vote button"
    And I wait 1 seconds
    And I click "submit button"
    Then I should see alert dialog with title "Success" and text "Your votes were successfully submitted. It can take several seconds before they are processed."

  @integration
  Scenario: should allow to exit vote dialog
    Given I'm logged in as "genesis"
    When I click tab number 2
    And I click "vote button"
    And I wait 1 seconds
    And I click "cancel button"
    Then I should see no "modal dialog"

  Scenario: should allow to select delegates by URL
    Given I'm logged in as "delegate candidate"
    When I go to "/main/voting/vote?votes=standby_27,standby_28,standby_29,nonexisting_22&unvotes=standby_33"
    And I wait 3 seconds
    Then I should see text "3 delegate names were successfully resolved for voting." in "upvotes message" element
    And I should see text "1 of the delegate names selected for unvoting was not currently voted for:standby_33" in "notVotedYet message" element
    And I should see text "1 of the provided delegate names could not be resolved:nonexisting_22" in "notFound message" element
    And I should see "vote list" element with text matching regexp:
      """
      standby_2[789]
      standby_2[789]
      standby_2[789]
      """
