@Library('lisk-jenkins') _

properties([disableConcurrentBuilds(), pipelineTriggers([])])
pipeline {
	agent { node { label 'lisk-desktop' } }
	options {
		timeout(time: 30, unit: 'MINUTES')
	}
	parameters {
		string(name: 'SERVICE_BRANCH_NAME', defaultValue: 'development')
	}
	stages {
		stage('install') {
			steps {
				nvm(getNodejsVersion()) {
					sh 'npm ci'
				}
			}
		}
		stage('lint') {
			steps {
				ansiColor('xterm') {
					nvm(getNodejsVersion()) {
						sh '''
						rm -rf lisk-service/  # TODO
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
					cp -R /home/lisk/fonts/basier-circle src/assets/fonts
					cp -R /home/lisk/fonts/gilroy src/assets/fonts
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
							checkout([$class: 'GitSCM', branches: [[name: "$SERVICE_BRANCH_NAME" ]], userRemoteConfigs: [[url: 'https://github.com/LiskHQ/lisk-service']]])
						}
						nvm(getNodejsVersion()) {
							ansiColor('xterm') {
								wrap([$class: 'Xvfb']) {
									sh '''
									wget --no-verbose --continue https://downloads.lisk.com/lisk/testnet/3.0.2/lisk-core-v3.0.2-linux-x64.tar.gz.SHA256 https://downloads.lisk.com/lisk/testnet/3.0.2/lisk-core-v3.0.2-linux-x64.tar.gz
									sha256sum -c lisk-core-v3.0.2-linux-x64.tar.gz.SHA256
									tar xf lisk-core-v3.0.2-linux-x64.tar.gz
									rm -rf ~/.lisk/
									mkdir -p ~/.lisk/lisk-core/config/devnet/
									cp -f test/dev_config_and_db/genesis_block.json ~/.lisk/lisk-core/config/devnet/
									./lisk-core/bin/lisk-core blockchain:import --force test/dev_config_and_db/tokens_unlocked_dev_blockchain.db.tar.gz
									./lisk-core/bin/lisk-core forger-info:import --force test/dev_config_and_db/forger.db.tar.gz
									nohup ./lisk-core/bin/lisk-core start --network=devnet --api-ws --api-ws-host=0.0.0.0 --api-ws-port=8080 --enable-forger-plugin >lisk-core.out 2>lisk-core.err &
									echo $! >lisk-core.pid
									sleep 90  # TODO
									curl --verbose http://127.0.0.1:8080/
									cp -f lisk-service/docker/example.env lisk-service/.env
									make -C lisk-service up
									docker exec --user root lisk-service_core_1 mkdir -p /home/lisk/lisk-service/export/data/static
									docker exec --user root lisk-service_core_1 mkdir -p /home/lisk/lisk-service/export/data/partials
									docker exec --user root lisk-service_core_1 chown lisk:lisk -R /home/lisk/lisk-service/export/data
									set -e; while ! curl --silent --fail http://127.0.0.1:9901/api/v2/blocks >/dev/null; do echo waiting; sleep 10; done; set +e
									curl --verbose http://127.0.0.1:9901/api/v2/blocks
									set -e; while ! curl --silent --fail http://127.0.0.1:9901/api/v2/network/status >/dev/null; do echo waiting; sleep 10; done; set +e
									curl --verbose http://127.0.0.1:9901/api/v2/network/status

									CYPRESS_baseUrl=https://jenkins.lisk.com/test/${JOB_NAME%/*}/$BRANCH_NAME/#/ \
									CYPRESS_serviceUrl=http://127.0.0.1:9901 \
									npm run cypress:run
									'''
								}
							}
						}
					},
					// jest
					"unit": {
						nvm(getNodejsVersion()) {
							ansiColor('xterm') {
								sh 'ON_JENKINS=true npm run test'
							}
						}
					},
				)
			}
			post {
				always {
					sh '''
					make -C lisk-service logs
					make -C lisk-service down
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
