import ss from '../../constants/selectors';

const ss2 = {
  secondPassphraseInput: '.second-passphrase input',
  secondPassphraseNextBtn: '.second-passphrase-next',
};

export default function enterSecondPassphrase(passphrase) {
  cy.get(ss2.secondPassphraseInput).each(($el, index) => {
    const passphraseWordsArray = passphrase.split(' ');
    cy.wrap($el).type(passphraseWordsArray[index]);
  });
  cy.get(ss2.secondPassphraseNextBtn).click();
}

export function enterSecondPassphraseOnSend(passphrase) {
  cy.get(ss.passphraseInput).first().click();
  cy.get(ss.passphraseInput).each(($el, index) => {
    const passphraseWordsArray = passphrase.split(' ');
    cy.wrap($el).type(passphraseWordsArray[index]);
  });
}
