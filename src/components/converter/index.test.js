import { expect } from 'chai';
import sinon from 'sinon';
import { mount } from 'enzyme';
import React from 'react';
import PropTypes from 'prop-types';

import liskServiceApi from '../../utils/api/liskService';
import i18n from '../../i18n';
import Converter from './index';

describe('Converter', () => {
  let explorereApiMock;
  let wrapper;

  beforeEach(() => {
    explorereApiMock = sinon.stub(liskServiceApi, 'getPriceTicker').returnsPromise();
  });

  afterEach(() => {
    explorereApiMock.restore();
  });

  it('shold render Converter component', () => {
    const props = {
      t: () => {},
    };
    wrapper = mount(<Converter {...props} />, {
      context: { i18n },
      childContextTypes: {
        i18n: PropTypes.object.isRequired,
      },
    });
    expect(wrapper.find('Converter')).to.have.present();
  });

  it('should change active price', () => {
    const props = {
      t: () => {},
      value: 0,
      error: false,
    };
    wrapper = mount(<Converter {...props} />, {
      context: { i18n },
      childContextTypes: {
        i18n: PropTypes.object.isRequired,
      },
    });
    expect(wrapper.state('currencies')[0]).to.have.equal('USD');
    wrapper.find('.convertElem').at(2).simulate('click');
    expect(wrapper.state('currencies')[0]).to.have.equal('EUR');
  });

  it('should convert price to USD', () => {
    const props = {
      t: () => {},
      value: 2,
      error: false,
    };
    wrapper = mount(<Converter {...props} />, {
      context: { i18n },
      childContextTypes: {
        i18n: PropTypes.object.isRequired,
      },
    });

    explorereApiMock.resolves({ LSK: { USD: 123, EUR: 12 } });
    wrapper.update();
    expect(wrapper.state('LSK')).to.have.deep.equal({ USD: 123, EUR: 12 });
    expect(wrapper.find('.convertElem').at(0).text()).to.have.equal('~ 246.00');
  });
});

