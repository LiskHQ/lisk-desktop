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
    469989531f65881ac1ac9579d1cda5738ce94764afebca3d57c3c749e3d37621254fccf3e145f785819e3150fc2b92097a8f65c1728e1ba8c6e005a452bdee03
    -----END LISK SIGNED MESSAGE-----
    """
