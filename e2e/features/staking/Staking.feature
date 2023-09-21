Feature: Staking
  Background: Add an account and navigate to validators
    Given I add an account with passphrase "attract squeeze option inflict dynamic end evoke love proof among random blanket table pumpkin general impose access toast undo extend fun employ agree dash" password "Password@1" name 'genesis_0'
    And I go to page "validators"
    And I wait for "1 seconds"

  Scenario: Validators should be displayed on the page
    Then I should see 103 validators in table

  Scenario: Validators can be randomly selected
    When I select "genesis_10" validator in table
    And I wait for "1 seconds"
    Then I should see "genesis_10"
    Then I should see "Details"
    Then I should see "Performance"
    Then I should see "Last generated at"
    Then I should see "Blocks generated"