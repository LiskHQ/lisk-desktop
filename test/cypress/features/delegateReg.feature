Feature: Register delegate

  Scenario: Register delegate + Header balance is affected
    Given I login as delegate_candidate on devnet
    Given I am on wallet page
    And I click on votesTab
    Given I click on becomeDelegateLink
    Then I see this title: Become a delegate
    When I enter the delegate name
    And I go to confirmation
    And I click on confirmButton
    Then I see successful message
    When I am on Wallet page
    Then The latest transaction is Delegate registration
