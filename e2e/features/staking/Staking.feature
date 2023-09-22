Feature: Staking
  Background: Add an account and navigate to validators
    Given I add an account with passphrase "attract squeeze option inflict dynamic end evoke love proof among random blanket table pumpkin general impose access toast undo extend fun employ agree dash" password "Password@1" name "genesis_0"
    And I go to page "validators"
    And I wait for "1 seconds"

  Scenario: Validators should be displayed on the page
    Then I should see 103 validators in table

  Scenario: Validators can be randomly selected
    Given I click on an element with testId "genesis_11"
    And I wait for "1 seconds"
    Then I should see "genesis_11" validator details
    Given I go back to the previous page
    And I click on an element with testId "genesis_25"
    And I wait for "1 seconds"
    Then I should see "genesis_25" validator details
    Given I go back to the previous page
    Given I click on an element with testId "genesis_67"
    And I wait for "1 seconds"
    Then I should see "genesis_67" validator details