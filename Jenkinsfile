@Library('lisk-jenkins') _

properties([disableConcurrentBuilds(), pipelineTriggers([])])
pipeline {
	agent { node { label 'lisk-desktop' } }
	options {
		timeout(time: 45, unit: 'MINUTES')
		ansiColor('xterm')
	}
	parameters {
		string(name: 'CORE_VERSION', defaultValue: '4.0.0-rc.3')
		string(name: 'SERVICE_BRANCH_NAME', defaultValue: 'release/0.7.0')
	}
	stages {
		stage('install') {
			steps {
				nvm(getNodejsVersion()) {
					sh '''
						npm i -g yarn
						yarn --cwd app && yarn
						'''
				}
			}
		}
		stage('lint') {
			steps {
				ansiColor('xterm') {
					nvm(getNodejsVersion()) {
						sh '''
						rm -rf lisk-service/ # linting will fail otherwise
						rm -rf enevti-service/ # linting will fail otherwise
						rm -rf enevti-core/ # linting will fail otherwise
						yarn run lint
						'''
					}
				}
			}
		}
		stage('build') {
			steps {
                parallel (
                    "prod": {
                        nvm(getNodejsVersion()) {
                            withEnv(["DEFAULT_NETWORK=testnet", "BUILD_NAME=build"]) {
                                sh '''
                                cp -R /home/lisk/fonts/basierCircle setup/react/assets/fonts
                                cp -R /home/lisk/fonts/gilroy setup/react/assets/fonts
                                yarn run build
                                '''
                            }
                        }
                        stash includes: 'app/build/', name: 'build'
                    },
					"E2E": {
						nvm(getNodejsVersion()) {
                            withEnv(["DEFAULT_NETWORK=customNode", "BUILD_NAME=buildE2E"]) {
                                sh '''
                                cp -R /home/lisk/fonts/basierCircle setup/react/assets/fonts
                                cp -R /home/lisk/fonts/gilroy setup/react/assets/fonts
                                yarn run build:e2e

                                # locally serve build
                                nohup npx serve -l 8081 ./app/buildE2E >serve.out 2>serve.err &
                                '''
                            }
						}
						stash includes: 'app/buildE2E/', name: 'buildE2E'
					},
					//service and core setup
					"lisk-setup": {
						dir('lisk-service') {
							checkout([$class: 'GitSCM', branches: [[name: params.SERVICE_BRANCH_NAME ]], userRemoteConfigs: [[url: 'https://github.com/LiskHQ/lisk-service']]])
						}
						nvm(getNodejsVersion()) {
							withEnv(["LISK_SERVICE_FILE_PATH=lisk-service", "USE_NOHUP=true", "CORE=lisk", "GITHUB_APP_REGISTRY_REPO_BRANCH=jenkins-deployment"]) {
								// lisk-core
								sh('./e2e/scripts/run-core.sh')

								// lisk-service
								sh('./e2e/scripts/run-service.sh')

								sh '''
								# lisk service and core logs (for debug purpose only)
								cat lisk-core.out &
								echo "===== lisk-core errors ===="
								cat lisk-core.err &
								echo "======== lisk docker process ======="
								docker ps
								'''
							}
						}
					},
					"enevti-setup": {
						dir('enevti-service') {
							checkout([$class: 'GitSCM', branches: [[name: params.SERVICE_BRANCH_NAME ]], userRemoteConfigs: [[url: 'https://github.com/LiskHQ/lisk-service']]])
						}
						nvm(getNodejsVersion()) {
							withEnv(["ENEVTI_SERVICE_FILE_PATH=enevti-service", "USE_NOHUP=true", "CORE=enevti", "GITHUB_APP_REGISTRY_REPO_BRANCH=jenkins-deployment"]) {
								// enevti-core
								sh('./e2e/scripts/run-core.sh')

								// enevti-service
								sh('./e2e/scripts/run-service.sh')

								sh '''
								# enevti service and core logs (for debug purpose only)
								cat enevti-core.out &
								echo "===== enevti-core error ===="
								cat enevti-core.err &
								echo "======== enevti docker process ======="
								docker ps
								'''
							}
						}
					},
                )
			}
		}
		stage('deploy') {
			agent { node { label 'explorer-www' } }
			steps {
					unstash 'build'
					sh '''
					mkdir -p /var/www/test/${JOB_NAME%/*}/$BRANCH_NAME
					rsync -axl --delete $WORKSPACE/app/build/ /var/www/test/${JOB_NAME%/*}/$BRANCH_NAME/
					rm -rf $WORKSPACE/app/build
					'''
					githubNotify context: 'Jenkins test deployment',
						     description: 'Commit was deployed to test',
						     status: 'SUCCESS',
						     targetUrl: "${HUDSON_URL}test/" + "${JOB_NAME}".tokenize('/')[0] + "/${BRANCH_NAME}"
			}
		}
		stage('tests') {
			steps {
				parallel (
					// jest
					"unit": {
						nvm(getNodejsVersion()) {
							sh 'ON_JENKINS=true yarn run test'
						}
					},
					// e2e
					"e2e": {
						wrap([$class: 'Xvfb']) {
							nvm(getNodejsVersion()) {
								sh '''
								# playwright invocation
								# wait for lisk-service to be up and running
								sleep 10
								set -e; while [[ $(curl -s --fail http://127.0.0.1:9901/api/v3/index/status | jq '.data.percentageIndexed') != 100 ]]; do echo waiting; sleep 10; done; set +e
								
								# wait for enevti-service to be up and running
								set -e; while [[ $(curl -s --fail http://127.0.0.1:9902/api/v3/index/status | jq '.data.percentageIndexed') != 100 ]]; do echo waiting; sleep 10; done; set +e
								
								# check lisk-serivce network status and blocks
								curl --verbose http://127.0.0.1:9901/api/v3/network/status
								curl --verbose http://127.0.0.1:9901/api/v3/blocks

								# check enevti-serivce network status and blocks
								curl --verbose http://127.0.0.1:9902/api/v3/network/status
								curl --verbose http://127.0.0.1:9902/api/v3/blocks

								PW_BASE_URL=http://127.0.0.1:8081/# \
								yarn run cucumber:playwright:open
								'''
							}
						}
					}
				)

			}
			post {
				failure {
					archiveArtifacts artifacts: 'e2e/assets/', allowEmptyArchive: true
				}
				always {
					sh '''
					# kill lisk-service process
					make -C lisk-service logs
					make -C lisk-service down
					
					# kill enevti-service process
					make -C enevti-service logs
					make -C enevti-service down

					# kill lisk-core process
					kill $( cat lisk-core.pid ) || true
					sleep 10
					kill -9 $( cat lisk-core.pid ) || true
					cat lisk-core.out
					cat lisk-core.err
					
					## kill enevti-core process
					# kill $( cat enevti-core.pid ) || true
					# sleep 10
					# kill -9 $( cat enevti-core.pid ) || true
					# cat enevti-core.out
					# cat enevti-core.err
					'''
				}
			}
		}
	}
}
// vim: filetype=groovy
