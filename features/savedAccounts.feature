Feature: Saved Accounts 
  Scenario: should allow to save account locally, after page reload it should require passphrase to do the first transaction, and remember the passphrase for next transactions
    Given I'm logged in as "genesis"
    When I click "saved accounts" in main menu
    And I click "add active account button"
    And I click "x button"
    And I wait 1 seconds
    And I should see text "Account saved" in "toast" element
    And I refresh the page
    And I wait 2 seconds
    Then I should be logged in
    And I click "send button"
    And I should see empty "passphrase" field
    And I fill in "1" to "amount" field
    And I fill in "537318935439898807L" to "recipient" field
    And I fill in passphrase of "genesis" to "passphrase" field
    And I click "submit button"
    And I click "ok button"
    And I wait 1 seconds
    And I click "send button"
    And I fill in "2" to "amount" field
    And I fill in "537318935439898807L" to "recipient" field
    And I click "submit button"
    And I should see alert dialog with title "Success" and text "Your transaction of 2 LSK to 537318935439898807L was accepted and will be processed in a few seconds."

  Scenario: should allow to save second account
    Given I'm logged in as "genesis"
    When I click "saved accounts" in main menu
    And I click "add active account button"
    And I click "x button"
    And I wait 1 seconds
    And I click "logout button"
    And I'm logged in as "empty account"
    And I click "saved accounts" in main menu
    And I click "add active account button"
    Then I should see "saved accounts table" table with 2 lines
    And I refresh the page
    And I wait 2 seconds
    And I should be logged in as "empty account" account

  Scenario: should allow to forget second account
    Given I'm logged in as "genesis"
    When I click "saved accounts" in main menu
    And I click "add active account button"
    And I click "x button"
    And I wait 1 seconds
    And I click "logout button"
    And I'm logged in as "delegate"
    And I click "saved accounts" in main menu
    And I click "add active account button"
    And I should see "saved accounts table" table with 2 lines
    And I click "forget button"
    Then I should see "saved accounts table" table with 1 lines

  Scenario: should allow to switch account
    Given I'm logged in as "genesis"
    When I click "saved accounts" in main menu
    And I click "add active account button"
    And I click "x button"
    And I wait 1 seconds
    And I click "logout button"
    And I'm logged in as "delegate"
    And I click "saved accounts" in main menu
    And I click "add active account button"
    And I click "switch button"
    And I wait 1 seconds
    And I should be logged in as "genesis" account

  Scenario: should login to last active saved account
    Given I'm logged in as "genesis"
    When I click "saved accounts" in main menu
    And I click "add active account button"
    And I click "x button"
    And I wait 1 seconds
    And I click "logout button"
    And I'm logged in as "empty account"
    And I click "saved accounts" in main menu
    And I click "add active account button"
    And I click "x button"
    And I refresh the page
    And I should be logged in as "empty account" account
