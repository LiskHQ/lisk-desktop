export const getBlockProps = ({ blockId, height }) => {
    if (blockId) return { blockId };
    if (height) return { height };
    throw Error('No parameters supplied');
  };