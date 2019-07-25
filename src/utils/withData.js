import { connect } from 'react-redux';
import React from 'react';
import { getAPIClient } from './api/network';

function withData(apis = {}) {
  return function (WrappedComponent) {
    function getHOC(ChildComponent, {
      key, autoload, apiUtil, defaultData = {},
    }) {
      class DataProvider extends React.Component {
        constructor() {
          super();
          this.defaultState = {
            data: defaultData,
            error: '',
            isLoading: false,
          };


          this.state = this.defaultState;

          this.loadData = this.loadData.bind(this);
          this.clearData = this.clearData.bind(this);
        }

        componentDidMount() {
          if (autoload) {
            this.loadData();
          }
        }

        clearData() {
          this.setState(this.defaultState);
        }

        loadData(params = {}, ...args) {
          const { apiClient, apiParams } = this.props;
          this.setState({ isLoading: true });
          apiUtil(apiClient, { ...apiParams[key], ...params }, ...args).then((data) => {
            this.setState({ ...this.defaultState, data });
          }).catch((error) => {
            this.setState({ ...this.defaultState, error });
          });
        }

        render() {
          const { apiClient, apiParams, ...restOfProps } = this.props;
          return (
            <ChildComponent {...{
              [key]: {
                ...this.state,
                loadData: this.loadData,
                clearData: this.clearData,
              },
              ...restOfProps,
            }}
            />
          );
        }
      }

      function getDisplayName(child) {
        return (child && (child.displayName || child.name)) || 'Component';
      }

      DataProvider.displayName = `DataProvider-${key}(${getDisplayName(ChildComponent)})`;

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

    const HOCWithData = keys.reduce((acc, key) => (
      getHOC(acc, { ...apis[key], key })), WrappedComponent);

    return connect(
      mapStateToProps,
    )(HOCWithData);
  };
}

export default withData;
