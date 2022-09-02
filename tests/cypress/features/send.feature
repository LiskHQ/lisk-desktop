Feature: Send

  # @basic
  # Scenario: Error message is shown if transfer tx fails
  #     Given I login as genesis on customNode
  #     Given I mock api /transactions
  #     Given  I wait 5 seconds
  #     Given I am on Wallet page
  #     Then I click on sendLink
  #     When I paste lsk29eqdkm88v4zc6tbjv8435td54u33m3a3kgjjk in recipientInput field
  #     And I fill 4 in amountInput field
  #     And I go to transfer confirmation
  #     And I click on sendButton
  #     Given  I wait 5 seconds
  #     Then submittedTransactionMessage should be visible
  #     Then I see error message

  # @basic
  # @todo: disabled until account management is updated
  #  Scenario: Transfer tx + Header balance is affected
  #    Given I login as genesis on customNode
  #    Given  I wait 5 seconds
  #    Given I am on Wallet page
  #    And I remember my balance
  #    Then I click on sendLink
  #    When I paste lsk29eqdkm88v4zc6tbjv8435td54u33m3a3kgjjk in recipientInput field
  #    And I fill 0.1 in amountInput field
  #    And I go to transfer confirmation
  #    And I click on sendButton
  #    Then submittedTransactionMessage should be visible
  #    And I click on closeDialog
  #    Then The latest transaction is transfer to lsk29e...kgjjk
  #    Then I wait 10 seconds
  #    Then The balance is subtracted

  # @advanced
  # @basic
  # Scenario: Launch protocol prefills fields  - from logged in state
  #   Given I am on Login page
  #   Given I login as genesis on customNode
  #   Given  I wait 5 seconds
  #   When I follow the launch protocol link
  #   Then Send form fields are prefilled

  # # @advanced
  # @basic
  # Scenario: Launch protocol prefills fields  - from logged out state
  #   Given I follow the launch protocol link
  #   When I enter the passphrase of genesis on customNode
  #   When I login
  #   Then Send form fields are prefilled


