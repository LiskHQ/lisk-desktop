Feature: Onboarding
  Scenario: should not start onboarding when not logged in
    Given I go to "/"
    And I wait 1 seconds
    Then I should see no "joyride-tooltip__header"

  Scenario: should start onboarding automatically
    Given I'm logged in as "genesis"
    And I wait 0.4 seconds
    Then I should see text "Welcome to Lisk Hub" in "joyride-tooltip__header" element

    And I click "joyride-tooltip__button--primary"
    And I wait 0.4 seconds
    Then I should see text "Lisk ID" in "joyride-tooltip__header" element

    And I click "joyride-tooltip__button--primary"
    And I wait 0.4 seconds
    Then I should see text "Keep the overview" in "joyride-tooltip__header" element

    And I click "joyride-tooltip__button--primary"
    And I wait 0.4 seconds
    Then I should see text "Send LSK" in "joyride-tooltip__header" element

    And I click "joyride-tooltip__button--primary"
    And I wait 0.4 seconds
    Then I should see text "Explore the network" in "joyride-tooltip__header" element

    And I click "joyride-tooltip__button--primary"
    And I wait 0.4 seconds
    Then I should see text "Manage your application" in "joyride-tooltip__header" element

    And I click "joyride-tooltip__button--primary"
    And I wait 0.4 seconds
    Then I should see text "Access extra features" in "joyride-tooltip__header" element

    And I click "joyride-tooltip__button--primary"
    And I wait 0.4 seconds
    Then I should see text "You’ve completed the tour!" in "joyride-tooltip__header" element

    And I click "joyride-tooltip__button--primary"
    Then I should see no "joyride-tooltip__header"

    When I click "more menu"
    And I click 1 item in setting carousel
    And I wait 0.4 seconds
    And I click "advancedMode"
    And I click 3 item in setting carousel
    And I wait 0.4 seconds
    And I click "onboarding-setting"
    Then I should see text "Welcome to Lisk Hub" in "joyride-tooltip__header" element

    And I click "joyride-tooltip__button--primary"
    And I wait 0.4 seconds
    Then I should see text "Lisk ID" in "joyride-tooltip__header" element

    And I click "joyride-tooltip__button--primary"
    And I wait 0.4 seconds
    Then I should see text "Keep the overview" in "joyride-tooltip__header" element

    And I click "joyride-tooltip__button--primary"
    And I wait 0.4 seconds
    Then I should see text "Send LSK" in "joyride-tooltip__header" element

    And I click "joyride-tooltip__button--primary"
    And I wait 0.4 seconds
    Then I should see text "Explore the network" in "joyride-tooltip__header" element

    And I click "joyride-tooltip__button--primary"
    And I wait 0.4 seconds
    Then I should see text "Delegate voting" in "joyride-tooltip__header" element

    And I click "joyride-tooltip__button--primary"
    And I wait 0.4 seconds
    Then I should see text "Manage your application" in "joyride-tooltip__header" element

    And I click "joyride-tooltip__button--primary"
    And I wait 0.4 seconds
    Then I should see text "Access extra features" in "joyride-tooltip__header" element

    And I click "joyride-tooltip__button--primary"
    And I wait 0.4 seconds
    Then I should see text "You’ve completed the tour!" in "joyride-tooltip__header" element

    And I click "joyride-tooltip__button--primary"
    Then I should see no "joyride-tooltip__header"

    When I refresh the page
    And I wait 1 seconds
    Then I should see no "joyride-tooltip__header"

    When I click "more menu"
    And I click 3 item in setting carousel
    And I wait 0.4 seconds
    And I click "onboarding-setting"
    And I wait 0.4 seconds
    Then I should see text "Welcome to Lisk Hub" in "joyride-tooltip__header" element

    And I click "joyride-tooltip__button--primary"
    And I wait 0.4 seconds
    Then I should see text "Lisk ID" in "joyride-tooltip__header" element

    And I click "joyride-tooltip__button--skip"
    And I wait 0.4 seconds
    Then I should see text "Onboarding whenever you need" in "joyride-tooltip__header" element

    And I click "joyride-tooltip__button--skip"
    Then I should see no "joyride-tooltip__header"




