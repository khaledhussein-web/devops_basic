pipeline {
  agent any

  stages {
    stage('Test (docker-compose)') {
      steps {
        sh 'bash scripts/test.sh'
      }
    }
  }

  post {
    always {
      sh 'docker compose down -v || true'
    }
  }
}
