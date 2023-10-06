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
                                yarn run build

                                # locally serve build
                                nohup npx serve -l 8081 ./app/buildE2E >serve.out 2>serve.err &
                                '''
                            }
						}
						stash includes: 'app/buildE2E/', name: 'buildE2E'
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
		stage('test') {
			steps {
				parallel (
					//service and core setup
					"service-setup": {
						dir('lisk-service') {
							checkout([$class: 'GitSCM', branches: [[name: params.SERVICE_BRANCH_NAME ]], userRemoteConfigs: [[url: 'https://github.com/LiskHQ/lisk-service']]])
						}
						nvm(getNodejsVersion()) {
							wrap([$class: 'Xvfb']) {
								sh '''
								# create a copy instance for enevti
								ls -a
								cp -r lisk-service enevti-service

								# lisk-core
								npm i -g lisk-core@^4.0.0-rc.3
								rm -rf ~/.lisk/
								lisk-core blockchain:import --force ./e2e/artifacts/blockchain.tar.gz
								nohup lisk-core start --network=devnet --api-ws --api-host=0.0.0.0 --config ./e2e/artifacts/lisk-core/config.json --overwrite-config >lisk-core.out 2>lisk-core.err &
								echo $! >lisk-core.pid

								# lisk-service
								cp -f lisk-service/docker/example.env lisk-service/.env
								echo LISK_APP_WS=ws://host.docker.internal:7887 >>lisk-service/.env
								make -C lisk-service build
								make -C lisk-service up

								# enevti-core
								curl -O https://lisk-qa.ams3.digitaloceanspaces.com/enevti-core-desktop.tar.gz
								tar -xf enevti-core-desktop.tar.gz
								rm -rf ~/.enevti
								cd ./enevti-core
								npm install
								./bin/run --help
								./bin/run blockchain import --force ./e2e/artifacts/enevti-core/blockchain.tar.gz
								nohup ./bin/run start --network=devnet --api-ws --api-host=0.0.0.0 --api-host=8887 >enevti-core.out 2>enevti-core.err &
								echo $! >enevti-core.pid

								# enevti-service
								cp -f enevti-service/docker/example.env enevti-service/.env
								echo LISK_APP_WS=ws://host.docker.internal:8887 >>enevti-service/.env
								echo PORT=9902 >>enevti-service/.env
								make -C enevti-service build
								make -C enevti-service up

								## logs (for debug purpose only)
								# cat lisk-core.out
								# echo "===== core error ===="
								# cat lisk-core.err
								# echo "======== service ======="
								# docker ps

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
					},
					// jest
					"unit": {
						nvm(getNodejsVersion()) {
							sh 'ON_JENKINS=true yarn run test'
						}
					},
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
