import { connect } from 'react-redux';
import React from 'react';
import { getAPIClient } from './api/network';

/**
 * This HOC helps retrieve the data for it's direct child component.
 * It should have exactly one child.
 *
 * @param {Object} apis
 * Every property of this parameter should have the following properties
 *
 * The key of each property is used to namespace the fetched data.
 * for example if it's named delegate: { ... } and fetches a list of delegates, the results will be
 * fetched and returned as delegates: { data: [ ... ], ...  }
 *
 * @param {Function} apiUtil
 * Refers to a utility function that performs the API call.
 * This function should return a promise.
 *
 * @param {Object|Array} defaultData
 * Should the result have a default set of data, we can pass through this parameter.
 * if not, we can define the interface. For example, should the result be an array,
 * we can pass and empty array to make sure our iterations won't break before the actual
 * data is fetched.
 *
 * @param {Object} defaultUrlSearchParams
 *
 * @param {Object} transformResponse
 *
 * @param {Function} getApiParams
 * Use this function to create query parameters.
 * This function receives 2 parameters, state and props.
 *
 * Function Signature: (state, props) => ({})
 *
 * {Object} state is the entire Redux store state.
 * {Object} props is the dictionary of the properties passed to the component itself.
 *
 * For example
 * ```
 * getApiParams: (state, props) => ({
 *   address: props.account.address,
 *   apiVersion: state.network.networks.LSK.apiVersion,
 * })
 * ```
 * Creates an API call with the following query parameters
 * `?address=${props.account.address}&apiVersion=${state.network.networks.LSK.apiVersion}`
 *
 * @param {Boolean} autoload
 * Determines if the first API call should get fired by componentDidMount cycle event.
 *
 */
function withData(apis = {}) {
  return function (WrappedComponent) {
    function getHOC(ChildComponent) {
      class DataProvider extends React.Component {
        constructor(props) {
          super(props);
          this.defaultState = Object.keys(apis).reduce((acc, key) => ({
            ...acc,
            [key]: {
              data: apis[key].defaultData || {},
              error: '',
              isLoading: false,
              urlSearchParams: apis[key].defaultUrlSearchParams || {},
              loadData: this.loadData.bind(this, key),
              clearData: this.clearData.bind(this, key),
            },
          }), {});
          this.defaultTransformResponse = response => response;

          this.state = this.defaultState;
        }

        componentDidMount() {
          Object.keys(apis).forEach(key => apis[key].autoload && this.state[key].loadData());
        }

        clearData(key) {
          this.setState({ [key]: this.defaultState[key] });
        }

        loadData(key, urlSearchParams = this.state[key].urlSearchParams, ...args) {
          const { apiClient, apiParams } = this.props;
          this.setState(state => ({
            [key]: {
              ...state[key],
              isLoading: true,
              urlSearchParams,
            },
          }));
          apis[key].apiUtil(apiClient, {
            ...apiParams[key],
            ...urlSearchParams,
          }, ...args).then((data) => {
            const transformResponse = apis[key].transformResponse || this.defaultTransformResponse;
            this.setState({
              [key]: {
                ...this.defaultState[key],
                data: transformResponse(data, this.state[key].data, urlSearchParams),
                urlSearchParams,
              },
            });
          }).catch((error) => {
            this.setState({
              [key]: { ...this.defaultState[key], urlSearchParams, error },
            });
          });
        }

        render() {
          const { apiClient, apiParams, ...restOfProps } = this.props;
          return (
            <ChildComponent {...{
              ...restOfProps,
              ...this.state,
            }}
            />
          );
        }
      }

      function getDisplayName(child) {
        return (child && (child.displayName || child.name)) || 'Component';
      }

      DataProvider.displayName = `DataProvider(${getDisplayName(ChildComponent)})`;

      return DataProvider;
    }

    const keys = Object.keys(apis);

    const mapStateToProps = (state, ownProps) => ({
      apiClient: getAPIClient(state.settings.token.active, state),
      apiParams: keys.reduce((acc, key) => {
        acc[key] = apis[key].getApiParams ? apis[key].getApiParams(state, ownProps) : {};
        return acc;
      }, {}),
    });

    const HOCWithData = getHOC(WrappedComponent);

    return connect(
      mapStateToProps,
    )(HOCWithData);
  };
}

export default withData;
