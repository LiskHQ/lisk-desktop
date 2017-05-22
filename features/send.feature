Feature: Send dialog
  Scenario: should allow to send when enough funds and correct address form
    Given I'm logged in as "genesis"
    When I click "send button"
    And I fill in "1" to "amount" field
    And I fill in "537318935439898807L" to "recipient" field
    And I click "submit button"
    Then I should see alert dialog with title "Success" and text "1 LSK was successfully transferred to 537318935439898807L"

  Scenario: should not allow to send when not enough funds
    Given I'm logged in as "empty account"
    When I click "send button"
    And I fill in "1" to "amount" field
    And I fill in "537318935439898807L" to "recipient" field
    Then I should see "Insufficient funds" error message

  Scenario: should not allow to send when invalid address
    Given I'm logged in as "any account"
    When I click "send button"
    And I fill in "1243409812409" to "recipient" field
    And I fill in "1" to "amount" field
    Then I should see "Invalid" error message
