Feature: validator

  # @basic
  # Scenario: I should be on the validators page
  #   Given Network is set to customNode
  #   And I am on validators page
  #   And I wait 5 seconds

  # @basic
  # Scenario: Should properly display validators overview
  #   Then totalBlocks count should have value greater than 0
  #   And transactions count should have value greater than 0

  # @basic
  # Scenario: Should properly display generating details
  #   When I observe blocksGenerated
  #   And I observe timeValue-clock
  #   And I observe generator list
  #   And I wait 10 seconds
  #   Then time timeValue should be incremented by at least 5 seconds
  #   And blocksGenerated should be incremented by at least 1
  #   And next generator list should be updated accordingly
  #   And next generator list should have a maximum of 6 validators
  #   And next generators should match first members of the Generators list


  # @advanced
  # @basic
  # Scenario: Generators validators should function properly
  #   When I click on insideRoundBtn
  #   Then I should see 103 validators in table
  #   And first validator should be generating
  #   When I sort by generatingTime
  #   Then validators should be sorted in descending order by generatingTime
  #   When I fill genesis in filterValidatorInput field
  #   And I wait 2 seconds
  #   Then filtered results should be displayed
  #   When I watch a validator
  #   And I wait 0.5 seconds
  #   Then validator should be watched

  # @advanced
  # @basic
  # Scenario: Validators validators should function properly
  #   Given Network is set to customNode
  #   And I am on validators page
  #   And I wait 5 seconds
  #   When I click on outsideRoundBtn
  #   Then I should see 20 validators in table
  #   When I click on showMoreValidatorsBtn
  #   And I wait 1 seconds
  #   Then I should see 40 validators in table
  #   When I sort by status
  #   Then validators should be sorted in descending order by status
  #   Then validators should be sorted in ascending order by status
  #   When I fill test_validator in filterValidatorInput field
  #   And I wait 2 seconds
  #   Then filtered results should be displayed
  #   When I watch a validator
  #   And I wait 0.5 seconds
  #   Then validator should be watched

  # @advanced
  # @basic
  # Scenario: watch list should function properly
  #   When I clear input filterValidatorInput
  #   And I click on insideRoundBtn
  #   And I watch a validator
  #   And I click on watchedBtn
  #   Then I should see 2 validators in table
  #   When I don't watch a validator
  #   Then I should see 1 validators in table
  #   When I fill test in filterValidatorInput field
  #   And I wait 2 seconds
  #   Then filtered results should be displayed
  #   When I clear input filterValidatorInput
  #   And I fill not_valid in filterValidatorInput field
  #   Then I should see 0 validators in table

  # @advanced
  # @basic
  # Scenario: Sanctioned validators should function properly
  #   Given Network is set to testnet
  #   And I am on validators page
  #   And I wait 5 seconds
  #   When I click on sanctionedBtn
  #   Then I should see 10 validators in table
  #   When I click on showMoreValidatorsBtn
  #   And I wait 1 seconds
  #   Then I should see 20 validators in table
  #   When I fill genesis in filterValidatorInput field
  #   And I wait 2 seconds
  #   Then filtered results should be displayed
  #   When I watch a validator
  #   And I wait 0.5 seconds
  #   Then validator should be watched

  # # @advanced
  # @skip
  # Scenario: latest stakes list should function properly
  #   Given Network is set to customNode
  #   And I am on validators page
  #   And I wait 5 seconds
  #   When I click on latestStakesBtn
  #   Then I should see 10 stakes in table
  #   When I click on showMoreValidatorsBtn
  #   Then I should see 20 stakes in table
  #   When I click on transactionRow
  #   Then I should be on a stake transaction details modal

