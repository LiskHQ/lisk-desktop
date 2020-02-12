@Library('lisk-jenkins') _

properties([disableConcurrentBuilds(), pipelineTriggers([])])
pipeline {
	agent { node { label 'lisk-desktop' } }
	options {
		buildDiscarder(logRotator(numToKeepStr: '168', artifactNumToKeepStr: '5'))
	}
	environment {
		LISK_CORE_VERSION = '2.1.3'
	}
	parameters {
		booleanParam(name: 'SKIP_PERCY', defaultValue: false, description: 'Skip running percy.')
	}
	stages {
		stage('Install npm dependencies') {
			steps {
				nvm(getNodejsVersion()) {
					sh 'npm install --registry https://npm.lisk.io'
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
								if stat /home/lisk/fonts/basier-circle/* > /dev/null ; then
									cp /home/lisk/fonts/basier-circle/* src/assets/fonts/basier-circle/
								fi
								if stat /home/lisk/fonts/gilroy/* > /dev/null ; then
									cp /home/lisk/fonts/gilroy/* src/assets/fonts/gilroy/
								fi
								npm run --silent build
								npm run --silent build:testnet
								npm run --silent bundlesize

								npm run install-electron-dependencies
								USE_SYSTEM_XORRISO=true npm run dist:linux
								'''
							}
						}
						archiveArtifacts artifacts: 'app/build/'
						archiveArtifacts artifacts: 'app/build-testnet/'
						archiveArtifacts allowEmptyArchive: true, artifacts: 'dist/lisk-linux-*'
						stash includes: 'app/build/', name: 'build'
					}
				)
			}
		}
		stage('Deploy build') {
			agent { node { label 'master-01' } }
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
							          tags: [[name: "v${env.LISK_CORE_VERSION}" ]],
								  userRemoteConfigs: [[url: 'https://github.com/LiskHQ/lisk-core']]])
						}
						withCredentials([string(credentialsId: 'lisk-hub-testnet-passphrase', variable: 'TESTNET_PASSPHRASE')]) {
						withCredentials([string(credentialsId: 'lisk-hub-cypress-record-key', variable: 'CYPRESS_RECORD_KEY')]) {
							ansiColor('xterm') {
								wrap([$class: 'Xvfb', parallelBuild: true, autoDisplayName: true]) {
									nvm(getNodejsVersion()) {
										sh '''#!/bin/bash -xe
										export N=${EXECUTOR_NUMBER:-0}; N=$((N+1))

										rm -rf $WORKSPACE/$BRANCH_NAME/
										cp -rf $WORKSPACE/lisk/docker/ $WORKSPACE/$BRANCH_NAME/
										cp $WORKSPACE/test/dev_blockchain.db.gz $WORKSPACE/$BRANCH_NAME/dev_blockchain.db.gz
										cd $WORKSPACE/$BRANCH_NAME
										cp .env.development .env
										sed -i -r -e "s/ENV_LISK_VERSION=.*$/ENV_LISK_VERSION=$LISK_CORE_VERSION/" .env

										sed -i -r -e '/ports:/,+2d' docker-compose.yml
										# random port assignment
										cat <<EOF >docker-compose.override.yml
version: "3"
services:

  lisk:
    ports:
      - \\${ENV_LISK_HTTP_PORT}
      - \\${ENV_LISK_WS_PORT}
EOF

										ENV_LISK_VERSION="$LISK_CORE_VERSION" make coldstart
										export CYPRESS_baseUrl=http://127.0.0.1:300$N/#/
										export CYPRESS_coreUrl=http://127.0.0.1:$( docker-compose port lisk 4000 |cut -d ":" -f 2 )
										cd -

										npm run serve -- $WORKSPACE/app/build -p 300$N -a 127.0.0.1 &>server.log &
										set +e
										set -o pipefail
										npm run cypress:run |tee cypress.log
										ret=$?
										if [ $ret -ne 0 ]; then
										  FAILED_TESTS="$( awk '/Spec/{f=1}f' cypress.log |grep --only-matching '✖ .*.feature' |awk '{ print "test/cypress/features/"$2 }' |xargs| tr -s ' ' ',' )"
                                          cd $WORKSPACE/$BRANCH_NAME
                                          make coldstart
                                          export CYPRESS_coreUrl=http://127.0.0.1:$( docker-compose port lisk 4000 |cut -d ":" -f 2 )
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
				sh '( cd $WORKSPACE/$BRANCH_NAME && make mrproper || true ) || true'
			}
			cleanWs()
		}
	}
}
// vim: filetype=groovy
