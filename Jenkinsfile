@Library('lisk-jenkins') _

properties([disableConcurrentBuilds(), pipelineTriggers([])])
pipeline {
	agent { node { label 'lisk-desktop' } }
	options {
		timeout(time: 30, unit: 'MINUTES')
		ansiColor('xterm')
	}
	parameters {
		string(name: 'CORE_VERSION', defaultValue: '3.0.2')
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
						rm -rf lisk-service/ scripts/app/build/ setup/react/app/build/ # linting will fail otherwise
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
							checkout([$class: 'GitSCM', branches: [[name: "$SERVICE_BRANCH_NAME" ]], userRemoteConfigs: [[url: 'https://github.com/LiskHQ/lisk-service']]])
						}
						nvm(getNodejsVersion()) {
							wrap([$class: 'Xvfb']) {
								sh '''
								# lisk-core
								wget --no-verbose --continue https://downloads.lisk.com/lisk/testnet/$CORE_VERSION/lisk-core-v$CORE_VERSION-linux-x64.tar.gz.SHA256 https://downloads.lisk.com/lisk/testnet/$CORE_VERSION/lisk-core-v$CORE_VERSION-linux-x64.tar.gz
								sha256sum -c lisk-core-v$CORE_VERSION-linux-x64.tar.gz.SHA256
								rm -rf lisk-core/
								tar xf lisk-core-v$CORE_VERSION-linux-x64.tar.gz
								rm -rf ~/.lisk/
								install -D tests/dev_config_and_db/genesis_block.json ~/.lisk/lisk-core/config/devnet/genesis_block.json
								./lisk-core/bin/lisk-core blockchain:import --force tests/dev_config_and_db/tokens_unlocked_dev_blockchain.db.tar.gz
								./lisk-core/bin/lisk-core forger-info:import --force tests/dev_config_and_db/forger.db.tar.gz
								nohup ./lisk-core/bin/lisk-core start --network=devnet --api-ws --api-ws-host=0.0.0.0 --api-ws-port=8080 --enable-http-api-plugin >lisk-core.out 2>lisk-core.err &
								echo $! >lisk-core.pid

								# wait for core to be up and running
								set -e; while ! curl --silent --fail http://127.0.0.1:4000/api/node/info >/dev/null; do echo waiting; sleep 10; done; set +e
								curl --verbose http://127.0.0.1:4000/api/node/info

								# lisk-service
								cp -f lisk-service/docker/example.env lisk-service/.env
								# magic value for the above snapshot
								echo GENESIS_HEIGHT=250 >>lisk-service/.env
								make -C lisk-service up

								# workaround for https://github.com/LiskHQ/lisk-service/issues/916
								# until https://github.com/LiskHQ/lisk-service/issues/920 is resolved
								docker exec --user root lisk-service_core_1 mkdir -p /home/lisk/lisk-service/export/data/static
								docker exec --user root lisk-service_core_1 mkdir -p /home/lisk/lisk-service/export/data/partials
								docker exec --user root lisk-service_core_1 chown lisk:lisk -R /home/lisk/lisk-service/export/data

								# wait for service to be up and running
								set -e; while ! curl --silent --fail http://127.0.0.1:9901/api/v2/blocks >/dev/null; do echo waiting; sleep 10; done; set +e
								curl --verbose http://127.0.0.1:9901/api/v2/blocks
								set -e; while ! curl --silent --fail http://127.0.0.1:9901/api/v2/network/status >/dev/null; do echo waiting; sleep 10; done; set +e
								curl --verbose http://127.0.0.1:9901/api/v2/network/status
								curl --verbose http://127.0.0.1:9901/api/v2/blocks

								CYPRESS_baseUrl=https://jenkins.lisk.com/test/${JOB_NAME%/*}/$BRANCH_NAME/#/ \
								CYPRESS_serviceUrl=http://127.0.0.1:9901 \
								npm run cypress:run
								'''
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
					archiveArtifacts artifacts: 'tests/cypress/screenshots/', allowEmptyArchive: true
				}
				always {
					sh '''
					# lisk-service
					make -C lisk-service logs
					make -C lisk-service down

					# lisk-core
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
