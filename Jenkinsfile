@Library('lisk-jenkins') _

properties([disableConcurrentBuilds(), pipelineTriggers([])])
pipeline {
	agent { node { label 'lisk-desktop' } }
	options {
		timeout(time: 45, unit: 'MINUTES')
		ansiColor('xterm')
	}
	parameters {
		string(name: 'CORE_VERSION', defaultValue: '4.0.0-beta.1')
		string(name: 'SERVICE_BRANCH_NAME', defaultValue: 'v0.7.0-beta.1')
	}
	stages {
		stage('install') {
			steps {
				nvm(getNodejsVersion()) {
					sh '''
						npm ci --registry https://npm.lisk.com
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
						npm run lint
						'''
					}
				}
			}
		}
		stage('build') {
			steps {
				nvm(getNodejsVersion()) {
					sh '''
					cp -R /home/lisk/fonts/basierCircle setup/react/assets/fonts
					cp -R /home/lisk/fonts/gilroy setup/react/assets/fonts
					npm run build
					'''
				}
				stash includes: 'app/build/', name: 'build'
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
		stage('test') {
			steps {
				parallel (
					// cypress
					"end-to-end": {
						dir('lisk-service') {
							checkout([$class: 'GitSCM', branches: [[name: params.SERVICE_BRANCH_NAME ]], userRemoteConfigs: [[url: 'https://github.com/LiskHQ/lisk-service']]])
						}
						nvm(getNodejsVersion()) {
							withEnv(["REACT_APP_MSW=true"]) {
								wrap([$class: 'Xvfb']) {
									sh '''
									# lisk-core
									npm i -g lisk-core
									rm -rf ~/.lisk/
									lisk-core blockchain:import --force ./e2e/artifacts/blockchain.tar.gz
									nohup lisk-core start --network=devnet --api-ws --api-host=0.0.0.0 >lisk-core.out 2>lisk-core.err &
									echo $! >lisk-core.pid

									# lisk-service
									cp -f lisk-service/docker/example.env lisk-service/.env
									echo LISK_APP_WS=ws://host.docker.internal:7887 >>lisk-service/.env
									sed -i -e "s/curl=~8.0/curl=~8/" lisk-service/services/gateway/Dockerfile
									sed -i -e "s/alpine-sdk=~1.0 python3=~3.10 cmake=~3.24/alpine-sdk=~1 python3=~3 cmake=~3/" lisk-service/services/blockchain-connector/Dockerfile
									make -C lisk-service build
									make -C lisk-service up

									# wait for service to be up and running
									set -e; while [[ $(curl -s --fail http://127.0.0.1:9901/api/v3/index/status | jq '.data.percentageIndexed') != 100 ]]; do echo waiting; sleep 10; done; set +e
									curl --verbose http://127.0.0.1:9901/api/v3/network/status
									curl --verbose http://127.0.0.1:9901/api/v3/blocks

									PW_BASE_URL=https://jenkins.lisk.com/test/${JOB_NAME%/*}/${BRANCH_NAME%/*}/# \
									npm run cucumber:playwright:open
									'''
								}
							}
						}
					},
					// jest
					"unit": {
						nvm(getNodejsVersion()) {
							sh 'ON_JENKINS=true npm run test'
						}
					},
				)
			}
			post {
				failure {
					archiveArtifacts artifacts: 'cucumber-report.html', allowEmptyArchive: true
				}
				always {
					sh '''
					# kill lisk-service process
					make -C lisk-service logs
					make -C lisk-service down

					# kill lisk-core process
					kill $( cat lisk-core.pid ) || true
					sleep 10
					kill -9 $( cat lisk-core.pid ) || true
					cat lisk-core.out
					cat lisk-core.err
					'''
				}
			}
		}
	}
}
// vim: filetype=groovy
