Feature: Verify Message

  @basic
  Scenario: Verify the integrity of a signed message in textarea
    Given I login as genesis on customNode
    And I wait 2 seconds
    And I open signMessage modal
    When I fill test_Message in signMessageInput field
    And I click on nextBtn
    And I click on copyToClipboardBtn
    And I open verifyMessage modal
    And I click on textAreaViewBtn
    Then I verify signed message in verifyMessageTextArea

  @basic
  Scenario: Verify the integrity of a tampered message in textArea view
    Given I login as genesis on customNode
    And I wait 2 seconds
    And I open verifyMessage modal
    And I click on textAreaViewBtn
    When I fill invalid_text in verifyMessageTextArea field
    And I click on continueBtn
    And I wait 2 seconds
    Then I see this title: The signature is incorrect

  @basic
  Scenario: Verify the integrity of a signed message in input fields view
    Given I login as genesis on customNode
    And I wait 2 seconds
    And I open verifyMessage modal
    And I click on inputsViewBtn
    When I fill test_message in verifyMessageInput field
    When I fill 167221bdf0af9f83fd9f0cda0aff264a836f4b85a0cf7ee5f6bec6029bb6d517 in verifyPublicKeyInput field
    When I fill 09392ac34e257b6cdb9bd4a73fc3901a073061c17b71ee4d4500fd600044eabd901b27584d59946f26a869a1e29ccdc87209272db545c02e43b4c083242ffc0d in verifySignatureInput field
    And I click on continueBtn
    And I wait 2 seconds
    Then I see this title: The signature is correct

  @basic
  Scenario: Verify the integrity of a tampered message in input fields view
    Given I login as genesis on customNode
    And I wait 2 seconds
    And I open verifyMessage modal
    And I click on inputsViewBtn
    When I fill tampered_message in verifyMessageInput field
    When I fill 167221bdf0af9f83fd9f0cda0aff264a836f4b85a0cf7ee5f6bec6029bb6d517 in verifyPublicKeyInput field
    When I fill 112233abcde in verifySignatureInput field
    And I click on continueBtn
    And I wait 2 seconds
    Then I see this title: The signature is incorrect
