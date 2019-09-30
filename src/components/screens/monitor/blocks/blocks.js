import PropTypes from 'prop-types';
import React from 'react';
import Box from '../../../toolbox/box';
import PageLayout from '../../../toolbox/pageLayout';

const Blocks = ({ t }) => (
  <PageLayout>
    <Box>
      <Box.Header>
        <h1>{t('All blocks')}</h1>
      </Box.Header>
      <Box.Content>
       TODO
      </Box.Content>
    </Box>
  </PageLayout>
);

Blocks.propTypes = {
  t: PropTypes.func.isRequired,
};

export default Blocks;
