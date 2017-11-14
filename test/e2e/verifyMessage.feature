Feature: Verify message
  Scenario: should allow to verify message
    Given I'm logged in as "any account"
    When I click "verify message" in main menu
    And  I fill in "c094ebee7ec0c50ebee32918655e089f6e1a604b83bcaa760293c61e0f18ab6f" to "public key" field
    And  I fill in "079331d868678fd5f272f09d6dc8792fb21335aec42af7f11caadbfbc17d4707e7d7f343854b0c619b647b81ba3f29b23edb4eaf382a47c534746bad4529560b48656c6c6f20776f726c64" to "signature" field
    Then I should see "Hello world" in "result" field

  @integration
  Scenario: should allow to exit verify message dialog
    Given I'm logged in as "any account"
    When I click "verify message" in main menu
    And I click "x button"
    Then I should see no "modal dialog"

