Feature: BlockchainManagement
  Background:
    Given I login as genesis on customNode
    And I wait 2 seconds
    When I click on managedAppDropdown
    And I wait 1 seconds

  @basic
  Scenario: Visit managed blockchain list
    Then I should be on manged application list page
    When I click on managedApplicationRow
    Then current application name should be: Lisk
  
  @basic
  Scenario: Remove blockchain application flow
    When I trigger remove application on chain: Kalipo
    Then remove blockchain details should be accurately displayed
    When I click on removeBlockchainButton
    Then application removal success page should show
    When I click on goToDashboardButton
    And I wait 0.5 seconds
    Then I should see the dashboard
