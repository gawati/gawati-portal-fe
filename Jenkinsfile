pipeline {
    agent any
    // this tool will be used for all stages/steps except over-written
    tools {nodejs "nodejs-lts"}

     
    stages {
        stage('Setup') {
            steps {
                script {
                    def packageFile = readJSON file: 'package.json'
                }
                sh 'pwd'
                sh 'npm --version'
                sh 'node -v'
                sh 'npm install'
                sh "echo Package version is ${packageFile.version} $packageFile.version"
                sh "tar -cvjf /var/www/html/dl.gawati.org/dev/portal-server-${packageFile.version}.tbz ."
            }
        }
       stage('Clean') {
        steps {
          cleanWs(cleanWhenAborted: true, cleanWhenNotBuilt: true, cleanWhenSuccess: true, cleanWhenUnstable: true, cleanupMatrixParent: true, deleteDirs: true)
        }
       }
    }
}
