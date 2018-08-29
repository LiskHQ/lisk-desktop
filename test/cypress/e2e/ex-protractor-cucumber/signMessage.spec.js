import accounts from '../../../constants/accounts';

describe('Sign message', () => {
  it('should allow to send when using launch protocol', () => {
    cy.loginUI(accounts.genesis, 'dev');
    cy.visit('sign-message?message=my message');
    cy.get('.next').click();
    cy.get('.result').should(
      'have.text',
      '-----BEGIN LISK SIGNED MESSAGE-----\n' +
      '-----MESSAGE-----\n' +
      'my message\n' +
      '-----PUBLIC KEY-----\n' +
      'c094ebee7ec0c50ebee32918655e089f6e1a604b83bcaa760293c61e0f18ab6f\n' +
      '-----SIGNATURE-----\n' +
      '469989531f65881ac1ac9579d1cda5738ce94764afebca3d57c3c749e3d37621254fccf3e145f785819e3150fc2b92097a8f65c1728e1ba8c6e005a452bdee03\n' +
      '-----END LISK SIGNED MESSAGE-----',
    );
  });
});
