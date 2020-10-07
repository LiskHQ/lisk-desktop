Feature: Vote delegate

  Scenario: Vote for a delegate
    Given I login as genesis on devnet
    Given I am on wallet page
    And I click on openAddVoteDialog
    And I fill 30 in amountInput field
    And I click on confirmBtn
    And I click on votingQueueToggle
    And I click on confirmBtn
    And I click on confirmBtn
    And I click on closeDialog
    And I click on openAddVoteDialog
    And I clear input amountInput
    And I fill 10 in amountInput field
    And I click on removeVote
    And I click on votingQueueToggle
    And I click on confirmBtn
    And I click on confirmBtn
    And I click on closeDialog
    And I click on openUnlockBalanceDialog
    And I click on unlockBtn
    And I click on closeDialog
