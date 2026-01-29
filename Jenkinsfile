pipeline {
    agent any

    environment {
        VITE_GOOGLE_API_KEY = credentials('vite-google-api-key')
        DOCKER_IMAGE = "kts-user"
        DOCKER_USERNAME="kavinduorg"
        DOCKERHUB_PASS=credentials('dockerhub-pass')
        DEPLOY_TOKEN=credentials('deploy-token')
        DEPLOY_SERVER_IP = "10.0.101.197"
    }

    stages{
        stage('Build'){
            agent{
                docker{
                    image 'node:22-alpine'
                    reuseNode true
                    args '-u root' 
                }
            }
            steps{
                sh '''
                    npm install
                    npm run build
                '''
            }
        }

        stage('Test') {
            steps {
                sh '''
                    echo "Running tests..."
                '''
            }
        }

        stage('SonarQube Analysis') {
            steps {
                script {
                    def scannerHome = tool 'SonarQubeScanner'
                    withSonarQubeEnv('sonarqube') {
                        sh """
                            ${scannerHome}/bin/sonar-scanner
                        """
                    }
                }
            }
        }

        stage('Quality Gate') {
            steps {
                timeout(time: 1, unit: 'HOURS') {
                    waitForQualityGate abortPipeline: true
                }
            }
        }

         stage('Build Docker Image') {
            steps {
                sh '''
                docker build -f Dockerfile.prod -t $DOCKER_USERNAME/$DOCKER_IMAGE:latest  --build-arg VITE_GOOGLE_API_KEY=$VITE_GOOGLE_API_KEY .              
                '''
            }
        }

        stage('Login to Docker Hub') {
            steps {
                
                sh '''
                 echo $DOCKERHUB_PASS | docker login -u $DOCKER_USERNAME --password-stdin
                '''
                
            }
        }

        stage('Push Image to Docker Hub') {
            steps {
                sh '''
                docker push $DOCKER_USERNAME/$DOCKER_IMAGE:latest 
                '''
            }
        }

        // curl exits with exit code 0 if the HTTP response code is 2xx or 3xx
        // and with exit error code 22 for 4xx or 5xx responses
        stage('Deploy') {
            steps {
                sh '''
                curl --fail -X POST http://$DEPLOY_SERVER_IP:3000/user-deploy \
                    -H "x-deploy-token: $DEPLOY_TOKEN"
                ''' 
            }
        }


    }

     post {
        always {
             sh '''
            docker logout || true
            docker rmi $DOCKER_USERNAME/$DOCKER_IMAGE:latest || true
            '''
        }
    }
}

