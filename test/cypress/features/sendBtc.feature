Feature: Send Btc

  Scenario: Enable and Transfer btc
    Given I login as genesis on testnet
    Given I am on wallet page
    And I change active token to BTC
    And I click on sendLink
    And I fill mkakDp2f31btaXdATtAogoqwXcdx1PqqFo in recipientInput field
    And I fill 0.00000001 in amountInput field
    And I go to transfer confirmation
    And I click on sendButton
    And I click on okayButton
    Then The latest transaction is transfer to mkakDp2f31btaXdATtAogoqwXcdx1PqqFo
