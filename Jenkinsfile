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
		cleanup {
			ansiColor('xterm') {
				sh '( cd $WORKSPACE/$BRANCH_NAME && make mrproper || true ) || true'
			}
			cleanWs()
		}
	}
}
// vim: filetype=groovy
