pipeline {
    agent any
    // this tool will be used for all stages/steps except over-written
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
        stage('Upload') {
            steps {
                sh 'rm -rf .gitignore .git Jenkinsfile'
                script {
                    def packageFile = readJSON file: 'package.json'
                    sh "tar -cvjf /var/www/html/dl.gawati.org/dev/portal-server-${packageFile.version}.tbz ."
                    sh "zip -r /var/www/html/dl.gawati.org/dev/portal-server-${packageFile.version}.zip ."
                }
            }
        }
       stage('Clean') {
        steps {
          cleanWs(cleanWhenAborted: true, cleanWhenNotBuilt: true, cleanWhenSuccess: true, cleanWhenUnstable: true, cleanupMatrixParent: true, deleteDirs: true)
        }
       }
    }
}
