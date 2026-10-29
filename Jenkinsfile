
pipeline {
    agent any

    stages {
        stage('Checkout Source') {
            steps {
                checkout scm
            }
        }

        stage('Install Dependencies') {
            steps {
                bat 'npm ci'
            }
        }

        stage('Run Automated Tests') {
            steps {
                bat 'npm test'
            }
        }
        stage('Build Docker Image') {
            steps {
                
                bat 'docker build -t kneeharika27/wanderlust-devops-cia2:1.0 .'
            }
        }
        
        stage('Push Docker Image') {
            steps {
                withCredentials([usernamePassword(
                    credentialsId: 'dockerhub-cred',
                    usernameVariable: 'DOCKER_USER',
                    passwordVariable: 'DOCKER_PASS'
                )]) {
                    bat 'docker login -u %DOCKER_USER% -p %DOCKER_PASS%'
                    bat 'docker push kneeharika27/wanderlust-devops-cia2:1.0'
                }
            }
        }
    }

    post {
        success {
            echo 'Checkout, dependency installation and tests completed!'
        }

        failure {
            echo 'Pipeline failed. Check the stage logs.'
        }
    }
}
