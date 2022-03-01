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
		And I wait 1 seconds
		Then blocks should be sorted in ascending order by height

	# Scenario: Retrieves and prepends new blocks
	# 	And I wait 30 seconds
	# 	Then I should see showLatestBlocksBtn
	# 	When I click on showLatestBlocksBtn
	# 	Then I should see latest blocks

	Scenario: Filter blocks based on existing inputs
		When I click on filterTransactionsBtn
    Then I should see filterDropdown
		When I fill 3271 in heightFilter field
		And I click on applyFilters
		Then I should see 1 blocks in table
		When I click on clearAllFiltersBtn
		Then I should see 20 blocks in table
		When I click on filterTransactionsBtn
    Then I should see filterDropdown
		When I fill 01.01.22 in dateFromInputFilter field
		When I fill 05.01.22 in dateToInputFilter field
		And I click on applyFilters
		Then I should see 20 blocks in table
		When I click on filterTransactionsBtn
    Then I should see filterDropdown
		When I fill genesis_82 in generatedByFilter field
		And I click on applyFilters
		Then I should see 1 blocks in table

	Scenario: Navigate to block details page and verify details
		When I click on filterTransactionsBtn
    Then I should see filterDropdown
		When I fill 414 in heightFilter field
		And I click on applyFilters
		Then I should see 1 blocks in table
		When I click on blockRow
		And I wait 1 seconds
		Then I should see the block details page
    Then I should see 408c63b500eac768140ef7a0dacd1638726c783c1cefa52a42189ef0fa46a1c1 in blockIdDetails section
    Then I should see 414 in blockHeightDetails section
    Then I should see 20 Aug 2021 in blockDateDetails section
    Then I should see genesis_99 in blockGeneratorDetails section
