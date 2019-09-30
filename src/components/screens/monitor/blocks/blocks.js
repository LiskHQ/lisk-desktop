import PropTypes from 'prop-types';
import React from 'react';
import Box from '../../../toolbox/box';
import PageLayout from '../../../toolbox/pageLayout';

const Blocks = ({ t, blocks }) => (
  <PageLayout>
    <Box isLoading={blocks.isLoading}>
      <Box.Header>
        <h1>{t('All blocks')}</h1>
      </Box.Header>
      <Box.Content>
        {blocks.data.map(block => (
          <Box.Row key={block.id}>
            <span className="blockId">{block.id}</span>
          </Box.Row>
        ))}
      </Box.Content>
    </Box>
  </PageLayout>
);

Blocks.propTypes = {
  t: PropTypes.func.isRequired,
  blocks: PropTypes.shape({
    data: PropTypes.array.isRequired,
    isLoading: PropTypes.bool.isRequired,
  }).isRequired,
};

export default Blocks;
