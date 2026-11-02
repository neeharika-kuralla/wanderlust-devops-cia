
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
                bat 'docker build --load -t kneeharika27/wanderlust-devops-cia2:1.2 .'
            }
        }

        stage('Push Docker Image') {
            steps {
                withCredentials([usernamePassword(
                    credentialsId: 'dockerhub-creds',
                    usernameVariable: 'DOCKER_USER',
                    passwordVariable: 'DOCKER_PASS'
                )]) {
                    bat 'docker login -u %DOCKER_USER% -p %DOCKER_PASS%'
                    bat 'docker push kneeharika27/wanderlust-devops-cia2:1.2'
                }
            }
        }

        stage('Publish to Artifact Registry') {
            steps {
                withCredentials([file(
                    credentialsId: 'gcp-service-account',
                    variable: 'GCP_KEY'
                )]) {
                    bat '''
                    set "DOCKER_CONFIG=%WORKSPACE%\\.docker-auth"

                    docker login -u _json_key --password-stdin https://asia-south1-docker.pkg.dev < "%GCP_KEY%"

                    docker tag kneeharika27/wanderlust-devops-cia2:1.2 asia-south1-docker.pkg.dev/wanderlust-devops-cia2/wanderlust-repo/wanderlust:1.2

                    docker push asia-south1-docker.pkg.dev/wanderlust-devops-cia2/wanderlust-repo/wanderlust:1.2

                    docker logout https://asia-south1-docker.pkg.dev

                    if exist "%DOCKER_CONFIG%" rmdir /s /q "%DOCKER_CONFIG%"
                    '''
                }
            }
        }
    }

    post {
        always {
            bat 'if exist gcp-token.txt del /q gcp-token.txt'
        }

        success {
            echo 'Build, tests and image publishing completed successfully!'
        }

        failure {
            echo 'Pipeline failed. Check the stage logs.'
        }
    }
}
