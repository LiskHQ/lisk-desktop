Feature: Request Token
  Background: Add an account and navigate to wallet
    Given I add an account with passphrase "peanut hundred pen hawk invite exclude brain chunk gadget wait wrong ready" password "Password1$" name 'test_acc'
    Then I go to page "wallet"

  Scenario: Request token modal should show default
    Given I click on a button with text "Request"
    Then I should see "Request tokens"
