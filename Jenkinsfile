@Library('lisk-jenkins') _

/* comment out the next line to allow concurrent builds on the same branch */
properties([disableConcurrentBuilds(), pipelineTriggers([])])
node('lisk-hub') {
  try {
    stage ('Checkout and Start Lisk Core') {
      try {
        deleteDir()
        checkout scm
      } catch (err) {
        echo "Error: ${err}"
        fail('Stopping build: checkout failed')
      }
    }

    stage ('Install npm dependencies') {
      try {
        sh '''
        cache_file="$HOME/cache/$( sha1sum package.json |awk '{ print $1 }' ).tar.gz"
        if [ -f "$cache_file" ]; then
            tar xf "$cache_file"
        fi
        npm install
        ./node_modules/protractor/bin/webdriver-manager update
        if [ ! -f "$cache_file" ]; then
            GZIP=-4 tar czf "$cache_file" node_modules/
            find $HOME/cache/ -name '*.tar.gz' -ctime +7 -delete
        fi
        '''
      } catch (err) {
        echo "Error: ${err}"
        fail('Stopping build: npm install failed')
      }
    }

    stage ('Run Eslint') {
      try {
        ansiColor('xterm') {
          sh 'npm run --silent clean-build && npm run --silent copy-files && npm run --silent eslint'
        }
      } catch (err) {
        echo "Error: ${err}"
        fail('Stopping build: Eslint failed')
      }
    }

    stage ('Build and Deploy') {
      try {
        withCredentials([string(credentialsId: 'github-lisk-token', variable: 'GH_TOKEN')]) {
          sh '''
          cp ~/.coveralls.yml-hub .coveralls.yml
          npm run --silent build
          npm run --silent build:testnet
          rsync -axl --delete --rsync-path="mkdir -p /var/www/test/${JOB_NAME%/*}/$BRANCH_NAME/ && rsync" $WORKSPACE/app/build/ jenkins@master-01:/var/www/test/${JOB_NAME%/*}/$BRANCH_NAME/
          npm run --silent bundlesize
          if [ -z $CHANGE_BRANCH ]; then
            USE_SYSTEM_XORRISO=true npm run dist:linux
          else
            echo "Skipping desktop build for Linux because we're not on 'development' branch"
          fi
          '''
          archiveArtifacts artifacts: 'app/build/'
          archiveArtifacts artifacts: 'app/build-testnet/'
          archiveArtifacts allowEmptyArchive: true, artifacts: 'dist/lisk-hub*'
          githubNotify context: 'Jenkins test deployment', description: 'Commit was deployed to test', status: 'SUCCESS', targetUrl: "${HUDSON_URL}test/" + "${JOB_NAME}".tokenize('/')[0] + "/${BRANCH_NAME}"
        }
      } catch (err) {
        echo "Error: ${err}"
        fail('Stopping build: build or deploy failed')
      }
    }

    stage ('Run Unit Tests') {
      try {
        ansiColor('xterm') {
          sh '''
          #ON_JENKINS=true npm run --silent test
          # Submit coverage to coveralls
          #cat coverage/*/lcov.info | coveralls -v
          '''
        }
      } catch (err) {
        echo "Error: ${err}"
        fail('Stopping build: test suite failed')
      }
    }

    stage ('Run E2E Tests') {
      try {
        ansiColor('xterm') {
          withCredentials([string(credentialsId: 'lisk-hub-testnet-passphrase', variable: 'TESTNET_PASSPHRASE')]) {
            sh '''
            N=${EXECUTOR_NUMBER:-0}; N=$((N+1))

            # End to End test configuration
            export DISPLAY=:1$N
            Xvfb :1$N -ac -screen 0 1280x1024x24 &

	    cp -r ~/lisk-docker/examples/development $WORKSPACE/$BRANCH_NAME
	    cd $WORKSPACE/$BRANCH_NAME
	    cp /home/lisk/blockchain_explorer.db.gz ./blockchain.db.gz
	    LISK_VERSION=0.9.12a make coldstart
	    LISK_PORT=$( docker-compose port lisk 4000 |cut -d ":" -f 2 )
	    cd -

            # Run end-to-end tests

            npm run serve --  $WORKSPACE/app/build -p 300$N -a 127.0.0.1 &>server.log &
            if [ -z $CHANGE_BRANCH ]; then
              npm run --silent e2e-test -- --params.baseURL http://127.0.0.1:300$N --params.liskCoreURL http://127.0.0.1:$LISK_PORT --cucumberOpts.tags @advanced
              npm run --silent e2e-test -- --params.baseURL http://127.0.0.1:300$N --params.liskCoreURL https://testnet.lisk.io --cucumberOpts.tags @testnet --params.useTestnetPassphrase true
            else
              echo "Skipping @testnet end-to-end tests because we're not on 'development' branch"
            fi
            npm run --silent e2e-test -- --params.baseURL http://127.0.0.1:300$N --params.liskCoreURL http://127.0.0.1:$LISK_PORT
            if [ -z $CHANGE_BRANCH ]; then
              npm run --silent e2e-test -- --params.baseURL http://127.0.0.1:300$N --cucumberOpts.tags @testnet --params.useTestnetPassphrase true --params.network testnet
            else
              echo "Skipping @testnet end-to-end tests because we're not on 'development' branch"
            fi
            '''
          }
        }
      } catch (err) {
        echo "Error: ${err}"
        fail('Stopping build: end-to-end test suite failed')
      }
    }
  } catch(err) {
    echo "Error: ${err}"
    ansiColor('xterm') {
      sh '''
      cd $WORKSPACE/$BRANCH_NAME
      docker-compose logs
      '''
    }
  } finally {
    ansiColor('xterm') {
      sh '''
      cd $WORKSPACE/$BRANCH_NAME
      make mrproper
      '''
    }
    sh '''
    N=${EXECUTOR_NUMBER:-0}; N=$((N+1))
    pgrep --list-full -f "Xvfb :1$N" || true
    pkill --echo -f "Xvfb :1$N" -9 || echo "pkill returned code $?"

    cat reports/cucumber_report.json | ./node_modules/.bin/cucumber-junit > reports/cucumber_report.xml
    '''

    cobertura autoUpdateHealth: false, autoUpdateStability: false, coberturaReportFile: 'coverage/*/cobertura-coverage.xml', conditionalCoverageTargets: '70, 0, 0', failUnhealthy: false, failUnstable: false, fileCoverageTargets: '100, 0, 0', lineCoverageTargets: '80, 0, 0', maxNumberOfBuilds: 0, methodCoverageTargets: '80, 0, 0', onlyStable: false, sourceEncoding: 'ASCII'

    dir('node_modules') {
      deleteDir()
    }

    if (currentBuild.result == null || currentBuild.result == 'SUCCESS') {
      /* delete all files on success */
      deleteDir()
      /* notify of success if previous build failed */
      previous_build = currentBuild.getPreviousBuild()
      if (previous_build != null && previous_build.result == 'FAILURE') {
        build_info = getBuildInfo()
        liskSlackSend('good', "Recovery: build ${build_info} was successful.")
      }
    } else {
      archiveArtifacts allowEmptyArchive: true, artifacts: 'e2e-test-screenshots/'
    }
  }
}
