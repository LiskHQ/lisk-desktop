/* eslint-disable */
import { Then } from 'cypress-cucumber-preprocessor/steps';
import { ss } from '../../../constants';

Then(/^I should have (\d+) peers rendered in table$/, function (number) {
  cy.get(ss.peerRow).should('have.length', number);
});

Then(/^peers should be sorted in (\w+) order by (\w+)$/, function (sortOrder, sortParam) {
  let prevParamValue = null;
  switch (sortParam) {
    case 'height':
      prevParamValue = sortOrder === 'descending' ? Infinity : -Infinity;

      cy.get(`${ss.peerRow}`).each((ele) => {
        const value = +ele[0].lastElementChild.innerText;
        expect(value)[sortOrder === 'descending' ? 'lte' : 'gte'](prevParamValue);
        prevParamValue = value;
      });
      break;
    case 'networkVersion':
      prevParamValue = sortOrder === 'descending' ? Infinity : -Infinity;

      cy.get(`${ss.peerRow}`).each((ele) => {
        const value = +ele[0].childNodes[3].innerText;
        expect(value)[sortOrder === 'descending' ? 'lte' : 'gte'](prevParamValue);
        prevParamValue = value;
      });
      break;
  }
});
