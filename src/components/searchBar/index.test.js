import React from 'react';
import { expect } from 'chai';
import { mount } from 'enzyme';
import { stub, spy } from 'sinon';
import { Provider } from 'react-redux';
import { BrowserRouter as Router } from 'react-router-dom';
import PropTypes from 'prop-types';
import configureMockStore from 'redux-mock-store';

import accounts from '../../../test/constants/accounts';
import i18n from '../../i18n';
import Search from './index';

describe('SearchBar', () => {
    let wrapper;
    let account;
    let peers;
    let store;
    let history;
    let props;
    let options;
    const address = 'http:localhost:8080';
    const passphrase = 'recipe bomb asset salon coil symbol tiger engine assist pact pumpkin';
    let localStorageStub;

    // Mocking store
    beforeEach(() => {
        localStorageStub = stub(localStorage, 'getItem');
        localStorageStub.withArgs('searches').returns(JSON.stringify({}));

        history = {
            location: {
                pathname: 'explorer',
                search: '',
            },
            replace: spy(),
        };
        props = {
            history,
            t: () => {},
        };
        options = {
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
        wrapper = mount(
            <Provider store={{}}>
                <Router>
                    <Search {...props} />
                </Router>
            </Provider>, options);
    });


    afterEach(() => {
        localStorageStub.restore();
    });

    it('should render Search', () => {
        expect(wrapper.find('Search')).to.have.lengthOf(1);
    });

    it('2222should render Search', () => {
        console.log('123123', wrapper.find('Search').props().history.location.pathname)
        wrapper.find('Search input').simulate('change', { target: { value: '12025' } });
        // const onKeyUp = wrapper.find('Search input').simulate('keyup', {keyCode: 80});
        // console.log(wrapper.debug())
        expect(wrapper.find('Search input').props().value).to.be.equal('12025');
    });
});

