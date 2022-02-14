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

Then(/^I paste a transaction$/, function () {
  // const tx = `{"moduleID":4,"assetID":0,"senderPublicKey":"0fe9a3f1a21b5530f27f87a414b549e79a940bf24fdf2b2f05e7f22aeeecc86a","nonce":"132n","fee":"415000n","signatures":["530ef950c8f453b66d9a1f9fe96c6d899d7449dcdd600867c9d04ab6fcab17880812f2a18db99bf25bdde10f7e2c4284ce57100498025015a2e4fb2bb5d5ec09","530ef950c8f453b66d9a1f9fe96c6d899d7449dcdd600867c9d04ab6fcab17880812f2a18db99bf25bdde10f7e2c4284ce57100498025015a2e4fb2bb5d5ec09","",""],"asset":{"numberOfSignatures":2,"mandatoryKeys":["0fe9a3f1a21b5530f27f87a414b549e79a940bf24fdf2b2f05e7f22aeeecc86a"],"optionalKeys":["86499879448d1b0215d59cbf078836e3d7d9d2782d56a2274a568761bff36f19","a04a60f5f3f9be3a15b121342ba81b7bd66d37e7f3e8cc4f7c03396bd9c1f103"]},"id":"3ac5c3faa0a2e45a877c2b707c94ba1e14bc6ec2f53b23e805fe10706472584b"}`;
  // cy.get(ss.txSignInput).invoke('val', tx).trigger('change');
});

Then(/^I confirm data of ([^\s]+)$/, function (signTx) {
  let template = {};
  switch (signTx) {
    case 'firstTxSecondSign':
      template.txSenderAddress = 'lskdxc4ta5j43jp9ro3f8zqbxta9fn6jwzjucw7yt';
      template.txRequiredSignatures = '2';
      template.memberTitle = {
        0: 'lskehj...o9cjy(Optional)',
        1: 'lsks6w...ehxwz(Optional)',
        2: 'lskdxc...cw7yt(Mandatory)',
        3: 'lskdxc...cw7yt(Mandatory)',
        4: 'lskehj...o9cjy(Optional)',
        5: 'lsks6w...ehxwz(Optional)',
      };
      template.txFee = '0.00415 LSK';
      template.txRemainingMembers = ' 2/3';
      break;
    case 'firstTxThirdSign':
      template.txSenderAddress = 'lskdxc4ta5j43jp9ro3f8zqbxta9fn6jwzjucw7yt';
      template.txRequiredSignatures = '2';
      template.memberTitle = {
        0: 'lskehj...o9cjy(Optional)',
        1: 'lsks6w...ehxwz(Optional)',
        2: 'lskdxc...cw7yt(Mandatory)',
        3: 'lskdxc...cw7yt(Mandatory)',
        4: 'lsks6w...ehxwz(Optional)',
        5: 'lskehj...o9cjy(Optional)',
      };
      template.txFee = '0.00415 LSK';
      template.txRemainingMembers = ' 1/3';
      break;
    default:
      break;
  }
 cy.get(ss.txHeader).eq(0).should('have.text', 'Register multisignature group');
 cy.get(ss.txSenderAddress).eq(0).should('have.text', template.txSenderAddress);
 cy.get(ss.txRequiredSignatures).eq(0).should('have.text', template.txRequiredSignatures);
 cy.get(ss.memberTitle).eq(0).should('have.text', template.memberTitle['0']);
 cy.get(ss.memberTitle).eq(1).should('have.text', template.memberTitle['1']);
 cy.get(ss.memberTitle).eq(2).should('have.text', template.memberTitle['2']);
 cy.get(ss.txFee).eq(0).should('have.text', template.txFee);
 cy.get(ss.memberTitle).eq(3).should('have.text', template.memberTitle['3']);
 cy.get(ss.txRemainingMembers).eq(0).should('have.text', template.txRemainingMembers);
 cy.get(ss.memberTitle).eq(4).should('have.text', template.memberTitle['4']);
 cy.get(ss.memberTitle).eq(5).should('have.text', template.memberTitle['5']);
});

Then(/^I read a transaction from json$/, function () {
  // TODO
});
