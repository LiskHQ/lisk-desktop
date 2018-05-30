Feature: Voting page
  @testnet
  Scenario: should allow to view delegates and more on scroll and search them and vote for them
    Given I'm logged in as "delegate candidate"
    And I wait 0.1 seconds
    When I go to "delegates/"
    Then I should see 100 instances of "delegate row"
    When I scroll to the bottom of "delegate list"
    Then I should see 200 instances of "delegate row"
    And I fill in "genesis_42" to "search" field
    Then I should see 1 instances of "delegate row"
    And I click "clean icon"
    And I fill in "doesntexist" to "search" field
    Then I should see 0 instances of "delegate row"
    And I should see text "No delegates found." in "empty message" element
    And I click "clean icon"
    And I wait 1 seconds
    And I click checkbox on list item no. 3
    And I click checkbox on list item no. 5
    And I click checkbox on list item no. 8
    And I click "next"
    And I click "confirm"
    And I wait 0.5 seconds
    Then I should see text "You’re votes are being processed and will be confirmed. It may take up to 10 minutes to be secured in the blockchain." in "result box message" element

  Scenario: should allow to select delegates by URL
    Given I'm logged in as "delegate candidate"
    When I go to "/delegates/vote?votes=genesis_12,genesis_14,genesis_16"
    And I wait 1 seconds
    Then I should see text "genesis_12, genesis_14, genesis_16" in "upvotes message" element
    When I click "next"
    And I click "confirm"
    And I wait 0.5 seconds
    Then I should see text "You’re votes are being processed and will be confirmed. It may take up to 10 minutes to be secured in the blockchain." in "result box message" element
    And I wait 10 seconds
    And I go to "/delegates/vote?unvotes=genesis_12"
    When I refresh the page
    Then I should see text "genesis_12" in "unvotes message" element
    When I go to "/delegates/vote?votes=genesis_14,genesis_16"
    When I refresh the page
    And I wait 1 seconds
    Then I should see "alreadyVoted-message" element
