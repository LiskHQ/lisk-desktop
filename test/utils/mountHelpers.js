import { spy } from 'sinon';
import { mount } from 'enzyme';
import configureMockStore from 'redux-mock-store';
import PropTypes from 'prop-types';
import { expect } from 'chai';

import i18n from '../../src/i18n';


// eslint-disable-next-line import/prefer-default-export
export const mountWithContext = (component, { storeState = {}, location = {} }) => {
  const store = configureMockStore([])(storeState);
  const history = {
    location: {
      pathname: location.pathname || '',
      search: location.search || '',
    },
    replace: spy(),
    createHref: spy(),
    push: spy(),
  };

  const options = {
    context: {
      store, history, i18n, router: { route: history, history },
    },
    childContextTypes: {
      store: PropTypes.object.isRequired,
      history: PropTypes.object.isRequired,
      i18n: PropTypes.object.isRequired,
      router: PropTypes.object.isRequired,
    },
    lifecycleExperimental: true,
  };
  return mount(component, options);
};


export class Utils {
  constructor(input) {
    this.wrapper = input;
  }

  clickOnElement(query) {
    this.wrapper.find(query).simulate('click');
  }
  goToConfirmation() {
    expect(this.wrapper.find('button.confirm')).to.be.not.present();
    this.wrapper.find('button.next').simulate('click');
    expect(this.wrapper.find('button.confirm')).to.be.present();
  }
  checkDisableInput(query, status = '') {
    if (status === 'not') {
      expect(this.wrapper.find(query)).to.not.be.disabled();
    } else {
      expect(this.wrapper.find(query)).to.be.disabled();
    }
  }
  haveLengthOf(query, length) {
    expect(this.wrapper).to.have.exactly(length).descendants(query);
  }
  haveTextOf(query, text) {
    expect(this.wrapper.find(query)).to.have.text(text);
  }
}
