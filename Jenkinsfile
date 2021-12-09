@Library('lisk-jenkins') _

properties([disableConcurrentBuilds(), pipelineTriggers([])])
pipeline {
	agent { node { label 'lisk-desktop' } }
	stages {
		stage('install') {
			steps {
				nvm(getNodejsVersion()) {
					sh 'npm ci'
				}
			}
		}
		stage('build') {
			steps {
				parallel (
					"lint": {
						ansiColor('xterm') {
							nvm(getNodejsVersion()) {
								sh 'npm run lint'
							}
						}
					},
					"linux": {
						nvm(getNodejsVersion()) {
							sh '''
							cp -R /home/lisk/fonts/basier-circle src/assets/fonts
							cp -R /home/lisk/fonts/gilroy src/assets/fonts
							npm run build
							'''
						}
						stash includes: 'app/build/', name: 'build'
					}
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
					// cypress
					"end-to-end": {
						nvm(getNodejsVersion()) {
							ansiColor('xterm') {
								wrap([$class: 'Xvfb']) {
									sh 'CYPRESS_baseUrl=https://jenkins.lisk.com/test/${JOB_NAME%/*}/$BRANCH_NAME/#/ npm run cypress:run'
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
		}
	}
}
// vim: filetype=groovy
