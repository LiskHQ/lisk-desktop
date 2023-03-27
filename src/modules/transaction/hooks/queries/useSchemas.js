/* eslint-disable import/prefer-default-export */
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { API_VERSION } from 'src/const/config';
import { useCustomQuery } from 'src/modules/common/hooks';
import actionTypes from '@network/store/actionTypes';

/**
 * Custom React hook for retrieving schemas from the network
 * This hook can be called at the time of creating or signing
 * a transaction
 *
 * @param {object} configuration - the custom query configuration object
 * @param {object} configuration.config - the query config
 * @param {object} configuration.config.params - the query parameters
 * @param {string} configuration.options - the query options
 *
 * @returns the query object
 */
export const useSchemas = ({ config: customConfig = {}, options } = {}) => {
  const dispatch = useDispatch();
  const config = {
    url: `/api/${API_VERSION}/schemas`,
    method: 'get',
    event: 'get.schemas',
    ...customConfig,
  };
  const schemas = useCustomQuery({
    keys: ['schemas', customConfig.serviceURL],
    config,
    options,
  });

  // @todo This hook should accept the moduleCommand and return the relevant schema
  // We should remove the action dispatch logic.
  useEffect(() => {
    if (schemas.data) {
      dispatch({
        type: actionTypes.schemasRetrieved,
        data: schemas.data.data.commands,
      });
    }
  }, [schemas.data]);

  return schemas;
};
