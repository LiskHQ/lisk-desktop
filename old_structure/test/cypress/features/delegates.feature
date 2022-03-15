Feature: delegate
  Scenario: I should be on the delegates page
    Given Network is set to devnet
    And I am on delegates page
    And I wait 5 seconds

  Scenario: Should properly display delegates overview
    Then totalBlocks count should have value greater than 0
    And transactions count should have value greater than 0

  Scenario: Should properly display forging details
    When I observe blocksForged
    And I observe timeValue-clock
    And I observe forger list
    And I wait 10 seconds
    Then time timeValue should be incremented by at least 5 seconds
    And blocksForged should be incremented by at least 1
    And next forger list should be updated accordingly
    And next forger list should have a maximum of 6 delegates
    And next forgers should match first members of the inside round list
    
  Scenario: Inside round delegates should function properly
    When I click on insideRoundBtn
    Then I should see 103 delegates in table
    And first delegate should be forging
    When I sort by forgingTime
    Then delegates should be sorted in descending order by forgingTime
    When I fill genesis in filterDelegateInput field
    And I wait 2 seconds
    Then filtered results should be displayed
    When I watch a delegate
    And I wait 0.5 seconds
    Then delegate should be watched
  
  Scenario: Outside round delegates should function properly
    Given Network is set to devnet
    And I am on delegates page
    And I wait 5 seconds
    When I click on outsideRoundBtn
    Then I should see 20 delegates in table
    When I click on showMoreDelegatesBtn
    And I wait 1 seconds
    Then I should see 40 delegates in table
    When I sort by status
    Then delegates should be sorted in descending order by status
    Then delegates should be sorted in ascending order by status
    When I fill test_deleg in filterDelegateInput field
    And I wait 2 seconds
    Then filtered results should be displayed
    When I watch a delegate
    And I wait 0.5 seconds
    Then delegate should be watched

  Scenario: watch list should function properly
    When I clear input filterDelegateInput
    And I click on insideRoundBtn
    And I watch a delegate
    And I click on watchedBtn
    Then I should see 2 delegates in table
    When I don't watch a delegate
    Then I should see 1 delegates in table
    When I fill test in filterDelegateInput field
    And I wait 2 seconds
    Then filtered results should be displayed
    When I clear input filterDelegateInput
    And I fill not_valid in filterDelegateInput field
    Then I should see 0 delegates in table

  Scenario: Sanctioned delegates should function properly
    Given Network is set to testnet
    And I am on delegates page
    And I wait 5 seconds
    When I click on sanctionedBtn
    Then I should see 10 delegates in table
    When I click on showMoreDelegatesBtn
    And I wait 1 seconds
    Then I should see 20 delegates in table
    When I fill genesis in filterDelegateInput field
    And I wait 2 seconds
    Then filtered results should be displayed
    When I watch a delegate
    And I wait 0.5 seconds
    Then delegate should be watched

  Scenario: latest votes list should function properly
    Given Network is set to devnet
    And I am on delegates page
    And I wait 5 seconds
    When I click on latestVotesBtn
    Then I should see 10 votes in table
    When I click on showMoreDelegatesBtn
    Then I should see 20 votes in table
    When I click on voteRow
    Then I should be on a vote transaction details modal

