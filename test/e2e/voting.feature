Feature: Voting page
  Scenario: should allow to view delegates and more on scroll
    Given I'm logged in as "any account"
    When I go to "main/voting/"
    Then I should see table with 100 lines
    When I scroll to the bottom of "delegate list"
    Then I should see table with 200 lines

  Scenario: should allow to view delegates with cold account
    Given I'm logged in as "empty account"
    When I go to "main/voting/"
    Then I should see table with 100 lines

  Scenario: should allow to search delegates
    Given I'm logged in as "any account"
    When I go to "main/voting/"
    And I fill in "genesis_42" to "search" field
    Then I should see table with 1 lines
    And I clear "search" field
    And I fill in "doesntexist" to "search" field
    And I should see table with 0 lines
    And I should see text "No delegates found." in "empty message" element

  @integration
  Scenario: should allow to view my votes
    Given I'm logged in as "genesis"
    When I go to "main/voting/"
    And I click "filter voted"
    Then I should see table with 100 lines

  @testnet
  Scenario: should allow to select delegates in the "Voting" tab and vote for them
    Given I'm logged in as "delegate candidate"
    When I go to "main/voting/"
    And I click checkbox on table row no. 3
    And I click checkbox on table row no. 5
    And I click checkbox on table row no. 8
    And I click "next"
    And I click "confirm"
    And I wait 0.5 seconds
    Then I should see text "You’re votes are being processed and will be confirmed. It may take up to 10 minutes to be secured in the blockchain." in "result box message" element

  Scenario: should allow to vote with second passphrase account
    Given I'm logged in as "second passphrase account"
    When I go to "main/voting/"
    And I click checkbox on table row no. 3
    And I click checkbox on table row no. 5
    And I click checkbox on table row no. 8
    And I click "next"
    And I fill in second passphrase of "second passphrase account" to "second passphrase" field
    And I click "second passphrase next"
    And I click "confirm"
    And I wait 0.5 seconds
    Then I should see text "You’re votes are being processed and will be confirmed. It may take up to 10 minutes to be secured in the blockchain." in "result box message" element

  @integration
  Scenario: should allow to remove votes form delegates
    Given I'm logged in as "genesis"
    When I go to "main/voting/"
    And I click checkbox on table row no. 3
    And I click checkbox on table row no. 5
    And I click "next"
    And I click "confirm"
    And I wait 0.5 seconds
    Then I should see text "You’re votes are being processed and will be confirmed. It may take up to 10 minutes to be secured in the blockchain." in "result box message" element

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

  @integration
  @pending
  Scenario: should allow to select delegates in the "Vote" dialog and vote for them
    Given I'm logged in as "delegate candidate"
    When I click "voting" menu
    And I click "vote button"
    And Search twice for "genesis_7" in vote dialog
    And I click "submit button"
    Then I should see alert dialog with title "Success" and text "Your votes were successfully submitted. It can take several seconds before they are processed."

  @integration
  @pending
  Scenario: should not allow to vote if not enough funds for the fee
    Given I'm logged in as "empty account"
    When I go to "main/voting/"
    And I click checkbox on table row no. 3
    And I click "vote button"
    Then I should see "Insufficient funds for 1 LSK fee" error message
    And "submit button" should be disabled
