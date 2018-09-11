import accounts from '../../../constants/accounts';

describe('Register second passphrase', () => {
  it('should allow to set 2nd passphrase and should ask it before any transactions', function () {
    cy.loginUI(accounts['second passphrase candidate'], 'dev');
    cy.get('#settings').click();
    cy.get('.register-second-passphrase').click();
    cy.get('.next').click();
    /**
     * Generates a sequence of random pairs of x,y coordinates on the screen that simulates
     * the movement of mouse to produce a pass phrase.
     */
    for (let i = 0; i < 70; i += 1) {
      cy.get('main').first().trigger('mousemove', {
        which: 1,
        pageX: 500 + (Math.floor((((i % 2) * 2) - 1) * (249 + (Math.random() * 250)))),
        pageY: 500 + (Math.floor((((i % 2) * 2) - 1) * (249 + (Math.random() * 250)))),
      });
    }
    cy.get('.reveal-checkbox')
      .trigger('mousedown')
      .trigger('mousemove', { which: 1, pageX: 100, pageY: 0 })
      .trigger('mouseup');
    cy.get('textarea.passphrase').invoke('text').as('passphrase');
    cy.get('.yes-its-safe-button').click();
    cy.get('.passphrase-holder label').each(($el) => {
      if (this.passphrase.includes($el[0].textContent)) cy.wrap($el).click();
    });
    cy.get('.confirm-checkbox')
      .trigger('mousedown')
      .trigger('mousemove', { which: 1, pageX: 100, pageY: 0 })
      .trigger('mouseup');
    cy.get('.get-to-your-dashboard-button', { timeout: 20000 }).click();
    cy.visit('wallet');
    cy.get('.amount input').click().type('1');
    cy.get('.recipient input').click().type('94495548317450503L');
    cy.get('.send-next-button').click();
    cy.get('.second-passphrase input').first().click();
    cy.get('.second-passphrase input').each(($el, index) => {
      const passphraseWordsArray = this.passphrase.split(' ');
      cy.wrap($el).type(passphraseWordsArray[index]);
    });
    cy.get('.second-passphrase-next').click();
    cy.get('.send-button').click();
    cy.get('.result-box-message').should('have.text', 'Transaction is being processed and will be confirmed. It may take up to 15 minutes to be secured in the blockchain.');
    cy.visit('second-passphrase');
    cy.url().should('include', '/dashboard');
    cy.visit('delegates');
    cy.get('.delegate-row li label').eq(3).click();
    cy.get('.delegate-row li label').eq(5).click();
    cy.get('.delegate-row li label').eq(8).click();
    cy.get('.next').click();
    cy.get('.second-passphrase input').each(($el, index) => {
      const passphraseWordsArray = this.passphrase.split(' ');
      cy.wrap($el).type(passphraseWordsArray[index]);
    });
    cy.get('.second-passphrase-next').click();
    cy.get('.confirm').click();
    cy.get('.result-box-message').should('have.text', 'You’re votes are being processed and will be confirmed. It may take up to 10 minutes to be secured in the blockchain.');
  });
});
