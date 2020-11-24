Feature: Send

  Scenario: Transfer tx + Header balance is affected
    Given I login as genesis on devnet
    Given I am on Wallet page
    And I remember my balance
    Then I click on sendLink
    When I fill 1234567890L in recipientInput field
    And I fill 5 in amountInput field
    When I click on customFeeOption
    And I clear input customFeeInput
    And I fill 1 in customFeeInput field
    Then The nextTransferBtn button must not be active
    And I clear input customFeeInput
    And I fill 0 in customFeeInput field
    Then The nextTransferBtn button must not be active
    Then It should change fee when changing priorities
    And I click on lowFeeOption
    And I go to transfer confirmation
    And I click on sendButton
    Then submittedTransactionMessage should be visible
    And I click on closeDialog
    Then The latest transaction is transfer to 1234567890L
    Then I should not see pending transaction
    Then I wait 3 seconds
    Then The balance is subtracted

  Scenario: Launch protocol prefills fields  - from logged in state
    Given I login as genesis on devnet
    When I follow the launch protokol link
    Then Send form fields are prefilled

  Scenario: Launch protocol prefills fields  - from logged out state
    Given I follow the launch protokol link
    When I enter first passphrase of genesis
    When I login
    Then Send form fields are prefilled

  Scenario: Error message is shown if transfer tx fails
    Given I mock api /transactions
    Given I login as genesis on devnet
    Given I am on Wallet page
    Then I click on sendLink
    When I fill 1234567890L in recipientInput field
    And I fill 4 in amountInput field
    And I go to transfer confirmation
    And I click on sendButton
    Then submittedTransactionMessage should be visible
    Then I see error message


