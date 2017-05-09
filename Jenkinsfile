pipeline {
	agent { label 'master-nano-01' }
	environment {
		ON_JENKINS = 'TRUE'
	}
	stages {
	  stage ('Lisk Provisioning') {
			steps {
				parallel(
					"Build Components for Nano" : {
						node('master-nano-01'){
						lock(resource: "master-nano-01", inversePrecedence: true) {
							sh '''#!/bin/bash
										cd /var/lib/jenkins/workspace/
										pkill -f app.js || true
										rm -rf lisk
										git clone https://github.com/LiskHQ/lisk.git
										cd lisk
										git checkout development
										dropdb lisk_test || true
										createdb lisk_test
										psql -d lisk_test -c "alter user "$USER" with password 'password';"
										cp /var/lib/jenkins/workspace/lisk-node-Linux-x86_64.tar.gz .
										tar -zxvf lisk-node-Linux-x86_64.tar.gz
										npm install
										git submodule init
										git submodule update
										cd public
										npm install
										bower install
										grunt release
										cd ..
										cd test/lisk-js/; npm install; cd ../..
										cp test/config.json test/genesisBlock.json .
										export NODE_ENV=test
										BUILD_ID=dontKillMe ~/start_lisk.sh
								 '''
							 }
						}
						node('master-nano-01'){
						lock(resource: "master-nano-01", inversePrecedence: true) {
							sh '''#!/bin/bash
										pkill -f selenium -9 || true
										pkill -f Xvfb -9 || true
										rm -rf /tmp/.X0-lock || true
										cd /var/lib/jenkins/workspace/
										rm -rf lisk-nano
										git clone https://github.com/LiskHQ/lisk-nano.git
										cd lisk-nano
										git checkout $BRANCH_NAME
										npm install
										cd src
										npm install
								 '''
							}
						}
					})
				}
		}
		stage ('Run Tests') {
			steps {
				node('master-nano-01'){
				lock(resource: "master-nano-01", inversePrecedence: true) {
					sh '''#!/bin/bash
								if [ -z ${ghprbPullId+x} ]; then echo "Not a PR build"; else export CI_PULL_REQUEST=$ghprbPullId; fi
								cd /var/lib/jenkins/workspace/lisk-nano/src
								cp ~/.coveralls.yml-nano .coveralls.yml
								npm run build
								npm run dev &> .lisk-nano.log &
								bash ~/tx.sh
								npm run test

								# Commented until e2e is ready
								# export CHROME_BIN=chromium-browser
								# export DISPLAY=:0.0
								# Xvfb :0 -ac -screen 0 1280x1024x24 &
								# ./node_modules/protractor/bin/webdriver-manager update
								# npm run e2e-test
						 '''
					 }
				 }
			}
		}
		stage ('Output logging') {
			steps {
			parallel(
			  "Output Logs from Testing" : {
				  node('master-nano-01'){
				  sh '''#!/bin/bash
								cd /var/lib/jenkins/workspace/lisk-nano/src
								# Commented until e2e is ready
								# cat .protractor.log
								cat .lisk-nano.log
					   '''
					}
				})
			}
		}
		stage ('Node Cleanup') {
			 steps {
			 parallel(
				 "Cleanup Lisk-Core for Nano" : {
				   node('master-nano-01'){
					 sh '''#!/bin/bash
								 pkill -f app.js -9
								 pkill -f webpack-dev-server -9
							'''
					 }
				 })
			}
		}
	}
}
