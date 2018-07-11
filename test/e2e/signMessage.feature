Feature: Sign message
  Scenario: should allow to send when using launch protocol
    Given I'm logged in as "genesis"
    When I go to "/sign-message?message=my message"
    Then I click "next"
    And I wait 2 seconds
    Then I should see in "result" field:
    """
    -----BEGIN LISK SIGNED MESSAGE-----
    -----MESSAGE-----
    my message
    -----PUBLIC KEY-----
    c094ebee7ec0c50ebee32918655e089f6e1a604b83bcaa760293c61e0f18ab6f
    -----SIGNATURE-----
    b4f4f29fb8bc3c540581137e522103e33e1ccac9ef5f652da53239adae3fbb990d6a25c935dd3ff5026b26095ded100cd8b45c9b2311ec2687957145f09aa50f
    -----END LISK SIGNED MESSAGE-----
    """
