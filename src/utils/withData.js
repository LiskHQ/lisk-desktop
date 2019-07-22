import { connect } from 'react-redux';
import React from 'react';
import { getAPIClient } from './api/network';

function withData({
  autoload = true, propName, apiUtil, getApiParams,
}) {
  return function (WrappedComponent) {
    class DataProvider extends React.Component {
      constructor() {
        super();

        this.state = {
          data: [],
          error: '',
          isLoading: false,
        };

        this.loadData = this.loadData.bind(this);
      }

      componentDidMount() {
        if (autoload) {
          this.loadData();
        }
      }

      loadData() {
        const { apiClient, apiParams } = this.props;
        this.setState({ isLoading: true });
        apiUtil(apiClient, apiParams).then((data) => {
          this.setState({ data, isLoading: false });
        }).catch(error => this.setState({ error, isLoading: false }));
      }

      render() {
        return (
          <WrappedComponent
            {...{
              [propName]: {
                ...this.state,
                loadData: this.loadData,
              },
              ...this.props,
            }}
          />
        );
      }
    }

    const mapStateToProps = state => ({
      apiClient: getAPIClient(state.settings.token.active, state),
      apiParams: getApiParams(state),
    });

    return connect(
      mapStateToProps,
    )(DataProvider);
  };
}

export default withData;
