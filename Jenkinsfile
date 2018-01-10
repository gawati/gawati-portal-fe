pipeline {
    agent any

    environment {
        // CI="false"
        DLD="/var/www/html/dl.gawati.org/dev"
        PKF="portal-server"
    }

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
                    sh "tar -cvjf $DLD/$PKF-${packageFile.version}.tbz ."
                    sh "zip -r - . > $DLD/$PKF-${packageFile.version}.zip"
                    sh "[ -L $DLD/$PKF-latest.zip ] && rm -f $DLD/$PKF-latest.zip ; exit 0"
                    sh "[ -e $DLD/$PKF-latest.zip ] || ln -s $PKF-${packageFile.version}.zip $DLD/$PKF-latest.zip"
                    sh "[ -L $DLD/$PKF-latest.tbz ] && rm -f $DLD/$PKF-latest.tbz ; exit 0"
                    sh "[ -e $DLD/$PKF-latest.tbz ] || ln -s $PKF-${packageFile.version}.tbz $DLD/$PKF-latest.tbz"
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
