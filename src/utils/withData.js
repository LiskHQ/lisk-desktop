import { connect } from 'react-redux';
import React from 'react';
import { getAPIClient } from './api/network';

function withData(apis = {}) {
  return function (WrappedComponent) {
    class DataProvider extends React.Component {
      constructor() {
        super();

        this.state = {
          apis: Object.keys(apis).reduce((acc, key) => {
            acc[key] = {
              data: [],
              error: '',
              isLoading: false,
            };
            return acc;
          }, {}),
        };

        this.loadData = this.loadData.bind(this);
        this.setApiState = this.setApiState.bind(this);
      }

      componentDidMount() {
        Object.keys(apis).forEach((key) => {
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
              ...this.state.api[key],
              ...newState,
            },
          },
        });
      }

      loadData(key, params = {}, ...args) {
        const { apiClient, apiParams } = this.props;
        this.setApiState(key, { isLoading: true });
        apis[key].apiUtil(apiClient, { ...apiParams[key], ...params }, ...args).then((data) => {
          this.setApiState(key, { data, isLoading: false });
        }).catch((error) => {
          this.setApiState(key, { error, isLoading: false });
        });
      }

      render() {
        const { apiClient, apiParams, ...restOfProps } = this.props;
        return (
          <WrappedComponent
            {...{
              ...Object.keys(this.state.apis).reduce((acc, key) => {
                acc[key] = {
                  ...this.state.apis[key],
                  loadData: (...args) => this.loadData(key, ...args),
                };
                return acc;
              }, {}),
              ...restOfProps,
            }}
          />
        );
      }
    }

    const mapStateToProps = (state, ownProps) => ({
      apiClient: getAPIClient(state.settings.token.active, state),
      apiParams: Object.keys(apis).reduce((acc, key) => {
        acc[key] = apis[key].getApiParams(state, ownProps);
        return acc;
      }, {}),
    });

    return connect(
      mapStateToProps,
    )(DataProvider);
  };
}

export default withData;
