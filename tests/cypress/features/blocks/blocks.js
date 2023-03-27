/* eslint-disable */
import { Then } from 'cypress-cucumber-preprocessor/steps';
import { ss } from '../../../constants';

let oldHeight, currentHeight;

Then(/^I should see (\d+) blocks in table$/, function (number) {
  cy.wait(500);
  cy.get(ss.blockRow).should('have.length', number);
});

Then(/^blocks should be sorted in (\w+) order by height$/, function (sortOrder) {
  cy.wait(500);
  let prevHeight = sortOrder === 'descending' ? Infinity : -Infinity;

  cy.get(`${ss.blockRow}`).each((ele) => {
    const height = +ele[0].firstElementChild.innerText;
    expect(height)[sortOrder === 'descending' ? 'lt' : 'gt'](prevHeight);
    prevHeight = height;
  });
});

// Due to the fact that the latest blocks might load immediately the associated button is clicked,
// it's best to keep track of the most current block at the time then compare with the latest
// blocks after the button has been clicked
Then(/^I should see the most current block$/, function () {
  cy.get(`${ss.blockRow} > span:first-child`)
    .first()
    .should('exist')
    .invoke('text')
    .then((spanHeight) => {
      oldHeight = parseInt(spanHeight, 10);
    });
});

Then(/^I should see latest blocks$/, function () {
  cy.get(`${ss.blockRow} > span:first-child`)
    .first()
    .invoke('text')
    .then((spanHeight) => {
      currentHeight = parseInt(spanHeight, 10);
      expect(oldHeight)['lt'](currentHeight);
    });
});

Then(/^I should see the block details page$/, function () {
  cy.location().should((location) => {
    const hasId = /block\?id=408c63b500eac768140ef7a0dacd1638726c783c1cefa52a42189ef0fa46a1c1/.test(
      location.href
    );
    expect(hasId).true;
  });
});

Then(/^I should see (\w.+) in (block\w+) section$/, function (detail, section) {
  if (section === 'blockIdDetails') {
    const truncateAddress = (address) => address.replace(/^(.{6})(.+)?(.{5})$/, '$1...$3');
    cy.get(ss[section]).should('contain', truncateAddress(detail));
  } else {
    cy.get(ss[section]).should('contain', detail);
  }
});

Then(/^I should be on transaction details modal on block details page$/, function () {
  cy.location().should((location) => {
    const hasAddress =
      /&modal=transactionDetails&transactionId=6dc372dfcbfd2b1782d4d1964a35908f71e3878c69b5bbe28e5c69973671c8ee/.test(
        location.href
      );
    expect(hasAddress).true;
  });
});

Then(/^I should see (\w.+) in (\w+) field$/, function (text, field) {
  if (/id/i.test(field)) {
    const truncateAddress = (address) => address.replace(/^(.{6})(.+)?(.{5})$/, '$1...$3');
    cy.get(ss[field]).should('contain', truncateAddress(text));
  } else {
    cy.get(ss[field]).should('contain', text);
  }
});
