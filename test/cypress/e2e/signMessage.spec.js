import accounts from '../../constants/accounts';
import networks from '../../constants/networks';
import urls from '../../constants/urls';

const ss = {
  messageInput: 'textarea',
  nextBtn: '.next',
  resulteBtn: '.result',
};

const messageToSign = 'my message';
const signedMessage =
  '-----BEGIN LISK SIGNED MESSAGE-----\n' +
  '-----MESSAGE-----\n' +
'my message\n' +
'-----PUBLIC KEY-----\n' +
'c094ebee7ec0c50ebee32918655e089f6e1a604b83bcaa760293c61e0f18ab6f\n' +
'-----SIGNATURE-----\n' +
'469989531f65881ac1ac9579d1cda5738ce94764afebca3d57c3c749e3d37621254fccf3e145f785819e3150fc2b92097a8f65c1728e1ba8c6e005a452bdee03\n' +
'-----END LISK SIGNED MESSAGE-----';

describe('Sign message', () => {
  it(`Opens by url ${urls.signMessage}`, () => {
    cy.autologin(accounts.genesis.passphrase, networks.devnet.node);
    cy.visit(urls.signMessage);
    cy.url().should('contain', urls.signMessage);
    cy.get('main').contains('Sign a message');
  });

  it('Generates signed message', () => {
    cy.autologin(accounts.genesis.passphrase, networks.devnet.node);
    cy.visit(urls.signMessage);
    cy.get(ss.messageInput).type(messageToSign);
    cy.get(ss.nextBtn).click();
    cy.get(ss.resulteBtn).should('have.text', signedMessage);
  });

  it('Message gets prefilled following launch protocol link', () => {
    cy.autologin(accounts.genesis.passphrase, networks.devnet.node);
    cy.visit(`${urls.signMessage}?message=${messageToSign}`);
    cy.get(ss.messageInput).contains(messageToSign);
  });
});
