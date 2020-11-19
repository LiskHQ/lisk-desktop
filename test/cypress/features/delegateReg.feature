Feature: Register delegate

  Scenario: Register delegate + Header balance is affected
    Given I login as delegate_candidate on devnet
    Given I am on wallet page
    And I click on votesTab
    Given I click on becomeDelegateLink
    Then I see this title: Become a delegate
    When I enter the delegate name
    When I click on customFeeOption
    And I clear input customFeeInput
    And I fill 26 in customFeeInput field
    Then The chooseDelegateName button must not be active
    And I clear input customFeeInput
    And I fill 9 in customFeeInput field
    Then The chooseDelegateName button must not be active
    Then It should change fee when changing priorities
    When I click on customFeeOption
    And I clear input customFeeInput
    And I fill 11 in customFeeInput field
    And I go to confirmation
    And I click on confirmButton
    Then I see successful message
    When I am on Wallet page
    Then The latest transaction is Delegate registration
