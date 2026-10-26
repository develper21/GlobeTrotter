pipeline {
    agent any

    environment {
        CI = 'true'
    }

    stages {
        stage('Build and test') {
            parallel {
                stage('Server') {
                    steps {
                        dir('server') {
                            sh 'npm ci'
                            sh 'npm run lint'
                            sh 'npm test -- --runInBand'
                            sh 'npm run build'
                        }
                    }
                }

                stage('Website') {
                    steps {
                        dir('website') {
                            sh 'npm ci'
                            sh 'npm run lint'
                            sh 'npm test'
                            sh 'npm run build'
                        }
                    }
                }
            }
        }
    }
}