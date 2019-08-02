Feature: Register delegate

  Scenario: Register delegate + Header balance is affected
    Given I autologin as delegate_candidate to devnet
    Given I am on Register delegate page
    When I enter the delegate name
    And I go to confirmation
    And I confirm transaction
    Then I see successful message
    When I am on Wallet page
    Then The latest transaction is Delegate registration

  Scenario: Register delegate with second passphrase
    Given I autologin as second_passphrase_account to devnet
    Given I am on Register delegate page
    When I enter the delegate name
    And I go to confirmation
    And I enter second passphrase of second_passphrase_account
    And I confirm transaction
    Then I see successful message
    When I am on Wallet page
    Then The latest transaction is Delegate registration
