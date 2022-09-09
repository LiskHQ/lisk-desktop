/* eslint-disable  import/prefer-default-export */
const data = new Array(30).fill({}).map((_, index) => ({
  index,
  id: `0fe9a3f1a21b5530f27f87a414b549e79a940bf24fdf2b2f05e7f22aeeecc8a${index.toString(16)}`,
  module: 'token',
  typeID: index % 5,
  data: {
    // Depends on event typeID
    numberOfSignatures: 2,
    mandatoryKeys: '0000a3f1a21b5530f27f87a010b549e79a934bf24fdf2b2f05e7e12aeeecc67b',
    optionalKeys: '0fe9a3f1a21b5530f27f87a414b549e79a940bf24fdf2b2f05e7f22aeeecc86a',
  },
  topics: [],
  block: {
    id: `625835480267616579${index}`,
    height: 8350681,
    timestamp: 28227090,
  },
}));
export const mockEvents = {
  data,
  meta: {
    count: 15,
    offset: 0,
    total: 30,
  },
};
