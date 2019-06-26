import ss from '../../constants/selectors';

const secondPassphraseSS = {
  secondPassphraseInput: '.second-passphrase input',
  secondPassphraseNextBtn: '.second-passphrase-next',
};

export default function enterSecondPassphrase(passphrase) {
  cy.get(secondPassphraseSS.secondPassphraseInput).each(($el, index) => {
    const passphraseWordsArray = passphrase.split(' ');
    cy.wrap($el).type(passphraseWordsArray[index]);
  });
  cy.get(secondPassphraseSS.secondPassphraseNextBtn).click();
}

export function enterSecondPassphraseV2(passphrase) {
  cy.get(ss.passphraseInput).first().click();
  cy.get(ss.passphraseInput).each(($el, index) => {
    const passphraseWordsArray = passphrase.split(' ');
    cy.wrap($el).type(passphraseWordsArray[index]);
  });
}
