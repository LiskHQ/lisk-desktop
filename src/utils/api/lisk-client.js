import Lisk2x from '@liskhq/lisk-client-old';
import Lisk3x from '@liskhq/lisk-client';

export default function () {
  return { '2.x': Lisk2x, '3.x': Lisk3x };
}
