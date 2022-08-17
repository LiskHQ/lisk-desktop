Feature: TokenUsage
  Background:
    Given I login as genesis on customNode
    And I wait 2 seconds
    And I am on wallet page
    And I wait 0.5 seconds

  @basic
  Scenario: Request token
    When I click on requestTokenButton
    Then I should be on request token modal page
    And request token page should be properly displayed
    When I click on recipientChainSelect
    And I click on recipientChainDropdownOption
    And I click on tokenSelect
    And I click on tokenDropdownOption
    And I paste 20 in requestTokenAmountField field
    And I click on addMessageButton
    And I fill test_Message in messageTextArea field
    And I click on copyRequestTokenButton
    Then request token url should be on clipboard
    When I click on removeMessageIcon
    And I click on copyRequestTokenButton
    And I wait 1 seconds
    Then request token url on clipboard should not have reference
