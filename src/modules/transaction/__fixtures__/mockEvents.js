/* eslint-disable  import/prefer-default-export */
const data = new Array(30).fill({}).map((item, index) => ({
  'moduleID': '2',
  'moduleName': 'token',
  'typeID': '2',
  'data': '0a14e135813f51103e7645ed87a0562a823d2fd48bc612207eef331c6d58f3962f5fb35b13f780f0ee7d93fbc37a3e9f4ccbdc6d1551db801a303629827aaa0836111137215708fd2007e9221ca1d56b29b98d8e9747ec3243c0549dc2091515d2bdd72fb28acef50160',
  'topics': [],
  'block': {
    'id': `625835480267616579${index}`,
    'height': 8350681,
    'timestamp': 28227090
  }
}))
export const mockEvents = {
  data,
  'meta': {
    'count': 15,
    'offset': 0,
    'total': 30
  }
};
