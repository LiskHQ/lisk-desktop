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
        When I observe forger list
        And I wait 10.5 seconds
        And time timeValue should be incremented by at least 10 seconds
        Then blocksForged should be incremented by at least 1
        And forger list should be updated accordinly
        And forger list should have a maximum of 6 delegates
        

