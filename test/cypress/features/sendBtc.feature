Feature: Send Btc

  Scenario: Enable and Transfer btc
    Given I autologin as genesis to testnet
    Given I am on wallet page
    And I change active token to BTC
    And I click on send
    And I fill mkakDp2f31btaXdATtAogoqwXcdx1PqqFo in recipient
    And I fill 0.00000001 in amount
    And I go to transfer confirmation
    And I confirm transfer
    And I go back to wallet
    Then The latest transaction is transfer to mkakDp2f31btaXdATtAogoqwXcdx1PqqFo
