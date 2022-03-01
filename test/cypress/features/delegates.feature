Feature: delegate
    Background:
        Given Network is set to devnet
        Given I am on delegates page
        And I wait 5 seconds

   Scenario: Should properly display delegates overview
        Then totalBlocks count should have value greater than 0
        Then transactions count should have value greater than 0

   Scenario: Should properly display forging details
        When I observe blocksForged
        And I observe timeValue-clock
        And I wait 10 seconds
        Then blocksForged should be incremented by at least 1
        And time timeValue should be incremented by at least 10 seconds
        

