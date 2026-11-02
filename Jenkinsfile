
pipeline {
    agent any

    stages {
        stage('Checkout Source') {
            steps {
                checkout scm
            }
        }
        stage('Secret Scanning - Gitleaks') {
            steps {
                bat '"C:\\Users\\neeha\\AppData\\Local\\Microsoft\\WinGet\\Packages\\Gitleaks.Gitleaks_Microsoft.Winget.Source_8wekyb3d8bbwe\\gitleaks.exe" git . --redact'
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

        stage('Deploy to GKE') {
            steps {
                withCredentials([file(
                    credentialsId: 'gcp-service-account',
                    variable: 'GCP_KEY'
                )]) {
                    bat '''
                    docker run --rm ^
                      -v "%GCP_KEY%:/tmp/gcp-key.json:ro" ^
                      gke-deployer-tools:1.0 ^
                      /bin/bash -c "gcloud auth activate-service-account --key-file=/tmp/gcp-key.json --project=wanderlust-devops-cia2 && gcloud container clusters get-credentials autopilot-cluster-1 --region=asia-south1 --project=wanderlust-devops-cia2 && kubectl set image deployment/wanderlust wanderlust=asia-south1-docker.pkg.dev/wanderlust-devops-cia2/wanderlust-repo/wanderlust:1.2 -n wanderlust && kubectl rollout status deployment/wanderlust -n wanderlust --timeout=180s"
                    '''
                }
            }
        }
    }

    post {
        success {
            echo 'Build, tests and image publishing completed successfully!'
        }

        failure {
            echo 'Pipeline failed. Check the stage logs.'
        }
    }
}
