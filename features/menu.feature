Feature: Top right menu
  Scenario: should allow to set 2nd passphrase
    Given I'm logged in as "second passphrase candidate"
    When I click "register second passphrase" in main menu
    And I click "next button"
    And I 250 times move mouse randomly
    And I remember passphrase, click "yes its save button", fill in missing word
    And I click "ok button"
    Then I should see alert dialog with title "Success" and text "Second passphrase registration was successfully submitted. It can take several seconds before it is processed."

  Scenario: should allow to register a delegate
    Given I'm logged in as "delegate candidate"
    When I click "register as delegate" in main menu
    And I fill in "test" to "username" field
    And I click "register button"
    Then I should see alert dialog with title "Success" and text "Delegate registration was successfully submitted. It can take several seconds before it is processed."

  Scenario: should allow to sign message
    Given I'm logged in as "any account"
    When I click "sign message" in main menu
    And I fill in "Hello world" to "message" field
    And I click "sign button"
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

  Scenario: should allow to verify message
    Given I'm logged in as "any account"
    When I click "verify message" in main menu
    And  I fill in "c094ebee7ec0c50ebee32918655e089f6e1a604b83bcaa760293c61e0f18ab6f" to "public key" field
    And  I fill in "079331d868678fd5f272f09d6dc8792fb21335aec42af7f11caadbfbc17d4707e7d7f343854b0c619b647b81ba3f29b23edb4eaf382a47c534746bad4529560b48656c6c6f20776f726c64" to "signature" field
    Then I should see "Hello world" in "result" field
