/* eslint-disable  import/prefer-default-export */
const data = new Array(30).fill({})
  .map((_, index) => ({
    id: `00${index}`,
    moduleID: `00${index + 1}`,
    moduleName: 'token',
    typeID: `00${index}`,
    data: { // Depends on event typeID
      numberOfSignatures: 2,
      mandatoryKeys: '0fe9a3f1a21b5530f27f87a414b549e79a940bf24fdf2b2f05e7f22aeeecc86a',
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
