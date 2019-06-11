import { addPersistedVotes, getPersistedVotes, persistVotes } from './voting';

describe('Utils: voting', () => {
  const address = '1240978124L';
  const votesDict = {
    username1: {
      confirmed: true,
      unconfirmed: false,
      publicKey: 'random_public_key_1',
      username: 'username1',
    },
    username2: {
      confirmed: true,
      unconfirmed: false,
      publicKey: 'random_public_key_2',
      username: 'username2',
    },
    username3: {
      confirmed: false,
      unconfirmed: true,
      publicKey: 'random_public_key_3',
      username: 'username3',
    },
    username5: {
      confirmed: false,
      unconfirmed: false,
      publicKey: 'random_public_key_5',
      username: 'username5',
    },
  };
  const votesList = [{
    ...votesDict.username1,
  }, {
    ...votesDict.username2,
    unconfirmed: true,
  }, {
    confirmed: true,
    unconfirmed: true,
    publicKey: 'random_public_key_4',
    username: 'username4',
  }];

  afterEach(() => {
    localStorage.clear();
  });

  describe('getPersistedVotes', () => {
    it('should load votes from localStorage', () => {
      localStorage.setItem(`votes-${address}`, JSON.stringify(votesDict));
      expect(getPersistedVotes(address)).toEqual(votesDict);
    });
  });

  describe('persistVotes', () => {
    it('should store votes to localStorage', () => {
      persistVotes(address, votesDict);
      expect(localStorage.setItem).toHaveBeenCalledWith(`votes-${address}`, JSON.stringify(votesDict));
    });
  });

  describe('addPersistedVotes', () => {
    it('should return votesDict with vote statuses from localStorage', () => {
      localStorage.setItem(`votes-${address}`, JSON.stringify(votesDict));
      expect(addPersistedVotes(address, votesList)).toEqual([
        votesDict.username1,
        votesDict.username2,
        votesList[2],
        votesDict.username3,
      ]);
    });
  });
});
