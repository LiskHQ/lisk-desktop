
import { expect } from 'chai';

export default class GenericStepDefinition {
  constructor(input, store) {
    this.wrapper = input;
    this.store = store;
  }
  /**
   * simulate click on a dom query
   * @param {String} query - dom query that we need to simulate clink on it 
   */
  clickOnElement(query) {
    this.wrapper.find(query).first().simulate('click');
  }
  /**
   * check that dom query entry is disable or enable
   * if value of status is equal to 'not' query shouldn't be disabled
   * @param {String} query - dom query that we need to check that is disable or not
   * @param {String} status - possible values are 'not' and ''
   */
  checkDisableInput(query, status = '') {
    if (status === 'not') {
      expect(this.wrapper.find(query)).to.not.be.disabled();
    } else {
      expect(this.wrapper.find(query)).to.be.disabled();
    }
  }
  /**
   * 
   * @param {String} query - dom query that we need to check length of that
   * @param {Integer} length 
   */
  haveLengthOf(query, length) {
    expect(this.wrapper).to.have.exactly(length).descendants(query);
  }
  /**
   * 
   * @param {String} query - dom query that we need to check text of that
   * @param {String} text - expect text of the dom query entry
   */
  haveTextOf(query, text) {
    expect(this.wrapper.find(query)).to.have.text(text);
  }

  fillInputField(value, field) {
    this.wrapper.find(`.${field} input`).first().simulate('change', { target: { value } });
  }

  shouldBeLoggedInAs(expectedPublicKey) {
    expect(this.store.getState().account.publicKey).to.equal(expectedPublicKey);
  }

  shouldSeeCountInstancesOf(count, query) {
    expect(this.wrapper.find(query)).to.have.lengthOf(count);
  }
}
