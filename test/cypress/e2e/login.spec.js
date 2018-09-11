import accounts from '../../constants/accounts';

// This file is skipped cause it is not part of the existing selenium tests migration.
// It should be reenabled with the new tests structure
describe.skip('Login Page', () => {
  beforeEach(() => cy.visit('/'));

  it('Create lisk id -> Register account page', () => {
    cy.get('.new-account-button').click();
    cy.url().should('include', '/register');
    cy.get('.multistep-back');
  });

  // Enable after lisk core 1.0 release on mainnet
  xit('Logging in Mainnet by default ("Switch Network" is not set)', () => {
  });

  xit('Logging in Mainnet by default ("Switch Network" is false)', () => {
  });

  xit('Logging in Mainnet (Selected network)', () => {
  });

  it('Logging in Testnet', () => {
    cy.server();
    cy.route('GET', `https://testnet.lisk.io/api/accounts?address=${accounts.genesis.address}`).as('account');
    window.localStorage.setItem('settings', '{"showNetwork": true}');
    cy.reload();
    cy.get('.network').click();
    cy.get('ul li').eq(2).click();
    cy.get('.passphrase input').click();
    cy.get('.passphrase input').each(($el, index) => {
      const passphraseWordsArray = accounts.genesis.passphrase.split(' ');
      cy.wrap($el).type(passphraseWordsArray[index]);
    });
    cy.get('.login-button').click();
    cy.wait('@account').its('responseBody.data.0.address').should('be.equal', accounts.genesis.address);
    cy.url().should('include', '/dashboard');
    cy.contains('testnet');
    cy.contains('https://testnet.lisk.io');
    cy.wait(1000).then(() => {
      // const account = JSON.parse(window.localStorage.getItem('accounts'))[0];
      // expect(account.network).to.eq(1);
      // expect(account.publicKey).to.eq(accounts.genesis.publicKey);
    });
  });

  it('Logging in Devnet', () => {
    cy.server();
    cy.route('GET', `${Cypress.env('coreUrl')}/api/accounts?address=${accounts.genesis.address}`).as('account');
    window.localStorage.setItem('settings', '{"showNetwork": true}');
    cy.reload();
    cy.get('.network').click();
    cy.get('ul li').eq(3).click();
    cy.get('.address input').type(Cypress.env('coreUrl'));
    cy.get('.passphrase input').click();
    cy.get('.passphrase input').each(($el, index) => {
      const passphraseWordsArray = accounts.genesis.passphrase.split(' ');
      cy.wrap($el).type(passphraseWordsArray[index]);
    });
    cy.get('.login-button').click();
    cy.wait('@account');
    cy.url().should('include', '/dashboard');
    cy.contains('devnet');
    cy.contains(Cypress.env('coreUrl'));
    cy.wait(1000).then(() => {
      // const account = JSON.parse(window.localStorage.getItem('accounts'))[0];
      // expect(account.network).to.eq(2);
      // expect(account.publicKey).to.eq(accounts.genesis.publicKey);
      // expect(account.peerAddress).to.eq(Cypress.env('CORE_URL'));
      // expect(JSON.parse(window.localStorage.getItem('accounts'))[0].balance)
      // .to.eq(accounts.genesis.balance);
    });
  });

  it('Network switcher available with ?showNetwork=true', () => {
    cy.visit('?showNetwork=true');
    cy.get('.network').should('be.visible');
  });
});
