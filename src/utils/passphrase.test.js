import { expect } from 'chai';
import { generateSeed, generatePassphraseFromSeed, isValidPassphrase } from './passphrase';
import accounts from '../../test/constants/accounts';

if (global._bitcore) delete global._bitcore;
const mnemonic = require('bitcore-mnemonic');

const randoms = [
  0.35125316992864564, 0.6836880327771695, 0.05720201294124072, 0.7136064360838184,
  0.7655709865481362, 0.9670469669099078, 0.6699998930954159, 0.4377283727720742,
  0.4520746683154777, 0.32483170399964156, 0.4176417086143116, 0.07485544616959183,
  0.5864838724752106, 0.992458166265721, 0.2953356626104806, 0.9253299970794635,
  0.8315835772346538, 0.22814980738815094, 0.8816817378085378, 0.04130993200534738,
  0.5620806959233753, 0.6783347082550804, 0.6582754298111972, 0.9407265080520071,
  0.2992502442749252, 0.446331305340699, 0.7475413720669093, 0.7148112168330099,
  0.6788473409981837, 0.30739905372746334, 0.9298657315997332, 0.8201760978951984,
  0.6764618475481385, 0.5691464854512147, 0.5313376750438739, 0.5237600303660543,
  0.6401198419347358, 0.8468681870031731, 0.6879250413863383, 0.9022445733593758,
  0.6840680274208077, 0.43845305327425543, 0.3536761452812316, 0.6880204375727299,
  0.0031374923265699017, 0.358253951306601, 0.42538677883450493, 0.2302610361700177,
  0.8629233919556387, 0.12440329885721546, 0.2570612143448776, 0.6229293361878305,
  0.20181966897105164, 0.9033813245036659, 0.6185390814896223, 0.5838114441897022,
  0.4286790452862015, 0.9228213760352748, 0.16078938960879063, 0.2432043546566549,
  0.9437527202841303, 0.16061288456693723, 0.7563419998061267, 0.40474387363411846,
  0.3570630021881842, 0.7174834892596451, 0.5738603646580553, 0.4816911666908623,
  0.9886525801368591, 0.35845007280863483, 0.394348474116778, 0.8997682191430569,
  0.19395118550133095, 0.6997967408938839, 0.4458043545792023, 0.22871202300931692,
  0.8186473189283325, 0.6697408150930801, 0.8993462696905463, 0.7707387535683512,
  0.9375571099241271, 0.18283746629429265, 0.7672618424464528, 0.9543394877705333,
  0.43815812156490375, 0.21036097696233202, 0.19472050129244556, 0.19569161094514342,
  0.2375539305396075, 0.880419698905385, 0.6007826720223282, 0.5216579498742571,
  0.753594465390701, 0.6525051098186971, 0.6023203664559926, 0.4238157837426728,
  0.13672689203370214, 0.5882714217174292, 0.2472962448966607, 0.39353081489929864,
];

describe('Passphrase', () => {
  describe('generateSeed', () => {
    it('should generate a predictable sequence of bytes for given list of randoms', () => {
      const bytes = [
        [0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0],
        [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0],
        [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0],
        [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0],
        [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 1, 1, 0, 1],
        [1, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 1, 1, 1, 0, 1],
        [1, 0, 0, 0, 1, 1, 0, 0, 1, 0, 0, 1, 1, 1, 0, 1],
        [1, 0, 0, 0, 1, 1, 1, 0, 1, 0, 0, 1, 1, 1, 0, 1],
        [1, 0, 0, 1, 1, 1, 1, 0, 1, 0, 0, 1, 1, 1, 0, 1],
        [1, 0, 0, 1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 0, 1],
        [1, 1, 0, 1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 0, 1],
        [1, 1, 0, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 0, 1],
        [1, 1, 0, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1],
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1],
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0],
        [1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0],
        [1, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0],
        [1, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 1, 0],
        [1, 0, 0, 1, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 1, 0],
        [1, 0, 0, 1, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 1, 1],
        [1, 0, 0, 1, 1, 0, 0, 0, 0, 1, 1, 1, 0, 0, 1, 1],
        [1, 0, 0, 1, 1, 0, 1, 0, 0, 1, 1, 1, 0, 0, 1, 1],
        [1, 0, 0, 1, 1, 0, 1, 0, 0, 1, 1, 1, 1, 0, 1, 1],
        [1, 0, 0, 1, 1, 0, 1, 0, 1, 1, 1, 1, 1, 0, 1, 1],
        [1, 0, 0, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1],
        [1, 0, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1],
        [1, 0, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        [1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 1, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 1, 0, 0, 0, 1, 0],
        [0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 1, 1, 0, 0, 1, 0],
        [0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 1, 1, 0, 1, 1, 0],
        [0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 1, 1, 0, 1, 1, 0],
        [0, 0, 0, 1, 0, 0, 1, 1, 1, 0, 1, 1, 0, 1, 1, 0],
        [0, 0, 1, 1, 0, 0, 1, 1, 1, 0, 1, 1, 0, 1, 1, 0],
        [0, 0, 1, 1, 0, 0, 1, 1, 1, 1, 1, 1, 0, 1, 1, 0],
        [1, 0, 1, 1, 0, 0, 1, 1, 1, 1, 1, 1, 0, 1, 1, 0],
        [1, 0, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 0, 1, 1, 0],
        [1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 0],
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 0],
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1],
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0],
        [0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 1, 0],
      ];

      let data;
      randoms.forEach((rand, i) => {
        if ((!data || data.percentage < 100) && i < bytes.length) {
          data = generateSeed(data, rand);
          expect(data.byte).to.deep.equal(bytes[i]);
        }
      });
    });

    it('should generate an array of 16 hex numbers as seed', () => {
      const { seed } = generateSeed();
      expect(seed.length).to.be.equal(16);
      seed.forEach((num) => {
        expect(parseInt(num, 16)).to.be.below(256);
      });
    });
  });

  describe('generatePassphraseFromSeed', () => {
    const seed = ['e6', '3c', 'd1', '36', 'e9', '70', '5f', 'c0', '4d', '31', 'ef', 'b8', 'd6', '53', '48', '11'];

    it('generates a valid random passphrase from a given seed', () => {
      const passphrase = generatePassphraseFromSeed({ seed });
      expect(mnemonic.isValid(passphrase)).to.be.equal(true);
    });
  });

  describe('isValidPassphrase', () => {
    it('recognises a valid passphrase', () => {
      const { passphrase } = accounts.genesis;
      expect(isValidPassphrase(passphrase)).to.be.equal(true);
    });

    it('recognises an invalid passphrase', () => {
      const passphrase = 'stock borrow episode laundry kitten salute link globe zero feed marble';
      expect(isValidPassphrase(passphrase)).to.be.equal(false);
    });

    it('recognises an invalid passphrase', () => {
      const passphrase = 'stock borrow episode laundry kitten salute link globe zero feed marble tow fee';
      expect(isValidPassphrase(passphrase)).to.be.equal(false);
    });
  });
});
