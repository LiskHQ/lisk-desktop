@Library('lisk-jenkins') _

properties([disableConcurrentBuilds(), pipelineTriggers([])])
pipeline {
	agent { node { label 'lisk-desktop' } }
	options {
		buildDiscarder(logRotator(numToKeepStr: '168', artifactNumToKeepStr: '5'))
	}
	parameters {
		booleanParam(name: 'SKIP_PERCY', defaultValue: false, description: 'Skip running percy.')
		string(name: 'LISK_CORE_VERSION', defaultValue: 'release/3.0.0-beta.1', description: 'Use lisk-core branch.', )
		string(name: 'LISK_CORE_IMAGE_VERSION', defaultValue: '3.0.0-beta.1-a7842d112d5136d9462501763c4cb2895096e900', description: 'Use lisk-core docker image.', )
		string(name: 'LISK_SERVICE_VERSION', defaultValue: 'v0.2.0', description: 'Use lisk-service branch.', )
	}
	stages {
		stage('Install npm dependencies') {
			steps {
				nvm(getNodejsVersion()) {
					sh 'npm install --registry https://npm.lisk.io --no-optional'
				}
			}
		}
		stage('Build') {
			steps {
				parallel (
					"ESLint": {
						ansiColor('xterm') {
							nvm(getNodejsVersion()) {
								sh 'npm run --silent eslint'
							}
						}
					},
					"build": {
						withCredentials([string(credentialsId: 'github-lisk-token', variable: 'GH_TOKEN')]) {
							nvm(getNodejsVersion()) {
								sh '''
								cp -R /home/lisk/fonts/basier-circle src/assets/fonts
								cp -R /home/lisk/fonts/gilroy src/assets/fonts
								npm run --silent build
								npm run --silent build:testnet

								npm run install-electron-dependencies
								USE_SYSTEM_XORRISO=true npm run dist:linux
								'''
							}
						}
						archiveArtifacts allowEmptyArchive: true, artifacts: 'dist/lisk-linux-*'
						archiveArtifacts allowEmptyArchive: true, artifacts: 'dist/latest-linux.yml'
						stash includes: 'app/build/', name: 'build'
					}
				)
			}
		}
		stage('Deploy build') {
			agent { node { label 'explorer-www' } }
			steps {
					unstash 'build'
					sh '''
					rsync -axl --delete $WORKSPACE/app/build/ /var/www/test/${JOB_NAME%/*}/$BRANCH_NAME/
					rm -rf $WORKSPACE/app/build
					'''
					githubNotify context: 'Jenkins test deployment',
					             description: 'Commit was deployed to test',
						     status: 'SUCCESS',
						     targetUrl: "${HUDSON_URL}test/" + "${JOB_NAME}".tokenize('/')[0] + "/${BRANCH_NAME}"

			}
		}
		stage('Run tests') {
			environment {
				LISK_CORE_IMAGE_VERSION = "${params.LISK_CORE_IMAGE_VERSION}"
			}
			steps {
				parallel (
					"jest": {
						ansiColor('xterm') {
							nvm(getNodejsVersion()) {
								sh 'ON_JENKINS=true npm run --silent test'
								script {
									// we don't want to fail the build if reporting to coveralls.io fails
									try {
										withCredentials([string(credentialsId: 'lisk-hub-coveralls-token', variable: 'COVERALLS_REPO_TOKEN')]) {
											sh 'cat coverage/jest/lcov.info |coveralls'
										}
									} catch(err) {
										println 'Could not report coverage statistics:\n${err}'
									}
								}
							}
						}
					},
					"cypress": {
						dir('lisk') {
							checkout([$class: 'GitSCM',
							          branches: [[name: "${params.LISK_CORE_VERSION}" ]],
								  userRemoteConfigs: [[url: 'https://github.com/LiskHQ/lisk-core']]])
						}
						dir('lisk-service') {
							checkout([$class: 'GitSCM',
								  branches: [[name: "${params.LISK_SERVICE_VERSION}" ]],
								  userRemoteConfigs: [[url: 'https://github.com/LiskHQ/lisk-service']]])
							sh '''
							make build-core
							make build-gateway
							make build-template
							make build-tests
							'''
						}
						withCredentials([string(credentialsId: 'lisk-hub-testnet-passphrase', variable: 'TESTNET_PASSPHRASE'), string(credentialsId: 'lisk-hub-cypress-record-key', variable: 'CYPRESS_RECORD_KEY')]) {
							ansiColor('xterm') {
								wrap([$class: 'Xvfb', parallelBuild: true, autoDisplayName: true]) {
									nvm(getNodejsVersion()) {
										sh '''#!/bin/bash -xe

										rm -rf $WORKSPACE/$BRANCH_NAME/
										cp -rf $WORKSPACE/lisk/docker/ $WORKSPACE/$BRANCH_NAME/
										cp $WORKSPACE/test/dev_blockchain.db.gz $WORKSPACE/$BRANCH_NAME/dev_blockchain.db.gz
										cd $WORKSPACE/$BRANCH_NAME
										cp .env.development .env
										sed -i -r -e "s/ENV_LISK_VERSION=.*$/ENV_LISK_VERSION=$LISK_CORE_IMAGE_VERSION/" .env

										sed -i -r -e '/ports:/,+2d' docker-compose.yml
										# random port assignment
										cat <<EOF >docker-compose.override.yml
version: "3"
services:

  lisk:
    ports:
      - 4000:4000
    environment:
      - LISK_CONSOLE_LOG_LEVEL=debug
EOF

										rm -rf $WORKSPACE/$BRANCH_NAME-service/
										cp -rf $WORKSPACE/lisk-service/docker/ $WORKSPACE/$BRANCH_NAME-service/

										ENV_LISK_VERSION="$LISK_CORE_IMAGE_VERSION" make coldstart
										cd -

										cd $WORKSPACE/$BRANCH_NAME-service/
										# TODO: use random port when the tests support it
										cat <<EOF >docker-compose.override.yml
version: "3"
services:

  gateway:
    ports:
      - 127.0.0.1:9901:9901
EOF

										cat <<EOF >custom.env
LISK_CORE_HTTP=http://10.127.0.1:4000
LISK_CORE_WS=ws://10.127.0.1:4000
EOF
										sed -i '/compose := docker-compose/a\\\t-f docker-compose.override.yml \\\\' Makefile.jenkins
										sed -i 's/docker-compose.testnet.yml/docker-compose.custom.yml/' Makefile.jenkins
										ENABLE_HTTP_API='http-version1,http-version1-compat,http-status,http-test' \
										ENABLE_WS_API='rpc,rpc-v1,blockchain,rpc-test' \
										make -f Makefile.jenkins up
										ready=1
										retries=0
										set +e
										while [ $ready -ne 0 ]; do
										  curl --fail --verbose http://127.0.0.1:9901/api/v1/blocks
										  ready=$?
										  sleep 10
										  let retries++
										  if [ $retries = 6 ]; then
										    break
										  fi
										done
										set -e
										if [ $retries -ge 6 ]; then
										  exit 1
										fi
										cd -

										npm run serve -- $WORKSPACE/app/build -p 5650 -a 127.0.0.1 &>server.log &

										export CYPRESS_baseUrl=http://127.0.0.1:5650/#/
										export CYPRESS_coreUrl=http://127.0.0.1:4000
										export CYPRESS_serviceUrl=http://127.0.0.1:9901
										set +e
										set -o pipefail
										npm run cypress:run |tee cypress.log
										ret=$?

										# this is to save on cypress credits
										if [ $ret -ne 0 ]; then
										  FAILED_TESTS="$( awk '/Spec/{f=1}f' cypress.log |grep --only-matching '✖ .*.feature' |awk '{ print "test/cypress/features/"$2 }' |xargs| tr -s ' ' ',' )"
										  cd $WORKSPACE/$BRANCH_NAME
										  make coldstart
										  sleep 10
										  cd -
										  npm run cypress:run -- --record --spec $FAILED_TESTS |tee cypress.log
										  ret=$?
										fi
										exit $ret
										'''
									}
								}
							}
						}
					},
					"percy": {
						script {
							if(params.SKIP_PERCY){
								echo 'Skipping percy run as requested.'
							} else {
								ansiColor('xterm') {
									nvm(getNodejsVersion()) {
										withCredentials([string(credentialsId: 'PERCY_TOKEN', variable: 'PERCY_TOKEN')]) {
											sh 'npm run percy'
										}
									}
								}
							}
						}
					},
				)
			}
		}
	}
	post {
		always {
			cobertura autoUpdateHealth: false,
				  autoUpdateStability: false,
				  coberturaReportFile: 'coverage/jest/cobertura-coverage.xml',
				  conditionalCoverageTargets: '70, 0, 0',
				  failUnhealthy: false,
				  failUnstable: false,
				  fileCoverageTargets: '100, 0, 0',
				  lineCoverageTargets: '80, 0, 0',
				  maxNumberOfBuilds: 0,
				  methodCoverageTargets: '80, 0, 0',
				  onlyStable: false,
				  sourceEncoding: 'ASCII'
			junit 'coverage/jest/junit.xml'
		}
		fixed {
			script {
				build_info = getBuildInfo()
				liskSlackSend('good', "Recovery: build ${build_info} was successful.")
			}
		}
		failure {
			script {
				build_info = getBuildInfo()
				liskSlackSend('danger', "Build ${build_info} failed (<${env.BUILD_URL}/console|console>, <${env.BUILD_URL}/changes|changes>)")
			}
		}
		cleanup {
			ansiColor('xterm') {
				sh 'cat $WORKSPACE/server.log || true'
				sh '( cd $WORKSPACE/$BRANCH_NAME-service && make -f Makefile.jenkins logs || true ) || true'
				sh '( cd $WORKSPACE/$BRANCH_NAME-service && make -f Makefile.jenkins mrproper || true ) || true'
				sh '( cd $WORKSPACE/$BRANCH_NAME && docker-compose logs || true ) || true'
				sh '( cd $WORKSPACE/$BRANCH_NAME && make mrproper || true ) || true'
			}
			cleanWs()
		}
	}
}
// vim: filetype=groovy
