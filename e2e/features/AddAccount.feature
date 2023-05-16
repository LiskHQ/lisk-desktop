Feature: AddAccount

    Scenario:
        Given I navigate to page "wallet"
        Then I should exactly see "Welcome to Lisk"
        And I should exactly see "If you are new to Lisk ecosystem, create an account by clicking on the “Create account”. If you have an account, then add it to your wallet by clicking on “Add account”."
        Given I click on a button with exact text "Add account"
        Then  I should be redirected to route: "register"
        And I should exactly see "Add your account"
        And I should exactly see "Choose an option to add your account to Lisk wallet."
        And I should exactly see "Don’t have a Lisk account yet? Create one now"

# When I go to page: addAccount
# And I wait 1 seconds
