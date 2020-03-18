Feature: Register delegate

  Scenario: Register delegate + Header balance is affected
    Given I login as delegate_candidate on devnet
    Given I am on Register delegate page
    When I enter the delegate name
    And I go to confirmation
    And I click on confirmButton
    Then I see successful message
    When I am on Wallet page
    Then The latest transaction is Delegate registration

  Scenario: Register delegate with second passphrase
    Given I login as second_passphrase_account on devnet
    Given I am on Register delegate page
    When I enter the delegate name
    And I go to confirmation
    And I enter second passphrase of second_passphrase_account
    And I click on confirmButton
    Then I see successful message
    When I am on Wallet page
    Then The latest transaction is Delegate registration
