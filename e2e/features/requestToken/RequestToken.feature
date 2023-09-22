Feature: Request Token
  Background: Add an account and navigate to wallet
    Given I add an account with passphrase "peanut hundred pen hawk invite exclude brain chunk gadget wait wrong ready" password "Password1$" name 'test_acc'
    And I go to page "wallet"
    And I wait for "1 seconds"
    And I click on a button with text "Request"
    Then I should see "Request tokens"
    And "lisk_mainchain" should be selected in "Recipient application" dropdown
    And "Lisk" should be selected in "Token" dropdown
    And button with text 'Copy link' should be disabled
    And Element 'qrContainer' should contain class 'disabled'

  Scenario: Request token should generate a copy link if amount is zero
    Given I type "0" in "amount"
    Then button with text 'Copy link' should be enabled
    And Element 'qrContainer' should not contain class 'disabled'

  Scenario: Request token should generate a copy link
    Given I type "10" in "amount"
    Then button with text "Copy link" should be enabled
    And Element 'qrContainer' should not contain class 'disabled'
    Given I click on a button with text "Copy link"
    Then Clipboard should contain "lisk://wallet?modal=send&recipient=lskm9syv4wrjcjczpegz65zqxhk2cp9dkejs5wbjb&amount=10&token=0400000000000000&recipientChain=04000000"

  Scenario: Request token should generate a copy link with message
    Given I type "10" in "amount"
    Then button with text "Copy link" should be enabled
    And Element 'qrContainer' should not contain class 'disabled'
    Given I click on a button with text "Add message (Optional)"
    And I type "hello" in "reference-field"
    And I click on a button with text "Copy link"
    Then Clipboard should contain "lisk://wallet?modal=send&recipient=lskm9syv4wrjcjczpegz65zqxhk2cp9dkejs5wbjb&amount=10&reference=hello&token=0400000000000000&recipientChain=04000000"
