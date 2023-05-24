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
		string(name: 'SERVICE_BRANCH_NAME', defaultValue: 'development')
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
									# wget --no-verbose --continue https://downloads.lisk.com/lisk/testnet/$CORE_VERSION/lisk-core-v$CORE_VERSION-linux-x64.tar.gz.SHA256 https://downloads.lisk.com/lisk/testnet/$CORE_VERSION/lisk-core-v$CORE_VERSION-linux-x64.tar.gz
									# sha256sum -c lisk-core-v$CORE_VERSION-linux-x64.tar.gz.SHA256
									# rm -rf lisk-core/
									# tar xf lisk-core-v$CORE_VERSION-linux-x64.tar.gz
									# rm -rf ~/.lisk/
									# install -D tests/dev_config_and_db/genesis_block.json ~/.lisk/lisk-core/config/devnet/genesis_block.json
									# ./lisk-core/bin/lisk-core blockchain:import --force tests/dev_config_and_db/tokens_unlocked_dev_blockchain.db.tar.gz
									# ./lisk-core/bin/lisk-core generator-info:import --force tests/dev_config_and_db/generator.db.tar.gz
									# nohup ./lisk-core/bin/lisk-core start --network=devnet --api-ws --api-ws-host=0.0.0.0 --api-ws-port=8080 --enable-http-api-plugin >lisk-core.out 2>lisk-core.err &
									# echo $! >lisk-core.pid
									npm i -g lisk-core
									rm -rf ~/.lisk/
									# lisk-core blockchain:import --force ./e2e/artifacts/blockchain.tar.gz
									nohup lisk-core start --network=devnet --api-ws --api-host=0.0.0.0 >lisk-core.out 2>lisk-core.err &
									echo $! >lisk-core.pid

									# wait for core to be up and running
									# set -e; while ! curl --silent --fail http://127.0.0.1:7887/api/node/info >/dev/null; do echo waiting; sleep 10; done; set +e
									# curl --verbose http://127.0.0.1:7887/api/node/info

									# lisk-service
									cp -f lisk-service/docker/example.env lisk-service/.env
									echo LISK_APP_WS=ws://host.docker.internal:7887 >>lisk-service/.env
									sed -i -e "s/curl=~8.0/curl=~8.1/" lisk-service/services/gateway/Dockerfile
									make -C lisk-service build
									make -C lisk-service up

									# workaround for https://github.com/LiskHQ/lisk-service/issues/916
									# until https://github.com/LiskHQ/lisk-service/issues/920 is resolved
									# docker exec --user root lisk-service_core_1 mkdir -p /home/lisk/lisk-service/export/data/static
									# docker exec --user root lisk-service_core_1 mkdir -p /home/lisk/lisk-service/export/data/partials
									# docker exec --user root lisk-service_core_1 chown lisk:lisk -R /home/lisk/lisk-service/export/data

									# wait for service to be up and running
									# TODO: Remove comments and fix Lisk Service endpoint integration
									# https://github.com/LiskHQ/lisk-desktop/issues/4509
									# set -e; while ! curl --silent --fail http://127.0.0.1:9901/api/v3/blocks >/dev/null; do echo waiting; sleep 10; done; set +e
									# curl --verbose http://127.0.0.1:9901/api/v3/blocks
									set -e; while [[ $(curl -s --fail http://127.0.0.1:9901/api/v3/index/status | jq '.data.percentageIndexed') != 100 ]]; do echo waiting; sleep 10; done; set +e
									curl --verbose http://127.0.0.1:9901/api/v3/network/status
									curl --verbose http://127.0.0.1:9901/api/v3/blocks

									PW_BASE_URL=https://jenkins.lisk.com/test/${JOB_NAME%/*}/${BRANCH_NAME%/*} \
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
