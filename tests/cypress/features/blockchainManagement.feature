Feature: BlockchainManagement
  @basic
  Scenario: Remove blockchain application
    Given I visit the remove blockchain application page
    And I wait 1 seconds
    Then blockchain details should be accurately displayed

    #TODO: the below e2e test needs to be reinstated when #4359 is impelemnted 
    #  because presently we don't have a way to set current application

    # When I click on removeBlockchainButton
    # Then application removal success page should show
    # When I click on goToDashboardButton
    # And I wait 0.5 seconds
    # Then I should see the dashboard
