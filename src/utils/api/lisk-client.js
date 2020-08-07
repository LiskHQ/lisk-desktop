import Lisk2x from '@liskhq/lisk-client-old';
import Lisk3x from '@liskhq/lisk-client';

export default function (version) {
  switch (version) {
    case '3':
      return Lisk3x;
    case '2':
      return Lisk2x;
    default:
      return Lisk2x;
  }
}
