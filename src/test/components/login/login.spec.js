const chai = require('chai');
const sinon = require('sinon');
const sinonChai = require('sinon-chai');

const expect = chai.expect;
chai.use(sinonChai);

describe('Login component', () => {
  let $compile;
  let $rootScope;
  let element;

  // Load the myApp module, which contains the directive
  beforeEach(angular.mock.module('app'));

  // Store references to $rootScope and $compile
  // so they are available to all tests in this describe block
  beforeEach(inject((_$compile_, _$rootScope_) => {
    // The injector unwraps the underscores (_) from around the parameter names when matching
    $compile = _$compile_;
    $rootScope = _$rootScope_;
  }));

  beforeEach(() => {
    // Compile a piece of HTML containing the directive
    element = $compile('<login></login>')($rootScope);
    $rootScope.$digest();
  });

  const HEADER_TEXT = 'Sign In';
  it(`should contain header saying "${HEADER_TEXT}"`, () => {
    expect(element.find('.md-title').text()).to.equal(HEADER_TEXT);
  });

  const PASS_LABEL_TEXT = 'Enter your passphrase';
  it(`should contain a form input with label saying "${PASS_LABEL_TEXT}"`, () => {
    expect(element.find('form md-input-container label.pass').text()).to.equal(PASS_LABEL_TEXT);
  });

  const SELECT_LABEL_TEXT = 'Choose a peer';
  it(`should contain a select element with label saying "${SELECT_LABEL_TEXT}"`, () => {
    expect(element.find('form md-input-container label.select').text()).to.equal(SELECT_LABEL_TEXT);
  });

  it('should contain an input field', () => {
    expect(element.find('form input').html()).to.equal('');
  });

  const LOGIN_BUTTON_TEXT = 'Login';
  it(`should contain a button saying "${LOGIN_BUTTON_TEXT}"`, () => {
    expect(element.find('.md-raised').text()).to.equal(LOGIN_BUTTON_TEXT);
  });
});

describe('Login controller', () => {
  beforeEach(angular.mock.module('app'));

  let $rootScope;
  let $scope;
  let $state;
  let controller;
  let $componentController;
  let testPassphrase;

  beforeEach(inject((_$componentController_, _$rootScope_, _$state_) => {
    $componentController = _$componentController_;
    $rootScope = _$rootScope_;
    $state = _$state_;
  }));

  beforeEach(() => {
    testPassphrase = 'glow two glimpse camp aware tip brief confirm similar code float defense';
    $scope = $rootScope.$new();
    controller = $componentController('login', $scope, { });
    controller.onLogin = function () {};
    controller.passphrase = '';
  });

  describe('controller()', () => {
    it('should define a watcher for $ctrl.$peers.currentPeerConfig', () => {
      $scope.$apply();
      const peers = controller.$peers;
      const spy = sinon.spy(peers, 'setActive');
      peers.currentPeerConfig = peers.stack.localhost[0];
      $scope.$apply();
      peers.currentPeerConfig = peers.stack.official[0];
      $scope.$apply();
      expect(spy).to.have.been.calledWith();
    });

    it('should be able to change the active peer', () => {
      $scope.$apply();
      controller.$peers.setActive(controller.$peers.stack.localhost[0]);
      $scope.$apply();
      expect(controller.$peers.currentPeerConfig).to.equal(controller.$peers.stack.localhost[0]);
      controller.$peers.setActive(controller.$peers.stack.official[0]);
      $scope.$apply();
      expect(controller.$peers.currentPeerConfig).to.equal(controller.$peers.stack.official[0]);
    });
  });

  describe('$scope.reset()', () => {
    it('makes input_passphrase empty', () => {
      const passphrase = 'TEST';
      controller.input_passphrase = passphrase;
      expect(controller.input_passphrase).to.equal(passphrase);
      controller.reset();
      expect(controller.input_passphrase).to.equal('');
    });
  });

  describe('$scope.stopNewPassphraseGeneration()', () => {
    it('sets this.generatingNewPassphrase = false', () => {
      controller.generatingNewPassphrase = true;
      controller.stopNewPassphraseGeneration();
      expect(controller.generatingNewPassphrase).to.equal(false);
    });

    it('unbinds mousemove listener', () => {
      const unbindSpy = sinon.spy(controller.$document, 'unbind');
      controller.stopNewPassphraseGeneration();
      expect(unbindSpy).to.have.been.calledWith('mousemove', controller.listener);
    });
  });

  describe('$scope.startGenratingNewPassphrase()', () => {
    it('sets this.generatingNewPassphrase = true', () => {
      controller.startGenratingNewPassphrase();
      expect(controller.generatingNewPassphrase).to.equal(true);
    });

    it('unbinds mousemove listener', () => {
      const spy = sinon.spy(controller, 'reset');
      controller.startGenratingNewPassphrase();
      expect(spy).to.have.been.calledWith();
    });

    it('creates this.listener(ev) which if called repeatedly will generate a random this.seed', () => {
      controller.startGenratingNewPassphrase();
      expect(controller.seed).to.deep.equal(['00', '00', '00', '00', '00', '00', '00', '00', '00', '00', '00', '00', '00', '00', '00', '00']);
      expect(controller.progress).to.equal(0);

      for (let j = 0; j < 300; j++) {
        const ev = {
          pageX: Math.random() * 1000,
          pageY: Math.random() * 1000,
        };
        controller.listener(ev);
      }

      expect(controller.seed).not.to.deep.equal(['00', '00', '00', '00', '00', '00', '00', '00', '00', '00', '00', '00', '00', '00', '00', '00']);
      expect(controller.progress).to.equal(100);
    });
  });

  describe('$scope.doTheLogin()', () => {
    it('sets this.phassphrase as this.input_passphrase processed by fixCaseAndWhitespace', () => {
      controller.input_passphrase = '\tGLOW two GliMpse camp aware tip brief confirm similar code float defense  ';
      controller.doTheLogin();
      expect($rootScope.passphrase).to.equal('glow two glimpse camp aware tip brief confirm similar code float defense');
    });

    it('calls this.reset()', () => {
      controller.input_passphrase = testPassphrase;
      const spy = sinon.spy(controller, 'reset');
      controller.doTheLogin();
      expect(spy).to.have.been.calledWith();
    });

    it('redirects to main if passphrase is valid', () => {
      controller.input_passphrase = testPassphrase;
      const spy = sinon.spy($state, 'go');
      controller.doTheLogin();
      expect(spy).to.have.been.calledWith('main');
    });
  });

  describe('$scope.constructor()', () => {
    it.skip('sets $watch on $ctrl.input_passphrase to keep validating it', () => {
      // Skipped because it doesn't work
      const spy = sinon.spy(controller.$scope, '$watch');
      controller.constructor();
      expect(spy).to.have.been.calledWith('$ctrl.input_passphrase', controller.isValidPassphrase);
    });

    it.skip('sets $watch that sets customFullscreen on small screens', () => {
    });
  });

  describe('$scope.simulateMousemove()', () => {
    it('calls this.$document.mousemove()', () => {
      const spy = sinon.spy(controller.$document, 'mousemove');
      controller.simulateMousemove();
      expect(spy).to.have.been.calledWith();
    });
  });

  describe('$scope.setNewPassphrase()', () => {
    it('opens a material design dialog', () => {
      const seed = ['23', '34', '34', '34', '34', '34', '34', '34'];
      const dialogSpy = sinon.spy(controller.$mdDialog, 'show');
      controller.setNewPassphrase(seed);
      expect(dialogSpy).to.have.been.calledWith();
    });
  });

  describe('$scope.devTestAccount()', () => {
    it('sets input_passphrase from cookie called passphrase if present', () => {
      const mock = sinon.mock(controller.$cookies);
      mock.expects('get').returns(testPassphrase);
      controller.devTestAccount();
      expect(controller.input_passphrase).to.equal(testPassphrase);
    });

    it('does nothing if cooke called passphrase not present', () => {
      controller.input_passphrase = testPassphrase;
      const mock = sinon.mock(controller.$cookies);

      mock.expects('get').returns(undefined);
      controller.devTestAccount();
      expect(controller.input_passphrase).to.equal(testPassphrase);
    });
  });

  describe('$scope.isValidPassphrase(value)', () => {
    it('sets $scope.valid = 2 if  value is empty', () => {
      controller.isValidPassphrase('');
      expect(controller.valid).to.equal(2);
    });

    it('sets $scope.valid = 1 if value is valid', () => {
      controller.isValidPassphrase('ability theme abandon abandon abandon abandon abandon abandon abandon abandon abandon absorb');
      expect(controller.valid).to.equal(1);
    });

    it('sets $scope.valid = 0 if value is invalid', () => {
      controller.isValidPassphrase('INVALID VALUE');
      expect(controller.valid).to.equal(0);
    });
  });
});

describe('save $mdDialog controller', () => {
  describe('constructor()', () => {
    it.skip('sets $watch on $ctrl.missing_input', () => {
    });
  });

  describe('next()', () => {
    it.skip('sets this.enter=true', () => {
    });

    it.skip('sets this.missing_word to a random word of passphrase', () => {
    });

    it.skip('sets this.pre to part of the passphrase before this.missing_word', () => {
    });

    it.skip('sets this.pos to part of the passphrase after this.missing_word', () => {
    });
  });

  describe('ok()', () => {
    it.skip('calls ok()', () => {
    });

    it.skip('calls this.close()', () => {
    });
  });

  describe('close()', () => {
    it.skip('calls this.$mdDialog.hide()', () => {
    });
  });
});
