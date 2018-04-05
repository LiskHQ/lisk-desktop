Feature: Register second passphrase
  Scenario: should allow to set 2nd passphrase
    Given I'm logged in as "second passphrase candidate"
    And I wait 0.1 seconds
    When I go to "second-passphrase/"
    And I wait 0.5 seconds
    And I click "next"
    And I wait 0.5 seconds
    And I 150 times move mouse randomly
    And I wait 0.5 seconds
    And I copy the second passphrase
    And I swipe "reveal checkbox" to right
    And I wait 0.5 seconds
    And I remember passphrase, click "yes its safe button", choose missing words
    And I wait 1 seconds
    And I swipe "confirm checkbox" to right
    And I wait 10 seconds
    And I click "get to your dashboard button"
    And I fill in "1" to "amount" field
    And I fill in "94495548317450502L" to "recipient" field
    And I click "send next button"
    And I wait 1 seconds
    When I fill in second passphrase to "second passphrase" field
    And I click "second passphrase next"
    When I click "send button"
    And I wait 1 seconds
    Then I should see text "Transaction is being processed and will be confirmed. It may take up to 15 minutes to be secured in the blockchain." in "result box message" element
    When I go to "second-passphrase/"
    Then I should be on url "/dashboard"

  # TODO: will be re-enabled when the functionality is implemented
  @pending
  Scenario: should ask for passphrase for saved account
    Given I'm logged in as "empty account"
    And I wait 1 seconds
    And I refresh the page
    And I wait 2 seconds
    When I go to "dashboard/register-second-passphrase"
    And I fill in passphrase of "empty account" to "passphrase" field
    And I click "authenticate button"
    Then I should see "Insufficient funds for 5 LSK fee" error message
    And "next button" should be disabled

  @integration
  @pending
  Scenario: should not allow to set 2nd passphrase if not enough funds for the fee
    Given I'm logged in as "empty account"
    When I go to "dashboard/register-second-passphrase"
    Then I should see "Insufficient funds for 5 LSK fee" error message
    And "next button" should be disabled

