Feature: Sign message
  Scenario: should allow to sign message
    Given I'm logged in as "any account"
    When I click "sign message" in main menu
    And I fill in "Hello world" to "message" field
    And I click "primary button"
    Then I should see in "result" field:
         """
         -----BEGIN LISK SIGNED MESSAGE-----
         -----MESSAGE-----
         Hello world
         -----PUBLIC KEY-----
         c094ebee7ec0c50ebee32918655e089f6e1a604b83bcaa760293c61e0f18ab6f
         -----SIGNATURE-----
         079331d868678fd5f272f09d6dc8792fb21335aec42af7f11caadbfbc17d4707e7d7f343854b0c619b647b81ba3f29b23edb4eaf382a47c534746bad4529560b48656c6c6f20776f726c64
         -----END LISK SIGNED MESSAGE-----
         """

  @integration
  Scenario: should allow to exit sign message dialog with "cancel button"
    Given I'm logged in as "any account"
    When I click "sign message" in main menu
    And I click "cancel button"
    Then I should see no "modal dialog"

  @integration
  Scenario: should allow to exit sign message dialog with "x button"
    Given I'm logged in as "any account"
    When I click "sign message" in main menu
    And I click "x button"
    Then I should see no "modal dialog"


