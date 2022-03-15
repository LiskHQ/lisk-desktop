Feature: Register delegate
    Background:
        Given I login as genesis on devnet
        And I wait 5 seconds

   Scenario: Register delegate + Header balance is affected
        Given I am on wallet page
        When I click on votesTab
        And I click on becomeDelegateLink
        Then I see this title: Register delegate
        When I fill test_deligate in delegateNameInput field
        Then I wait 1.2 seconds
        When I click on chooseDelegateName
        And I click on confirmButton
        Then I wait 12 seconds
        Then I see this title: Delegate registration succeeded
        Given I am on Wallet page
        Then The latest transaction is Register delegate
