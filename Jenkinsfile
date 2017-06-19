node('lisk-nano-01'){
  lock(resource: "lisk-nano-01", inversePrecedence: true) {
    stage ('Cleanup Orphaned Processes') {
      try {
      sh '''
        # Clean up old processes
        cd ~/lisk-test-nano
        bash lisk.sh stop_node
        pkill -f selenium -9 || true
        pkill -f Xvfb -9 || true
        rm -rf /tmp/.X0-lock || true
        pkill -f webpack -9 || true
      '''
      } catch (err) {
        currentBuild.result = 'FAILURE'
        milestone 1
        error('Stopping build, installation failed')
      }
    }

    stage ('Prepare Workspace') {
      try {
        deleteDir()
        checkout scm
      } catch (err) {
        currentBuild.result = 'FAILURE'
        milestone 1
        error('Stopping build, Checkout failed')
      }
    }

    stage ('Start Lisk Core') {
      try {
        sh '''#!/bin/bash
          cd ~/lisk-test-nano
          bash lisk.sh rebuild -0
          '''
      } catch (err) {
        currentBuild.result = 'FAILURE'
        milestone 1
        error('Stopping build, Lisk Core failed to start')
      }
    }

    stage ('Build Nano') {
      try {
        sh '''#!/bin/bash
        # Install Electron
        npm install
        # Build nano
        cd $WORKSPACE
        npm install

        # Add coveralls config file
        cp ~/.coveralls.yml-nano .coveralls.yml

        # Run Build
        npm run build
        '''
      } catch (err) {
        currentBuild.result = 'FAILURE'
        milestone 1
        error('Stopping build, Nano build failed')
      }
    }

    stage ('Run Tests') {
      try {
        sh '''
        export ON_JENKINS=true

	# Start xvfb
        export DISPLAY=:99
        Xvfb :99 -ac -screen 0 1280x1024x24 &

        # Run test
        cd $WORKSPACE
        npm run test
        '''
      } catch (err) {
        currentBuild.result = 'FAILURE'
        error('Stopping build, Test suite failed')
      }
    }

    stage ('Start Dev Server and Run Tests') {
      try {
        sh '''
        # Prepare lisk core for testing
        bash ./e2e-transactions.sh

        # Run Dev build and Build
        cd $WORKSPACE
        export NODE_ENV=
        npm run dev &> .lisk-nano.log &
        sleep 30

        # End to End test configuration
        # ./node_modules/protractor/bin/webdriver-manager update
        # ./node_modules/protractor/bin/webdriver-manager start &

        # Run End to End Tests
        # npm run e2e-test

        cd ~/lisk-test-nano
        bash lisk.sh stop_node
        pkill -f selenium -9 || true
        pkill -f Xvfb -9 || true
        rm -rf /tmp/.X0-lock || true
        pkill -f webpack -9 || true

        '''
      } catch (err) {
        currentBuild.result = 'FAILURE'
        milestone 1
        error('Stopping build, End to End Test suite failed')
      }
    }

    stage ('Set milestone') {
      milestone 1
    }
  }
}
