Feature: Stake validator

   # Background:
   #    Given I login as genesis on customNode
   #    And I wait 5 seconds
   #    Given I am on wallet page
   #    When I click on searchIcon
   #    And I search for account genesis_69
   #    Then I click on searchValidatorsRow
   #    Then I should be on Account page

   # @todo: disabled until account management is updated
   # @basic
   # Scenario: Down Stake for a validator when there are locked lsk
   #    And I click on openAddStakeDialog
   #    And I clear input amountInput
   #    And I fill 160 in amountInput field
   #    And I click on confirmBtn
   #    And I click on stakingQueueToggle
   #    And I click on txNextBtn
   #    And I click on confirmButton
   #    And I click on backToWalletButton
   #    Given I am on wallet page
   #    Then The latest transaction is stake

   # @basic
   # Scenario: Up Stake for a validator when there are locked lsk
   #    And I click on openAddStakeDialog
   #    And I clear input amountInput
   #    And I fill 200 in amountInput field
   #    And I click on confirmBtn
   #    And I click on stakingQueueToggle
   #    And I click on txNextBtn
   #    And I click on confirmButton
   #    And I click on backToWalletButton
   #    Given I am on wallet page
   #    Then The latest transaction is stake

   # @basic
   # Scenario: Remove Stake for a validator
   #    When I click on openAddStakeDialog
   #    And I click on removeStake
   #    And I click on stakingQueueToggle
   #    And I click on txNextBtn
   #    And I click on confirmButton
   #    And I click on backToWalletButton
   #    Given I am on wallet page
   #    Then The latest transaction is stake

   # @basic
   # Scenario: Unlock balance
   #    Given I am on wallet page
   #    Then I should see that 540 LSK are locked
   #    Then I click on openUnlockBalanceDialog
   #    Then I should see unlocking balance 200
   #    Then I should see available balance 300
   #    And I click on txNextBtn
   #    And I click on confirmButton
   #    And I click on backToWalletButton
   #    Then The latest transaction is unlocking
