import { connect } from 'react-redux';
import React from 'react';
import { getAPIClient } from './api/network';

function withData(apis = {}) {
  const keys = Object.keys(apis);

  function getDefaultState(key) {
    return {
      data: apis[key].defaultData || {},
      error: '',
      isLoading: false,
    };
  }

  return function (WrappedComponent) {
    class DataProvider extends React.Component {
      constructor() {
        super();


        this.state = {
          apis: keys.reduce((acc, key) => {
            acc[key] = getDefaultState(key);
            return acc;
          }, {}),
        };

        this.loadData = this.loadData.bind(this);
        this.clearData = this.clearData.bind(this);
        this.setApiState = this.setApiState.bind(this);
      }

      componentDidMount() {
        keys.forEach((key) => {
          if (apis[key].autoload) {
            this.loadData(key);
          }
        });
      }

      setApiState(key, newState) {
        this.setState({
          apis: {
            ...this.state.apis,
            [key]: {
              ...this.state.apis[key],
              ...newState,
            },
          },
        });
      }

      clearData(key) {
        this.setApiState(key, getDefaultState(key));
      }

      loadData(key, params = {}, ...args) {
        const { apiClient, apiParams } = this.props;
        this.setApiState(key, { isLoading: true });
        apis[key].apiUtil(apiClient, { ...apiParams[key], ...params }, ...args).then((data) => {
          this.setApiState(key, { ...getDefaultState(key), data });
        }).catch((error) => {
          this.setApiState(key, { ...getDefaultState(key), error });
        });
      }

      render() {
        const { apiClient, apiParams, ...restOfProps } = this.props;
        return (
          <WrappedComponent
            {...{
              ...keys.reduce((acc, key) => {
                acc[key] = {
                  ...this.state.apis[key],
                  loadData: (...args) => this.loadData(key, ...args),
                  clearData: () => this.clearData(key),
                };
                return acc;
              }, {}),
              ...restOfProps,
            }}
          />
        );
      }
    }

    function getDisplayName() {
      return (WrappedComponent && (WrappedComponent.displayName || WrappedComponent.name)) || 'Component';
    }

    DataProvider.displayName = `DataProvider(${getDisplayName()})`;

    const mapStateToProps = (state, ownProps) => ({
      apiClient: getAPIClient(state.settings.token.active, state),
      apiParams: keys.reduce((acc, key) => {
        acc[key] = apis[key].getApiParams ? apis[key].getApiParams(state, ownProps) : {};
        return acc;
      }, {}),
    });

    return connect(
      mapStateToProps,
    )(DataProvider);
  };
}

export default withData;
