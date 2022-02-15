/* eslint-disable */
import { Then } from 'cypress-cucumber-preprocessor/steps';
import { accounts, ss } from '../../../constants';

Then(/^I enter the publicKey of ([^\s]+) at input ([\w]+)$/, function (accountName, index) {
  cy.get(ss.msignPkInput).eq(index - 1).type(accounts[accountName].summary.publicKey);
});

Then(/^I set ([\w]+) inputs as optional$/, function (numOfOptionals) {
  for (let index = 1; index <= numOfOptionals; index++) {
    cy.get(ss.mandatoryToggle).eq(index).click();
    cy.get(ss.selectOptional).eq(index).click();
    cy.get(ss.mandatoryToggle).eq(index).click();
  }
});

Then(/^I paste transaction ([^\s]+)$/, function (txToSign) {
  let tx = '{}';
  if (txToSign == 'firstTxSecondSign') {
    tx = '{"moduleID":4,"assetID":0,"senderPublicKey":"a04a60f5f3f9be3a15b121342ba81b7bd66d37e7f3e8cc4f7c03396bd9c1f103","nonce":"0n","fee":"414000n","signatures":["89c380e42226cbcdf8738390cdcd215521348e50f27e21767baa7f88d91d86fd87949d01b11f82afe865b025222f33d3c1c72a0b4f0122d9cc77513bbcc03b0d","89c380e42226cbcdf8738390cdcd215521348e50f27e21767baa7f88d91d86fd87949d01b11f82afe865b025222f33d3c1c72a0b4f0122d9cc77513bbcc03b0d","",""],"asset":{"numberOfSignatures":2,"mandatoryKeys":["a04a60f5f3f9be3a15b121342ba81b7bd66d37e7f3e8cc4f7c03396bd9c1f103"],"optionalKeys":["0fe9a3f1a21b5530f27f87a414b549e79a940bf24fdf2b2f05e7f22aeeecc86a","86499879448d1b0215d59cbf078836e3d7d9d2782d56a2274a568761bff36f19"]},"id":"9ae1254b9333e4a103dc2c49c596d7d55013d46e18043a95c1b9d1319d84c83c"}';
  } else if (txToSign == 'firstTxThirdSign') {
    tx = '{"moduleID":4,"assetID":0,"senderPublicKey":"a04a60f5f3f9be3a15b121342ba81b7bd66d37e7f3e8cc4f7c03396bd9c1f103","nonce":"0n","fee":"414000n","signatures":["89c380e42226cbcdf8738390cdcd215521348e50f27e21767baa7f88d91d86fd87949d01b11f82afe865b025222f33d3c1c72a0b4f0122d9cc77513bbcc03b0d","89c380e42226cbcdf8738390cdcd215521348e50f27e21767baa7f88d91d86fd87949d01b11f82afe865b025222f33d3c1c72a0b4f0122d9cc77513bbcc03b0d","336541438f0f81019c05af132600defea2f235525022e24a1b4184e71674233f7df7463ed739a4624dcd351b1e344707ea2a3953c003b7ecb1e5a632b58cae00",""],"asset":{"numberOfSignatures":2,"mandatoryKeys":["a04a60f5f3f9be3a15b121342ba81b7bd66d37e7f3e8cc4f7c03396bd9c1f103"],"optionalKeys":["0fe9a3f1a21b5530f27f87a414b549e79a940bf24fdf2b2f05e7f22aeeecc86a","86499879448d1b0215d59cbf078836e3d7d9d2782d56a2274a568761bff36f19"]},"id":"f0ea4fb53ba647715fc5a11a36bbbe6edb8026e7b476b5b287e3a4452bef3289"}';
  } else {
    tx = '{"moduleID":4,"assetID":0,"senderPublicKey":"0fe9a3f1a21b5530f27f87a414b549e79a940bf24fdf2b2f05e7f22aeeecc86a","nonce":"144n","fee":"315000n","signatures":["7638e53baaaae45034c6fbff6a85883fb937604c25bdfbdfaedd7b053063adbb48939556eb130e58982fd106cb60de56978c669b19840ddfb0eba1d9ee950201","7638e53baaaae45034c6fbff6a85883fb937604c25bdfbdfaedd7b053063adbb48939556eb130e58982fd106cb60de56978c669b19840ddfb0eba1d9ee950201",""],"asset":{"numberOfSignatures":2,"mandatoryKeys":["0fe9a3f1a21b5530f27f87a414b549e79a940bf24fdf2b2f05e7f22aeeecc86a","86499879448d1b0215d59cbf078836e3d7d9d2782d56a2274a568761bff36f19"],"optionalKeys":[]},"id":"41218da5ebf4f8151656a7dd4ca219329af9e50c40fe2193d86ea9668cbf7d4c"}';    
  }

  cy.get(ss.txSignInput).paste({ pastePayload: tx });
});

Then(/^I confirm data of ([^\s]+)$/, function (tx) {
  let template = {};
  switch (tx) {
    case 'firstTxSecondSign':
      template.txSenderAddress = 'lsks6wh4zqfd8wyka3rj243rshcdqyug9gyvehxwz';
      template.txRequiredSignatures = '2';
      template.memberTitle = [
        'lskehj...o9cjy(Optional)',
        'lsks6w...ehxwz(Mandatory)',
        'lskdxc...cw7yt(Optional)',
        'lskdxc...cw7yt(Optional)',
        'lskehj...o9cjy(Optional)',
        'lsks6w...ehxwz(Mandatory)',
      ];
      template.txFee = '0.00414 LSK';
      template.txRemainingMembers = ' 2/3';
      break;
    case 'firstTxThirdSign':
      template.txSenderAddress = 'lsks6wh4zqfd8wyka3rj243rshcdqyug9gyvehxwz';
      template.txRequiredSignatures = '2';
      template.memberTitle = [
        'lskdxc...cw7yt(Optional)',        
        'lskehj...o9cjy(Optional)',
        'lsks6w...ehxwz(Mandatory)',
        'lsks6w...ehxwz(Mandatory)',
        'lskdxc...cw7yt(Optional)',
        'lskehj...o9cjy(Optional)',
      ];
      template.txFee = '0.00414 LSK';
      template.txRemainingMembers = ' 1/3';
      break;
    case 'SecondTxSecondSign':
      template.txSenderAddress = 'lskdxc4ta5j43jp9ro3f8zqbxta9fn6jwzjucw7yt';
      template.txRequiredSignatures = '2';
      template.memberTitle = [
        'lskdxc...cw7yt(Mandatory)',
        'lskehj...o9cjy(Mandatory)',
        'lskdxc...cw7yt(Mandatory)',
        'lskehj...o9cjy(Mandatory)',
      ];
      template.txFee = '0.00315 LSK';
      template.txRemainingMembers = ' 1/2';
      break;
    default:
      break;
  }
  cy.get(ss.txHeader).eq(0).should('have.text', 'Register multisignature group');
  cy.get(ss.txSenderAddress).eq(0).should('have.text', template.txSenderAddress);
  cy.get(ss.txRequiredSignatures).eq(0).should('have.text', template.txRequiredSignatures);
  cy.get(ss.txFee).eq(0).should('have.text', template.txFee);
  cy.get(ss.txRemainingMembers).eq(0).should('have.text', template.txRemainingMembers);
  template.memberTitle.forEach((el, index) => {
    cy.get(ss.memberTitle).eq(index).should('have.text', el);
  })
});

Then(/^I input second passphrase$/, function () {
  cy.get(ss.passphraseInput).first().click();
  cy.get(ss.passphraseInput).each(($el, index) => {
    const passphraseWordsArray = accounts.delegate.passphrase.split(' ');
    cy.wrap($el, { log: false }).type(passphraseWordsArray[index], { log: false });
  });
});

Then(/^I read a transaction from json$/, function () {
  // TODO
});
