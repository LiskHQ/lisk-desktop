Feature: Top right menu
  Scenario: should allow to set 2nd passphrase
    Given I'm logged in as "second passphrase candidate"
    When I click "register second passphrase" in main menu
    And I click "next button"
    And I 250 times move mouse randomly
    And I remember passphrase, click "next button", fill in missing word
    And I click "next button"
    Then I should see alert dialog with title "Success" and text "Second passphrase registration was successfully submitted. It can take several seconds before it is processed."

  Scenario: should not allow to set 2nd passphrase again
    Given I'm logged in as "second passphrase account"
    Then There is no "register second passphrase" in main menu

  Scenario: should not allow to set 2nd passphrase if not enough funds for the fee
    Given I'm logged in as "empty account"
    When I click "register second passphrase" in main menu
    Then I should see "Insufficient funds for 5 LSK fee" error message
    And "next button" should be disabled

  Scenario: should allow to exit 2nd passphrase registration dialog
    Given I'm logged in as "genesis"
    When I click "register second passphrase" in main menu
    And I click "cancel button"
    Then I should see no "modal dialog"

  Scenario: should allow to register a delegate
    Given I'm logged in as "delegate candidate"
    When I click "register as delegate" in main menu
    And I fill in "test" to "username" field
    And I click "register button"
    Then I should see alert dialog with title "Success" and text "Delegate registration was successfully submitted. It can take several seconds before it is processed."

  Scenario: should not allow to register a delegate again
    Given I'm logged in as "delegate"
    Then There is no "register as delegate" in main menu

  Scenario: should allow to register a delegate with second passphrase
    Given I'm logged in as "second passphrase account"
    When I click "register as delegate" in main menu
    And I fill in "test2" to "username" field
    And I fill in second passphrase of "second passphrase account" to "second passphrase" field
    And I click "register button"
    Then I should see alert dialog with title "Success" and text "Delegate registration was successfully submitted. It can take several seconds before it is processed."

  Scenario: should allow to exit delegate registration dialog
    Given I'm logged in as "genesis"
    When I click "register as delegate" in main menu
    And I click "cancel button"
    Then I should see no "modal dialog"

  Scenario: should not allow to register delegate if not enough funds for the fee
    Given I'm logged in as "empty account"
    When I click "register as delegate" in main menu
    Then I should see "Insufficient funds for 25 LSK fee" error message
    And "register button" should be disabled

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

  Scenario: should allow to exit sign message dialog with "cancel button"
    Given I'm logged in as "any account"
    When I click "sign message" in main menu
    And I click "cancel button"
    Then I should see no "modal dialog"

  Scenario: should allow to exit sign message dialog with "x button"
    Given I'm logged in as "any account"
    When I click "sign message" in main menu
    And I click "x button"
    Then I should see no "modal dialog"

  Scenario: should allow to verify message
    Given I'm logged in as "any account"
    When I click "verify message" in main menu
    And  I fill in "c094ebee7ec0c50ebee32918655e089f6e1a604b83bcaa760293c61e0f18ab6f" to "public key" field
    And  I fill in "079331d868678fd5f272f09d6dc8792fb21335aec42af7f11caadbfbc17d4707e7d7f343854b0c619b647b81ba3f29b23edb4eaf382a47c534746bad4529560b48656c6c6f20776f726c64" to "signature" field
    Then I should see "Hello world" in "result" field

  Scenario: should allow to exit verify message dialog
    Given I'm logged in as "any account"
    When I click "verify message" in main menu
    And I click "x button"
    Then I should see no "modal dialog"
