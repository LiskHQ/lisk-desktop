@Library('lisk-jenkins') _

properties([disableConcurrentBuilds(), pipelineTriggers([])])
pipeline {
	agent { node { label 'lisk-hub' } }
	options {
		skipDefaultCheckout true
	}
	stages {
		stage('Clean workspace and checkout SCM') {
			steps {
				deleteDir()
				checkout scm
			}
		}
		stage('Install npm dependencies') {
			steps {
				script {
					// TODO: switch to 'npm ci' (npm >= 5.7.1)
					// see https://blog.npmjs.org/post/171556855892/introducing-npm-ci-for-faster-more-reliable
					cache_file = restoreCache("package.json")
					sh 'npm install'
					saveCache(cache_file, './node_modules', 10)
				}
			}
		}
		stage('Build') {
			steps {
				parallel (
					"ESLint": {
						ansiColor('xterm') {
							sh '''
							npm run --silent clean-build
							npm run --silent copy-files
							npm run --silent eslint
							'''
						}
					},
					"build": {
						withCredentials([string(credentialsId: 'github-lisk-token', variable: 'GH_TOKEN')]) {
							sh '''
							npm run --silent build
							npm run --silent build:testnet
							npm run --silent bundlesize

							if [ -z $CHANGE_BRANCH ]; then
							    USE_SYSTEM_XORRISO=true npm run dist:linux
							else
							    echo "Skipping desktop build for Linux because we're building a PR."
							fi
							'''
						}
						archiveArtifacts artifacts: 'app/build/'
						archiveArtifacts artifacts: 'app/build-testnet/'
						archiveArtifacts allowEmptyArchive: true, artifacts: 'dist/lisk-hub*'
						stash includes: 'app/build/', name: 'build'
					}
				)
			}
		}
		stage('Deploy build') {
			agent { node { label 'master-01' } }
			steps {
					unstash 'build'
					sh 'rsync -axl --delete $WORKSPACE/app/build/ /var/www/test/${JOB_NAME%/*}/$BRANCH_NAME/'
					githubNotify context: 'Jenkins test deployment',
					             description: 'Commit was deployed to test',
						     status: 'SUCCESS',
						     targetUrl: "${HUDSON_URL}test/" + "${JOB_NAME}".tokenize('/')[0] + "/${BRANCH_NAME}"

			}
		}
		stage('Run tests') {
			steps {
				parallel (
					"mocha": {
						sh 'ON_JENKINS=true npm run --silent test'
						sh 'ON_JENKINS=true npm run --silent test'
						withCredentials([string(credentialsId: 'lisk-hub-coveralls-token', variable: 'COVERALLS_REPO_TOKEN')]) {
							sh 'cat coverage/HeadlessChrome*/lcov.info |coveralls -v'
						}
					},
					"jest": {
						ansiColor('xterm') {
							sh 'ON_JENKINS=true npm run --silent test-jest'
							
							// TODO: uncomment sending coverage to coveralls when 
							// all tests are migrated from mocha to jest
							// withCredentials([string(credentialsId: 'lisk-hub-coveralls-token', variable: 'COVERALLS_REPO_TOKEN')]) {
								//	sh 'cat coverage/HeadlessChrome*/lcov.info |coveralls -v'
							// }
						}
					},
					"cypress": {
						withCredentials([string(credentialsId: 'lisk-hub-testnet-passphrase', variable: 'TESTNET_PASSPHRASE')]) {
							ansiColor('xterm') {
								wrap([$class: 'Xvfb', parallelBuild: true, autoDisplayName: true]) {
									sh '''
									export N=${EXECUTOR_NUMBER:-0}; N=$((N+1))

									wget -nv -c https://github.com/LiskHQ/lisk-docker/archive/2.2.0.tar.gz
									rm -rf $WORKSPACE/$BRANCH_NAME/
									mkdir -p $WORKSPACE/$BRANCH_NAME/
									tar xf 2.2.0.tar.gz -C $WORKSPACE/$BRANCH_NAME/ --strip-component=2 lisk-docker-2.2.0/examples/
									cp $WORKSPACE/test/blockchain.db.gz $WORKSPACE/$BRANCH_NAME/dev_blockchain.db.gz
									cd $WORKSPACE/$BRANCH_NAME
									cp .env.development .env
									LISK_VERSION=1.1.0-alpha.8 make coldstart
									export CYPRESS_baseUrl=http://127.0.0.1:300$N/#/
									export CYPRESS_coreUrl=http://127.0.0.1:$( docker-compose port lisk 4000 |cut -d ":" -f 2 )
									cd -

									npm run serve -- $WORKSPACE/app/build -p 300$N -a 127.0.0.1 &>server.log &
									npm run cypress:run -- --record
									'''
								}
							}
						}
					}
				)
			}
		}
	}
	post {
		always {
			ansiColor('xterm') {
				sh '( cd $WORKSPACE/$BRANCH_NAME && make mrproper || true ) || true'
			}
			cobertura autoUpdateHealth: false,
				  autoUpdateStability: false,
				  coberturaReportFile: 'coverage/*/cobertura-coverage.xml',
				  conditionalCoverageTargets: '70, 0, 0',
				  failUnhealthy: false,
				  failUnstable: false,
				  fileCoverageTargets: '100, 0, 0',
				  lineCoverageTargets: '80, 0, 0',
				  maxNumberOfBuilds: 0,
				  methodCoverageTargets: '80, 0, 0',
				  onlyStable: false,
				  sourceEncoding: 'ASCII'
			junit 'reports/junit_report.xml'
		}
		success {
			script {
				previous_build = currentBuild.getPreviousBuild()
				if (previous_build != null && previous_build.result == 'FAILURE') {
					build_info = getBuildInfo()
					liskSlackSend('good', "Recovery: build ${build_info} was successful.")
				}
			}
		}
		failure {
			script {
				build_info = getBuildInfo()
				liskSlackSend('danger', "Build ${build_info} failed (<${env.BUILD_URL}/console|console>, <${env.BUILD_URL}/changes|changes>)")
			}
		}
	}
}
