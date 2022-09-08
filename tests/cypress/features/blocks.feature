Feature: Blocks

  # TODO: tests would be enabled when service and core has been updated
  # Background:
  #   Given Network switcher is enabled
  #   And Network is set to customNode
  #   Given I am on blocks page
  #   And I wait 1 seconds

  # @basic
  # Scenario: Load all blocks and load more blocks
  #   Then I should see 20 blocks in table
  #   When I click on showMoreBlocksBtn
  #   And I wait 1 seconds
  #   Then I should see 30 blocks in table

  # @basic
  # Scenario: Sorting by height should work as expected
  #   When I click on showMoreBlocksBtn
  #   Then blocks should be sorted in descending order by height
  #   When I sort by height
  #   And I wait 1 seconds
  #   Then blocks should be sorted in ascending order by height

  # @basic
  # Scenario: Retrieves and prepends new blocks
  #   And I wait 30 seconds
  #   Then I should see showLatestBlocksBtn
  #   Then I should see the most current block
  #   When I click on showLatestBlocksBtn
  #   And I wait 1 seconds
  #   Then I should see latest blocks

  # @basic
  # Scenario: Filter blocks based on existing inputs
  #   When I click on filterTransactionsBtn
  #   Then I should see filterDropdown
  #   When I fill 3271 in heightFilter field
  #   And I click on applyFilters
  #   Then I should see 1 blocks in table
  #   When I click on clearAllFiltersBtn
  #   Then I should see 20 blocks in table
  #   When I click on filterTransactionsBtn
  #   Then I should see filterDropdown
  #   When I fill 04.01.22 in dateFromInputFilter field
  #   When I fill 05.01.22 in dateToInputFilter field
  #   And I click on applyFilters
  #   Then I should see 20 blocks in table
  #   When I click on filterTransactionsBtn
  #   Then I should see filterDropdown
  #   When I fill 508 in heightFilter field
  #   When I fill genesis_82 in generatedByFilter field
  #   And I click on applyFilters
  #   Then I should see 1 blocks in table

  # # @advanced
  # @basic
  # Scenario: Navigate to block details page and verify block details
  #   When I click on filterTransactionsBtn
  #   Then I should see filterDropdown
  #   When I fill 414 in heightFilter field
  #   And I click on applyFilters
  #   Then I should see 1 blocks in table
  #   When I click on blockRow
  #   And I wait 1 seconds
  #   Then I should see the block details page
  #   Then I should see 408c63b500eac768140ef7a0dacd1638726c783c1cefa52a42189ef0fa46a1c1 in blockIdDetails section
  #   Then I should see 414 in blockHeightDetails section
  #   Then I should see 20 Aug 2021 in blockDateDetails section
  #   Then I should see genesis_99 in blockGeneratorDetails section

  # # @advanced
  # @basic
  # Scenario: Navigate to block details page and verify transaction details
  #   When I click on filterTransactionsBtn
  #   Then I should see filterDropdown
  #   When I fill 414 in heightFilter field
  #   And I click on applyFilters
  #   Then I should see 1 blocks in table
  #   When I click on blockRow
  #   And I wait 1 seconds
  #   Then I should see the block details page
  #   Then I should see 1 transactions in table
  #   When I click on transactionRow
  #   Then I should be on transaction details modal on block details page
  #   Then I should see lskdxc4ta5j43jp9ro3f8zqbxta9fn6jwzjucw7yt in txSenderAddress field
  #   Then I should see lsk769d7rrnxtvme2egazc8uc8d77uzwnmgzqyp53 in txRecipientAddress field
  #   Then I should see 20 LSK in txAmount field
  #   Then I should see 6dc372dfcbfd2b1782d4d1964a35908f71e3878c69b5bbe28e5c69973671c8ee in txId field
  #   Then I should see 408c63b500eac768140ef7a0dacd1638726c783c1cefa52a42189ef0fa46a1c1 in blockIdDetails field
