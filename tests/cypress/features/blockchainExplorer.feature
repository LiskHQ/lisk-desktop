Feature: BlockchainExplore
  Background:
  Given I visit blockchain applications link
  And I wait 1 seconds

  @basic
  Scenario: visit blockchain applications list
    Then blockchain applications should be accuratly rendered
    When I toggle pin button for chain id: ij239sksf5u4jdq8szo3pnsq
    Then chain with id: ij239sksf5u4jdq8szo3pnsq should be pinned
    When I toggle pin button for chain id: ij239sksf5u4jdq8szo3pnsq
    Then chain with id: ij239sksf5u4jdq8szo3pnsq should be unpinned

  @basic
  Scenario: visit blockchain application details
    Given I click on chainRow
    Then blockchain details should be accuratly displayed
    When I click on chainDetailsPinButton
    Then chain with id: ij239sksf5u4jdq8szo3pnsq should be pinned
    When I click on closeDialog
    Then blockchain details should not be displayed
