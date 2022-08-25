Feature: Network

  Background:
    Given Network switcher is enabled
    And Network is set to testnet
    Given I am on network page
    And I wait 1 seconds

  @basic
  Scenario: I should see initally loaded peers sorted by height in descending order
    Then I should have 20 peers rendered in table
    And peers should be sorted in descending order by height

  @basic
  Scenario: I should be able to load more peers sorted by height in descending order
    And I click on showMorePeersBtn
    And I wait 1 seconds
    Then I should have 30 peers rendered in table
    And peers should be sorted in descending order by height

  @basic
  Scenario: I should see peers sorted in ascending order by height
    When I click on showMorePeersBtn
    And I wait 1 seconds
    And I sort by height
    Then peers should be sorted in ascending order by height

  # @advanced
  @basic
  Scenario: I should see peers sorted in ascending order by networkVersion
    When I click on showMorePeersBtn
    And I wait 1 seconds
    And I sort by networkVersion
    Then peers should be sorted in ascending order by networkVersion
