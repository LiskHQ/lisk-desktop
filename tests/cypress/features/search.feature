Feature: Search

  # @basic
  # Scenario: Search for Transaction while signed out
  #   Given Network is set to customNode
  #   Given I am on login page
  #   When I click on searchIcon
  #   And I search for transaction 28fcc24bdbdf25e4ae6350fdac6af5c08f5a13bece10a34f27478f07569ecef0
  #   Then I click on searchTransactionRow
  #   Then I should be on Tx Details page of 28fcc2...ecef0

  # @basic
  # Scenario: Search for Lisk ID
  #   Given Network is set to customNode
  #   Given I login as genesis on customNode
  #   Given I am on Dashboard page
  #   When I click on searchIcon
  #   And I search for account lsk2df24om24b44hrw473ut66kv5yywk9yohwg4k7
  #   Then I click on searchAccountRow
  #   Then I should be on Account page of irvowcxlclonwcfvcpwp

  # @basic
  # Scenario: Search for non-existent account
  #   Given Network is set to customNode
  #   Given I login as genesis on customNode
  #   Then I wait 2 seconds
  #   When I click on searchIcon
  #   And I search for validator 43th3j4bt324
  #   And I wait 2 seconds
  #   Then I should see no results

