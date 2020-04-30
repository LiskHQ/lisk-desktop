Feature: Send

  Scenario: Transfer tx + Header balance is affected
    Given I login as genesis on devnet
    Given I am on Send page
    And I remember my balance
    When I fill 1234567890L in recipientInput field
    And I fill 5 in amountInput field
    And I go to transfer confirmation
    And I click on sendButton
    Then submittedTransactionMessage should be visible
    And I click on okayButton
    Then I should see pending transaction
    Then The latest transaction is transfer to 1234567890L
    Then I should not see pending transaction
    Then The balance is subtracted

  Scenario: Transfer tx with second passphrase
    Given I login as second_passphrase_account on devnet
    Given I am on Send page
    When I fill 1234567890L in recipientInput field
    And I fill 3 in amountInput field
    And I go to transfer confirmation
    And I enter second passphrase of second_passphrase_account
    And I click on sendButton
    Then submittedTransactionMessage should be visible
    And I click on okayButton
    Then The latest transaction is transfer to 1234567890L

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
    Given I am on Send page
    When I fill 1234567890L in recipientInput field
    And I fill 4 in amountInput field
    And I go to transfer confirmation
    And I click on sendButton
    Then submittedTransactionMessage should be visible
    Then I see error message


