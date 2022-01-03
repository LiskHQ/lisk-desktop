Feature: Vote delegate

   Background:
      Given I login as genesis on devnet
      Given I am on wallet page
      When I click on searchIcon
      And I search for account genesis_69
      Then I click on searchDelegatesRow
      Then I should be on Account page

   Scenario: Down Vote for a delegate when there are locked lsk
      And I click on openAddVoteDialog
      And I clear input amountInput
      And I fill 160 in amountInput field
      And I click on confirmBtn
      And I click on votingQueueToggle
      And I click on confirmBtn
      And I click on confirmButton
      And I click on backToWalletButton
      Given I am on wallet page
      Then The latest transaction is vote

   Scenario: Up Vote for a delegate when there are locked lsk
      And I click on openAddVoteDialog
      And I clear input amountInput
      And I fill 200 in amountInput field
      And I click on confirmBtn
      And I click on votingQueueToggle
      And I click on confirmBtn
      And I click on confirmButton
      And I click on backToWalletButton
      Given I am on wallet page
      Then The latest transaction is vote

   Scenario: Remove Vote for a delegate
      When I click on openAddVoteDialog
      And I click on removeVote
      And I click on votingQueueToggle
      And I click on confirmBtn
      And I click on confirmButton
      And I click on backToWalletButton
      Given I am on wallet page
      Then The latest transaction is vote

   Scenario: Unlock balance
      Given I am on wallet page
      Then I should see that 540 LSK are locked
      Then I click on openUnlockBalanceDialog
      Then I should see unlocking balance 40
      Then I should see available balance 300
      And I click on unlockBtn
      And I click on confirmButton
      # And I click on closeDialog
      And I click on backToWalletButton
      Then The latest transaction is unlocking
