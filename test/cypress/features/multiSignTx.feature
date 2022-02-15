Feature: Multisignature transaction

  Scenario: Register multisignature group (Mandatory, Mandatory)
    Given I login as genesis on devnet
    And I wait 1 seconds
    Given I am on wallet page
    When I click on accountInfoMsign
    When I clear input multisignatureEditorInput
    And I fill 2 in multisignatureEditorInput field
    Then I enter the publicKey of genesis at input 1
    Then I enter the publicKey of delegate at input 2
    When I click on sendButton
    When I click on confirmBtn
    Then msignSendButton should not exist
    Then I should see downloadButton
    Then I should see copyButton

  Scenario: Sign transaction and send transaction (Mandatory, Mandatory)
    Given I login as delegate on devnet
    And I wait 1 seconds
    When I click on signMultiSignTransactionToggle
    Then I paste transaction SecondTxSecondSign
    When I click on confirmBtn
    Then I confirm data of SecondTxSecondSign
    When I click on signBtn
    Then I should see downloadButton
    Then I should see copyButton
    Then I should see msignSendButton
    And I click on msignSendButton
    And I click on closeDialog
    When I click on searchIcon
    And I search for account lskdxc4ta5j43jp9ro3f8zqbxta9fn6jwzjucw7yt
    Then I click on searchAccountRow
    Then I should be on Account page of test_deligate
    Then The latest transaction is Register multisig. group

  Scenario: Send transaction using second passphrase (Mandatory, Mandatory)
    Given I login as genesis on devnet
    And I wait 1 seconds
    Given I am on wallet page
    Then I click on sendLink
    When I paste lsks6wh4zqfd8wyka3rj243rshcdqyug9gyvehxwz in recipientInput field
    And I fill 10 in amountInput field
    And I go to transfer confirmation
    When I click on useSecondPassphraseBtn
    Then I input second passphrase
    And I click on sendButton
    Then I should see downloadButton
    Then I should see copyButton
    Then I should see msignSendButton
    And I click on msignSendButton
    Then submittedTransactionMessage should be visible
    And I click on closeDialog
    Then I wait 3 seconds
    Then The latest transaction is transfer to lsks6w...ehxwz

  Scenario: Register multisignature group (Mandatory, Optional, Optional, 2 signatures)
    Given I login as multiSig_candidate on devnet
    And I wait 1 seconds
    Given I am on wallet page
    When I click on accountInfoMsign
    When I clear input multisignatureEditorInput
    And I fill 2 in multisignatureEditorInput field
    When I click on addNewMembers
    Then I enter the publicKey of multiSig_candidate at input 1
    Then I enter the publicKey of genesis at input 2
    Then I enter the publicKey of delegate at input 3
    Then I set 2 inputs as optional
    When I click on sendButton
    When I click on confirmBtn
    Then msignSendButton should not exist
    Then I should see downloadButton
    Then I should see copyButton

  Scenario: Sign transaction (Mandatory, Optional, Optional, 2 signatures)
    Given I login as genesis on devnet
    And I wait 1 seconds
    When I click on signMultiSignTransactionToggle
    Then I paste transaction firstTxSecondSign
    When I click on confirmBtn
    Then I confirm data of firstTxSecondSign
    When I click on signBtn
    Then msignSendButton should not exist
    Then I should see downloadButton
    Then I should see copyButton

  Scenario: Send transaction (Mandatory, Optional, Optional, 2 signatures)
    Given I login as delegate on devnet
    And I wait 1 seconds
    When I click on signMultiSignTransactionToggle
    Then I paste transaction firstTxThirdSign
    When I click on confirmBtn
    Then I confirm data of firstTxThirdSign
    When I click on signBtn
    Then I should see downloadButton
    Then I should see copyButton
    Then I should see msignSendButton
    And I click on msignSendButton
    And I click on closeDialog
    When I click on searchIcon
    And I search for account lsks6wh4zqfd8wyka3rj243rshcdqyug9gyvehxwz
    Then I click on searchAccountRow
    And I wait 10 seconds
    Then The latest transaction is Register multisig. group