Feature: BlockchainManagement
  Background:
    Given I login as genesis on customNode
    And I wait 2 seconds
    When I click on managedAppDropdown
    And I wait 1 seconds

  @basic
  Scenario: Visit managed blockchain list
    Then I should be on managed application list page
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

  @basic
  Scenario: add blockchain application
    When I click on managedAppDropdown
    And I wait 1 seconds
    And I click on addApplicationLink
    Then I should be on add blockchain application modal
    When I click on addApplicationRow
    And I wait 1 seconds
    Then blockchain details should be accurately displayed
    Then blockchain details should be in add application mode
    When I click on addApplicationButton
    Then I should be on add blockchain application success modal
    When I click on addApplicationSuccessButton
    Then I should be on dashboard page
    Then application list should have Test App
