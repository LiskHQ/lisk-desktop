Feature: Dashboard

  Scenario: Open last transaction
    Given I autologin as genesis to devnet
    Given I am on Dashboard page
    When I click on recent transaction
    Then I should be on Tx Details page

  Scenario: Open bookmark
    Given I autologin as genesis to devnet
    Given I have a bookmark saved
    Given I am on Dashboard page
    When I click on recent bookmark
    Then I should be on Account page
