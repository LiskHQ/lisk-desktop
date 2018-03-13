import React from 'react';
import { expect } from 'chai';
import { mount } from 'enzyme';
import { Provider } from 'react-redux';
import { BrowserRouter as Router } from 'react-router-dom';
import PropTypes from 'prop-types';
import configureMockStore from 'redux-mock-store';

import accounts from '../../../test/constants/accounts';
import i18n from '../../i18n';
import Sidechains from './index';

describe('Sidechains', () => {
    const store = configureMockStore([])({});
    const options = {
        context: { store, i18n },
        childContextTypes: {
            store: PropTypes.object.isRequired,
            i18n: PropTypes.object.isRequired,
    },
    };
    it('should render Sidechains', () => {
        const props = {
            t: () => {},
        };
        const wrapper = mount(
            <Provider store={{}}>
            <Router>
                <Sidechains {...props} />
            </Router>
          </Provider>, options);
        expect(wrapper.find('Sidechains')).to.have.lengthOf(1);
    });
});
