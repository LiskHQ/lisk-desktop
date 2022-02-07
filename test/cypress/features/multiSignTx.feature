Feature: Multisignature transaction

  Background:
    Given I login as multiSig_candidate on devnet
    And I wait 5 seconds
    
  Scenario: Register multisignature group (Mandatory, Optional, Optional, 2 signatures)
    Given I am on wallet page
    When I click on accountInfoMsign
    And I fill 2 in multisignatureEditorInput field
    When I click on addNewMembers
    Then I set 2 inputs as optional
    Then I enter the publicKey of multiSig_candidate at input 1
    Then I enter the publicKey of genesis at input 2
    Then I enter the publicKey of delegate at input 3
    When I click on sendButton
    When I click on confirmBtn
    Then I should be able to copy and download transaction

  Scenario: Sign transaction (1 Paste transaction, 2 load json, next 3 check data, 4 sign and download/copy)
    When I click on signMessageToggle

  Scenario: Send transaction
    When I click on signMessageToggle

  Scenario: Register multisignature group (Mandatory, Mandatory)
    Given I am on wallet page
    When I click on accountInfoMsign
    Then I enter the publicKey of genesis at input 1
    Then I enter the publicKey of delegate at input 2
    When I click on sendButton
  
  Scenario: Sign transaction and send transaction (Mandatory, Mandatory)
    When I click on signMessageToggle
  
  Scenario: Send transaction using second passphrase (Mandatory, Mandatory)
    When I click on signMessageToggle
