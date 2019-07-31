import { connect } from 'react-redux';
import React from 'react';
import { getAPIClient } from './api/network';

function withData(apis = {}) {
  return function (WrappedComponent) {
    function getHOC(ChildComponent) {
      class DataProvider extends React.Component {
        constructor() {
          super();
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

        loadData(key, urlSearchParams = this.state[key].defaultUrlSearchParams, ...args) {
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
