Feature: Verify Message

  Scenario: Verify the integrity of a signed message
    Given I login as genesis on devnet
    And I wait 2 seconds
    And I open verifyMessage modal
    When I paste "-----BEGIN LISK SIGNED MESSAGE-----\n-----MESSAGE-----\nHello, this is a test\n-----PUBLIC KEY-----\n167221bdf0af9f83fd9f0cda0aff264a836f4b85a0cf7ee5f6bec6029bb6d517\n-----SIGNATURE-----\nd03a83796ab1b108b0eb2f900214da931e9589211bebe6648d3f4cbfd964d183053891eb13b77fd573dcb407f2a57becba1e131f3351736d4336c6ac26e95703\n-----END LISK SIGNED MESSAGE-----" in verifyMessageInput field
    And I click on continueBtn
    And  I wait 2 seconds
    Then I see this title: The signature is correct

  Scenario: Verify the integrity of a tampered message
    Given I login as genesis on devnet
    And I wait 2 seconds
    And I open verifyMessage modal
    When I paste "-----BEGIN LISK SIGNED MESSAGE----- -----MESSAGE----- tampered test -----PUBLIC KEY----- fd061b9146691f3c56504be051175d5b76d1b1d0179c5c4370e18534c5882122 -----SIGNATURE----- 9510ec44703c2da70a2a54e1699c06eab2e4caff0b299ca96f69e5f79b8ee913bd5e37e1b20d104bd57c4b316200dfbd2df7716c4c4582d4c52db8aabcb87603 -----END LISK SIGNED MESSAGE-----" in verifyMessageInput field
    And I click on continueBtn
    And I wait 2 seconds
    Then I see this title: The signature is incorrect
