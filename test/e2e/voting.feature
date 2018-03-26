Feature: Voting page
  Scenario: should allow to view delegates and more on scroll
    Given I'm logged in as "any account"
    And I wait 0.1 seconds
    When I go to "main/voting/"
    Then I should see 100 instances of "delegate row"
    When I scroll to the bottom of "delegate list"
    Then I should see 200 instances of "delegate row"

  Scenario: should allow to view delegates with cold account
    Given I'm logged in as "empty account"
    And I wait 0.1 seconds
    When I go to "main/voting/"
    Then I should see 100 instances of "delegate row"

  Scenario: should allow to search delegates
    Given I'm logged in as "any account"
    And I wait 0.1 seconds
    When I go to "main/voting/"
    And I fill in "genesis_42" to "search" field
    Then I should see 1 instances of "delegate row"
    And I clear "search" field
    And I fill in "doesntexist" to "search" field
    Then I should see 0 instances of "delegate row"
    And I should see text "No delegates found." in "empty message" element

  @testnet
  Scenario: should allow to select delegates in the "Voting" tab and vote for them
    Given I'm logged in as "delegate candidate"
    And I wait 0.5 seconds
    When I go to "main/voting/"
    And I click checkbox on list item no. 3
    And I click checkbox on list item no. 5
    And I click checkbox on list item no. 8
    And I click "next"
    And I click "confirm"
    And I wait 0.5 seconds
    Then I should see text "You’re votes are being processed and will be confirmed. It may take up to 10 minutes to be secured in the blockchain." in "result box message" element

  Scenario: should allow to vote with second passphrase account
    Given I'm logged in as "second passphrase account"
    And I wait 0.1 seconds
    When I go to "main/voting/"
    And I click checkbox on list item no. 3
    And I click checkbox on list item no. 5
    And I click checkbox on list item no. 8
    And I click "next"
    And I fill in second passphrase of "second passphrase account" to "second passphrase" field
    And I click "second passphrase next"
    And I click "confirm"
    And I wait 0.5 seconds
    Then I should see text "You’re votes are being processed and will be confirmed. It may take up to 10 minutes to be secured in the blockchain." in "result box message" element
  
  @pending
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
