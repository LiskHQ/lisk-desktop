import { getApplicationConfig } from '../api';

export const validateAppNode = async (serviceUrl) => {
  try {
    const response = await getApplicationConfig({ serviceUrl });
    if (response) {
      return true;
    }
    throw new Error(`Failed to return response for application url: ${serviceUrl}`);
  } catch (err) {
    throw new Error(`Error getting details for application url: ${serviceUrl}`);
  }
};
