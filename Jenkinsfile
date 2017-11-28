def get_build_info() {
  pr_branch = ''
  if (env.CHANGE_BRANCH != null) {
    pr_branch = " (${env.CHANGE_BRANCH})"
  }
  build_info = "#${env.BUILD_NUMBER} of <${env.BUILD_URL}|${env.JOB_NAME}>${pr_branch}"
  return build_info
}

def slack_send(color, message) {
  /* Slack channel names are limited to 21 characters */
  CHANNEL_MAX_LEN = 21
  CHANNEL_SUFFIX = '-jenkins'

  channel = "${env.JOB_NAME}".tokenize('/')[0]
  channel_len = CHANNEL_MAX_LEN - CHANNEL_SUFFIX.size()
  if ( channel.size() > channel_len ) {
     channel = channel.substring(0, channel_len)
  }
  channel += CHANNEL_SUFFIX
  echo "[slack_send] channel: ${channel} "

  slackSend color: "${color}", message: "${message}", channel: "${channel}"
}

def fail(reason) {
  build_info = get_build_info()
  slack_send('danger', "Build ${build_info} failed (<${env.BUILD_URL}/console|console>, <${env.BUILD_URL}/changes|changes>)\nCause: ${reason}")
  currentBuild.result = 'FAILURE'
  error("${reason}")
}

/* comment out the next line to allow concurrent builds on the same branch */
properties([disableConcurrentBuilds(), pipelineTriggers([])])
node('lisk-nano') {
  try {
    stage ('Checkout and Start Lisk Core') {
      try {
        deleteDir()
        checkout scm
      } catch (err) {
        echo "Error: ${err}"
        fail('Stopping build: checkout failed')
      }

      try {
        sh '''
        N=${EXECUTOR_NUMBER:-0}; N=$((N+1))
        cd ~/lisk-Linux-x86_64
        # work around core bug: config.json gets overwritten; use backup
        cp .config.json config_$N.json
        # change core port, listen only on 127.0.0.1
        sed -i -r -e "s/^(.*ort\\":) 4000,/\\1 400$N,/" config_$N.json
        sed -i -r -e "s/^(.*\\"address\\":) \\"0.0.0.0\\",/\\1 \\"127.0.0.1\\",/" config_$N.json
        # disable redis
        sed -i -r -e "s/^(\\s*\\"cacheEnabled\\":) true/\\1 false/" config_$N.json
        # change postgres databse
        sed -i -r -e "s/^(\\s*\\"database\\": \\"lisk_test)\\",/\\1_$N\\",/" config_$N.json
        cp etc/pm2-lisk.json etc/pm2-lisk_$N.json
        sed -i -r -e "s/config.json/config_$N.json/" etc/pm2-lisk_$N.json
        sed -i -r -e "s/(lisk.app)/\\1_$N/" etc/pm2-lisk_$N.json
        # logs
        sed -i -r -e "s/lisk.log/lisk_${JOB_BASE_NAME}_${BUILD_ID}.log/" config_$N.json
        sed -i -r -e "s/lisk.app_$N/lisk.app_$N_${JOB_BASE_NAME}_${BUILD_ID}/" etc/pm2-lisk_$N.json
        #
        JENKINS_NODE_COOKIE=dontKillMe bash lisk.sh start_db -p etc/pm2-lisk_$N.json
        bash lisk.sh rebuild -p etc/pm2-lisk_$N.json -f blockchain_explorer.db.gz
        '''
      } catch (err) {
        echo "Error: ${err}"
        fail('Stopping build: Lisk Core failed to start')
      }
    }

    stage ('Install npm dependencies') {
      try {
        sh '''
        cp -r ~/cache/development/node_modules ./ || true
        npm install
        ./node_modules/protractor/bin/webdriver-manager update
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

    stage ('Build Nano') {
      try {
        sh '''
        cp ~/.coveralls.yml-nano .coveralls.yml
        npm run --silent build
        '''
      } catch (err) {
        echo "Error: ${err}"
        fail('Stopping build: nano build failed')
      }
    }

    stage ('Deploy') {
      try {
        sh 'rsync -axl --delete --rsync-path="mkdir -p /var/www/test/${JOB_NAME%/*}/$BRANCH_NAME/ && rsync" $WORKSPACE/app/build/ jenkins@master-01:/var/www/test/${JOB_NAME%/*}/$BRANCH_NAME/'
        githubNotify context: 'Jenkins test deployment', description: 'Commit was deployed to test', status: 'SUCCESS', targetUrl: "${HUDSON_URL}test/" + "${JOB_NAME}".tokenize('/')[0] + "/${BRANCH_NAME}"
      } catch (err) {
        echo "Error: ${err}"
        fail('Stopping build: deploy failed')
      }
    }

    stage ('Run Unit Tests') {
      try {
        ansiColor('xterm') {
          sh '''
          ON_JENKINS=true npm run --silent test
          # Submit coverage to coveralls
          cat coverage/*/lcov.info | coveralls -v
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
          withCredentials([string(credentialsId: 'lisk-nano-testnet-passphrase', variable: 'TESTNET_PASSPHRASE')]) {
            sh '''
            N=${EXECUTOR_NUMBER:-0}; N=$((N+1))

            # End to End test configuration
            export DISPLAY=:1$N
            Xvfb :1$N -ac -screen 0 1280x1024x24 &

            # Run end-to-end tests

            if [ -z $CHANGE_BRANCH ]; then
              npm run --silent e2e-test -- --params.baseURL file://$WORKSPACE/app/build/index.html --params.liskCoreURL https://testnet.lisk.io --cucumberOpts.tags @testnet --params.useTestnetPassphrase true
            else
              echo "Skipping @testnet end-to-end tests because we're not on 'development' branch"
            fi
            npm run --silent e2e-test -- --params.baseURL file://$WORKSPACE/app/build/index.html --params.liskCoreURL http://127.0.0.1:400$N
            if [ -z $CHANGE_BRANCH ]; then
              npm run --silent e2e-test -- --params.baseURL file://$WORKSPACE/app/build/index.html --cucumberOpts.tags @testnet --params.useTestnetPassphrase true --params.network testnet
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
  } finally {
    sh '''
    N=${EXECUTOR_NUMBER:-0}; N=$((N+1))
    curl --verbose http://127.0.0.1:400$N/api/blocks/getNethash || true
    ( cd ~/lisk-Linux-x86_64 && bash lisk.sh stop_node -p etc/pm2-lisk_$N.json ) || true
    pgrep --list-full -f "Xvfb :1$N" || true
    pkill --echo -f "Xvfb :1$N" -9 || echo "pkill returned code $?"

    # cache nightly builds (development) only to save space
    if [ $BRANCH_NAME = "development" ]; then
        rsync -axl --delete $WORKSPACE/node_modules/ ~/cache/development/node_modules/ || true
    fi
    '''
    dir('node_modules') {
      deleteDir()
    }

    if (currentBuild.result == null || currentBuild.result == 'SUCCESS') {
      /* delete all files on success */
      deleteDir()
      /* notify of success if previous build failed */
      previous_build = currentBuild.getPreviousBuild()
      if (previous_build != null && previous_build.result == 'FAILURE') {
        build_info = get_build_info()
        slack_send('good', "Recovery: build ${build_info} was successful.")
      }
    } else {
      archiveArtifacts allowEmptyArchive: true, artifacts: 'e2e-test-screenshots/'
    }
  }
}
