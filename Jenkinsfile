pipeline {
    agent any

    tools {nodejs "nodejs-lts"}

    stages {
        stage('Prerun Diag') {
            steps {
                sh 'pwd'
            }
        }
        stage('Setup') {
            steps {
                sh 'npm --version'
                sh 'node -v'
                sh 'npm install'
            }
        }
        stage('Build') {
            steps {
                script {
                    sh '''
wget -qO- http://dl.gawati.org/dev/jenkinslib-latest.tbz | tar -xvjf -
. ./jenkinslib.sh
echo -n "${JenkinsJson}" >jenkins.json
makebuild
'''
                }
            }
        }
        stage('Upload') {
            steps {
                script {
                    sh '''
. ./jenkinslib.sh
cd build
PkgPack
PkgLinkLatest
'''
                }
            }
        }
       stage('Clean') {
        steps {
          cleanWs(cleanWhenAborted: true, cleanWhenNotBuilt: true, cleanWhenSuccess: true, cleanWhenUnstable: true, cleanupMatrixParent: true, deleteDirs: true)
        }
       }
    }

    post {
        always {
            slackSend (message: "${currentBuild.currentResult}: Job '${env.JOB_NAME} [${env.BUILD_NUMBER}]' (${env.BUILD_URL})")
        }
        failure {
            slackSend (channel: '#failure', message: "${currentBuild.currentResult}: Job '${env.JOB_NAME} [${env.BUILD_NUMBER}]' (${env.BUILD_URL})")
        }
        unstable {
            slackSend (channel: '#failure', message: "${currentBuild.currentResult}: Job '${env.JOB_NAME} [${env.BUILD_NUMBER}]' (${env.BUILD_URL})")
        }
    }
}
