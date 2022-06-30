Feature: BlockchainExplore

  @basic
  Scenario: visit blockchain application details
    Given I visit blockchain application details link
    Then blockchain details should be accuratly displayed
    Given I click on closeDialog
    Then blockchain details should not be displayed
