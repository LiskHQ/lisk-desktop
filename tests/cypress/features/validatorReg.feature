Feature: Register validator
  # Background:
  #     Given I login as genesis on customNode
  #     And I wait 5 seconds

#   @advanced
  # @todo: disabled until account management is updated
  # @basic
  #  Scenario: Register validator + Header balance is affected
  #       Given I am on wallet page
  #       When I click on stakesTab
  #       And I click on becomeValidatorLink
  #       Then I see this title: Register validator
  #       When I fill test_validator in validatorNameInput field
  #       And I fill dcad7c69505d549803fb6a755e81cdcb0a33ea95b6476e2585149f8a42c9c882 in genKeyInput field
  #       And I fill 830ce8c4a0b4f40b9b2bd2f16e835676b003ae28ec367432af9bfaa4d5201051786643620eff288077c1e7a8415c0285 in blsKeyInput field
  #       And I fill 722b19e4b302e3e13ef097b417b651feadc8e28754530119911561c27b9478cdcd6b7ada331037bbda778b0b325aab5a79f34b31ea780acd01bf67d38268c43ea0ea75a5e757a76165253e1e20680c4cfd884ed63f5663c7b940e67162d5f715 in popInput field
  #       Then I wait 1.2 seconds
  #       When I click on txNextBtn
  #       And I click on confirmButton
  #       Then I wait 12 seconds
  #       Then I see this title: Validator registration succeeded
  #       Given I am on Wallet page
  #       Then The latest transaction is Register validator
