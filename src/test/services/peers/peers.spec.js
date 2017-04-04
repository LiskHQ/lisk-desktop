const chai = require('chai');
const sinon = require('sinon');
const sinonChai = require('sinon-chai');

const expect = chai.expect;
chai.use(sinonChai);

describe('Factory: $peers', () => {
  let $peers;
  let $q;
  let $rootScope;

  beforeEach(angular.mock.module('app'));

  beforeEach(inject((_$peers_, _$q_, _$rootScope_) => {
    $peers = _$peers_;
    $q = _$q_;
    $rootScope = _$rootScope_;
  }));

  describe('setActive()', () => {
    it('sets $peers.active to a random active official peer', () => {
      expect($peers.active).to.equal(undefined);
      $peers.setActive();
      expect($peers.active).not.to.equal(undefined);
      expect($peers.stack.official).to.include($peers.active);
    });
  });

  describe('check()', () => {
    let deffered;
    let mock;

    beforeEach(() => {
      deffered = $q.defer();
      $peers.active = $peers.stack.official[0];
      mock = sinon.mock($peers.active);
      mock.expects('status').withArgs().returns(deffered.promise);
    });

    afterEach(() => {
      mock.verify();
      mock.restore();
    });

    it('checks active peer status and if that succeeds then sets this.online = true', () => {
      $peers.check();
      deffered.resolve();
      $rootScope.$apply();
      expect($peers.online).to.equal(true);
    });

    it('checks active peer status and if that fails then sets this.online = false', () => {
      $peers.check();
      deffered.reject();
      $rootScope.$apply();
      expect($peers.online).to.equal(false);
    });
  });
});
