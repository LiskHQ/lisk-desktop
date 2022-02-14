Feature: Multisignature transaction

  Scenario: Register multisignature group (Mandatory, Optional, Optional, 2 signatures)
    Given I login as genesis on devnet
    And I wait 1 seconds
    Given I am on wallet page
    When I click on accountInfoMsign
    When I clear input multisignatureEditorInput
    And I fill 2 in multisignatureEditorInput field
    When I click on addNewMembers
    Then I enter the publicKey of genesis at input 1
    Then I enter the publicKey of multiSig_candidate at input 2
    Then I enter the publicKey of delegate at input 3
    Then I set 2 inputs as optional
    When I click on sendButton
    When I click on confirmBtn
    Then msignSendButton should not exist
    Then I should see downloadButton
    Then I should see copyButton

  Scenario: Sign transaction
      Given I login as multiSig_candidate on devnet
      And I wait 1 seconds
      When I click on signMultiSignTransactionToggle
      Then I paste a transaction
      When I click on confirmBtn
      Then I confirm data of firstTxSecondSign
      When I click on signBtn
      Then msignSendButton should not exist
      Then I should see downloadButton
      Then I should see copyButton

  Scenario: Send transaction
      Given I login as delegate on devnet
      And I wait 1 seconds
      When I click on signMultiSignTransactionToggle
      Then I paste a transaction
      When I click on confirmBtn
      Then I confirm data of firstTxThirdSign
      When I click on signBtn
      Then I should see downloadButton
      Then I should see copyButton
      Then I should see msignSendButton