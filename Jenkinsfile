def fail(reason) {
  def pr_branch = ''
  if (env.CHANGE_BRANCH != null) {
    pr_branch = " (${env.CHANGE_BRANCH})"
  }
  slackSend color: 'danger', message: "Build #${env.BUILD_NUMBER} of <${env.BUILD_URL}|${env.JOB_NAME}>${pr_branch} failed (<${env.BUILD_URL}/console|console>, <${env.BUILD_URL}/changes|changes>)\nCause: ${reason}", channel: '#lisk-nano-jenkins'
  currentBuild.result = 'FAILURE'
  error("${reason}")
}

node('lisk-nano') {
  try {
    stage ('Cleanup, Checkout and Start Lisk Core') {
      try {
        deleteDir()
        checkout scm
      } catch (err) {
        echo "Error: ${err}"
        fail('Stopping build: checkout failed')
      }

      try {
        sh '''
        N=${EXECUTOR_NUMBER:-0}
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
        # cache nightly builds (development) only to save space
        if [ $BRANCH_NAME = "development" ]; then
            rsync -axl --delete $WORKSPACE/node_modules/ ~/cache/development/node_modules/ || true
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
          sh 'npm run --silent clean && npm run --silent copy-files && npm run --silent eslint'
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
        sh 'rsync -axl --delete --rsync-path="mkdir -p /var/www/test/lisk-nano/$BRANCH_NAME/ && rsync" $WORKSPACE/app/build/ jenkins@master-01:/var/www/test/lisk-nano/$BRANCH_NAME/'
        githubNotify context: 'Jenkins test deployment', description: 'Commit was deployed to test', status: 'SUCCESS', targetUrl: "${HUDSON_URL}test/lisk-nano/${BRANCH_NAME}"
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

    stage ('Start Dev Server and Run E2E Tests') {
      try {
        ansiColor('xterm') {
          sh '''
          N=${EXECUTOR_NUMBER:-0}
          NODE_ENV= npm run --silent dev -- --port 808$N > .lisk-nano.log 2>&1 &
          sleep 30

          # End to End test configuration
          export DISPLAY=:1$N
          Xvfb :1$N -ac -screen 0 1280x1024x24 &

          # Run end-to-end tests
          npm run --silent e2e-test -- --params.baseURL http://127.0.0.1:808$N/ --params.liskCoreURL http://127.0.0.1:400$N
          '''
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
    N=${EXECUTOR_NUMBER:-0}
    curl --verbose http://127.0.0.1:400$N/api/blocks/getNethash || true
    ( cd ~/lisk-Linux-x86_64 && bash lisk.sh stop_node -p etc/pm2-lisk_$N.json ) || true
    pgrep --list-full -f "Xvfb :1$N" || true
    pkill --echo -f "Xvfb :1$N" -9 || echo "pkill returned code $?"
    pgrep --list-full -f "webpack.*808$N" || true
    pkill --echo -f "webpack.*808$N" -9 || echo "pkill returned code $?"
    '''
    dir('node_modules') {
      deleteDir()
    }

    def pr_branch = ''
    if (env.CHANGE_BRANCH != null) {
      pr_branch = " (${env.CHANGE_BRANCH})"
    }
    if (currentBuild.result == 'SUCCESS') {
      /* delete all files on success */
      deleteDir()
      /* notify of success if previous build failed */
      previous_build = currentBuild.getPreviousBuild()
      if (previous_build != null && previous_build.result == 'FAILURE') {
        slackSend color: 'good',
                  message: "Recovery: build #${env.BUILD_NUMBER} of <${env.BUILD_URL}|${env.JOB_NAME}>${pr_branch} was successful.",
                  channel: '#lisk-nano-jenkins'
      }
    } else {
      archiveArtifacts allowEmptyArchive: true, artifacts: 'e2e-test-screenshots/'
    }
  }
}
