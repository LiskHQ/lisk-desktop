Feature: delegate
    Background:
        Given Network switcher is disabled
        Given I am on delegates page

   Scenario: Delegates overview
        Then totalBlocks count should have value greater than 4807
