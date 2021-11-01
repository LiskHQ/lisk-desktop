Feature: Vote delegate

#   Background:
#     Given I login as genesis on devnet
#     Given I am on wallet page
#     When I click on searchIcon
#     And I search for account 5059876081639179984L
#     Then I click on searchAccountRow
#     Then I should be on Account page

#   Scenario: Vote for a delegate
#     And I click on openAddVoteDialog
#     And I clear input amountInput
#     And I fill 40 in amountInput field
#     And I click on confirmBtn
#     And I click on votingQueueToggle
#     And I click on confirmBtn
#     And I click on confirmBtn
#     And I click on closeDialog
#     Given I am on wallet page
#     Then The latest transaction is voting

#   Scenario: Downvote for a delegate
#     And I click on openAddVoteDialog
#     And I clear input amountInput
#     And I fill 20 in amountInput field
#     And I click on confirmBtn
#     And I click on votingQueueToggle
#     And I click on confirmBtn
#     And I click on confirmBtn
#     And I click on closeDialog
#     Given I am on wallet page
#     Then The latest transaction is voting

#   Scenario: Unlock balance
#     Given I am on wallet page
#     Then I should see that 140 LSK are locked
#     Then I click on openUnlockBalanceDialog
#     Then I should see unlocking balance 20
#     And I click on unlockBtn
#     And I click on closeDialog
#     Then The latest transaction is unlocking
