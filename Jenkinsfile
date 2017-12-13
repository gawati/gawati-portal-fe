pipeline {
    agent any
    // this tool will be used for all stages/steps except over-written
    tools {nodejs "nodejs-lts"}

     
    stages {
        stage('Setup') {
            steps {
                sh 'pwd'
                sh 'npm --version'
                sh 'node -v'
                sh 'npm install'
                script {
                    def packageFile = readJSON file: 'package.json'
                    version = packageFile.version
                    sh "set"
                    sh "echo Package version is $version"
                    sh "echo Package version is ${version}"
                    sh "echo Package version is $packageFile.version"
                    sh "echo Package version is ${packageFile.version}"
                    sh "tar -cvjf /var/www/html/dl.gawati.org/dev/portal-server-${packageFile.version}.tbz ."
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
