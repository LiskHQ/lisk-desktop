Feature: Multisignature transaction

  # @basic
  # Scenario: Add funds to wallet2P
  #   Given I login as genesis on customNode
  #   Given  I wait 1 seconds
  #   Given I am on Wallet page
  #   Then I click on sendLink
  #   When I paste lskwunwxqmss9w3mtuvzgbsfy665cz4eo3rd2mxdp in recipientInput field
  #   And I fill 10 in amountInput field
  #   And I go to transfer confirmation
  #   And I click on sendButton
  #   And I click on closeDialog

  # @todo: disabled until account management is updated
  # @basic
  # Scenario: Register multisignature group (Mandatory, Mandatory)
  #   Given I login as wallet2P on customNode
  #   And I wait 10 seconds
  #   Given I am on wallet page
  #   When I click on walletInfoMsign
  #   When I clear input multisignatureEditorInput
  #   And I fill 2 in multisignatureEditorInput field
  #   Then I enter the publicKey of wallet2P at input 1
  #   Then I enter the publicKey of validator at input 2
  #   When I click on txNextBtn
  #   When I click on confirmButton
  #   Then msignSendButton should not exist
  #   Then I should see downloadButton
  #   And I click on downloadButton
  #   Then RegisterSecondPassphraseTx should have been downloaded correctly
  #   Then I should see copyButton
  #   And I click on copyButton
  #   Then I should have the transaction RegisterSecondPassphraseTx in the clipboard

  # @basic
  # Scenario: Sign transaction and send transaction (Mandatory, Mandatory)
  #   Given I login as validator on customNode
  #   And I wait 1 seconds
  #   When I click on signMultiSignTransactionToggle
  #   Then I paste transaction RegisterSecondPassphraseTx
  #   When I click on confirmBtn
  #   Then I confirm data of RegisterSecondPassphraseTx
  #   When I click on signBtn
  #   Then I should see downloadButton
  #   Then I should see copyButton
  #   Then I should see msignSendButton
  #   And I click on msignSendButton
  #   And I wait 5 seconds
  #   And I click on closeDialog
  #   When I click on searchIcon
  #   And I search for account lskwunwxqmss9w3mtuvzgbsfy665cz4eo3rd2mxdp
  #   Then I click on searchAccountRow
  #   And I should be on Account page of lskwun...2mxdp
  #   And I wait 5 seconds
  #   And The latest transaction is register multisignature group

  # @basic
  # Scenario: Send transaction using second passphrase (Mandatory, Mandatory)
  #   Given I login as wallet2P on customNode
  #   And I wait 1 seconds
  #   Given I am on wallet page
  #   Then I click on sendLink
  #   When I paste lsks6wh4zqfd8wyka3rj243rshcdqyug9gyvehxwz in recipientInput field
  #   And I fill 1 in amountInput field
  #   And I go to transfer confirmation
  #   Given I scroll from summary to bottom
  #   When I click on useSecondPassphraseBtn
  #   Then I input second passphrase
  #   And I click on sendButton
  #   Then I should see downloadButton
  #   Then I should see copyButton
  #   Then I should see msignSendButton
  #   And I click on msignSendButton
  #   Then submittedTransactionMessage should be visible
  #   And I click on closeDialog
  #   Then I wait 5 seconds
  #   Then The latest transaction is transfer lsks6w...ehxwz

  # # @advanced
  #   @basic
  # Scenario: Register multisignature group (Mandatory, Optional, Optional, 2 signatures)
  #   Given I login as multiSig_candidate on customNode
  #   And I wait 1 seconds
  #   Given I am on wallet page
  #   When I click on walletInfoMsign
  #   When I clear input multisignatureEditorInput
  #   And I fill 2 in multisignatureEditorInput field
  #   When I click on addNewMembers
  #   Then I enter the publicKey of multiSig_candidate at input 1
  #   Then I enter the publicKey of genesis at input 2
  #   Then I enter the publicKey of validator at input 3
  #   Then I set 2 inputs as optional
  #   When I click on txNextBtn
  #   When I click on confirmButton
  #   Then msignSendButton should not exist
  #   Then I should see downloadButton
  #   Then I should see copyButton
  #   And I click on copyButton
  #   Then I should have the transaction RegisterMultiSignGroupTx_second_sign in the clipboard

  # # @advanced
  #   @basic
  # Scenario: Sign transaction (Mandatory, Optional, Optional, 2 signatures)
  #   Given I login as genesis on customNode
  #   And I wait 1 seconds
  #   When I click on signMultiSignTransactionToggle
  #   Then I paste transaction RegisterMultiSignGroupTx_second_sign
  #   When I click on confirmBtn
  #   Then I confirm data of RegisterMultiSignGroupTx_second_sign
  #   When I click on signBtn
  #   Then msignSendButton should not exist
  #   Then I should see downloadButton
  #   Then I should see copyButton
  #   And I click on copyButton
  #   Then I should have the transaction RegisterMultiSignGroupTx_third_sign in the clipboard

  # # @advanced
  #   @basic
  # Scenario: Send transaction (Mandatory, Optional, Optional, 2 signatures)
  #   Given I login as validator on customNode
  #   And I wait 1 seconds
  #   When I click on signMultiSignTransactionToggle
  #   Then I paste transaction RegisterMultiSignGroupTx_third_sign
  #   When I click on confirmBtn
  #   Then I confirm data of RegisterMultiSignGroupTx_third_sign
  #   When I click on signBtn
  #   Then I should see downloadButton
  #   Then I should see copyButton
  #   Then I should see msignSendButton
  #   And I click on msignSendButton
  #   And I click on closeDialog
  #   And I wait 12 seconds
  #   Given I am on transactions page
  #   Then The latest transaction in monitor is sent by lsks6w...ehxwz and recipient is Register multisignature group
