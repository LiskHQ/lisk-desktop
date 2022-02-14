Feature: Blocks

	Background:
		Given Network switcher is enabled
    And Network is set to devnet
    Given I am on blocks page
    And I wait 1 seconds

	Scenario: Load all blocks and load more blocks
		Then I should see 20 blocks in table
		When I click on showMoreBlocksBtn
		Then I should see 40 blocks in table

	Scenario: Sorting by height should work as expected
		When I click on showMoreBlocksBtn
		Then blocks should be sorted in descending order by height
		When I sort by height
		Then blocks should be sorted in ascending order by height