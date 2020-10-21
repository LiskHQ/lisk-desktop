Feature: Vote delegate

  Background:
    Given I login as genesis on devnet
    Given I am on wallet page
    When I click on searchIcon
    And I search for account 537318935439898807L
    Then I click on searchAccountRow
    Then I should be on Account page

  Scenario: Vote for a delegate
    And I click on openAddVoteDialog
    And I clear input amountInput
    And I fill 40 in amountInput field
    And I click on confirmBtn
    And I click on votingQueueToggle
    And I click on confirmBtn
    And I click on confirmBtn
    And I click on closeDialog
    Given I am on wallet page
    Then The latest transaction is voting

  Scenario: Downvote for a delegate
    And I click on openAddVoteDialog
    And I clear input amountInput
    And I fill 40 in amountInput field
    And I click on removeVote
    And I click on votingQueueToggle
    And I click on confirmBtn
    And I click on confirmBtn
    And I click on closeDialog
    Given I am on wallet page
    Then The latest transaction is voting

  Scenario: Unlock balance
    Given I am on wallet page
    Then I should that 40 LSK are locked
    Then I click on openUnlockBalanceDialog
    Then I should see unlocking balance 40
    When I click on customFeeOption
    And I clear input customFeeInput
    And I fill 1 in customFeeInput field
    And I click on unlockBtn
    And I click on closeDialog
    Then The latest transaction is unlocking
