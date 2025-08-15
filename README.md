# TaskOps 
![Kubernetes](https://img.shields.io/badge/Kubernetes-326CE5?style=for-the-badge&logo=kubernetes&logoColor=white)
![Helm](https://img.shields.io/badge/Helm-0F1689?style=for-the-badge&logo=helm&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white)
![Prometheus](https://img.shields.io/badge/Prometheus-E6522C?style=for-the-badge&logo=prometheus&logoColor=white)
![Grafana](https://img.shields.io/badge/Grafana-F46800?style=for-the-badge&logo=grafana&logoColor=white)
![Loki](https://img.shields.io/badge/Loki-F46800?style=for-the-badge&logo=grafana&logoColor=white)
![GitHub Actions](https://img.shields.io/badge/GitHub_Actions-2088FF?style=for-the-badge&logo=github-actions&logoColor=white)

---

A microservices-based task management app designed as a personal DevOps playground.
Explore and practice cloud-native technologies including Kubernetes, Helm, CI/CD, observability, and more.

## 🎯 Learning Goals

- Kubernetes fundamentals (pods, deployments, services)
- Helm charts and package management
- CI/CD pipelines with GitHub Actions
- Observability with Prometheus, Grafana, and Loki
- Microservices architecture patterns
- 12-Factor App practices


## Infrastructure

<p align="center"> <img src="assets/infrasturture.png" alt="Image Gallery App" width="600"> </p>


## 📁 Project Structure

```
taskOps/
├── app/                    # Docker Compose setup
├── k8/                     # Kubernetes manifests
├── helm/                   # Basic Helm chart
├── helm-with-monitoring/   # Helm + Prometheus + Grafana + Loki
├── services/
│   ├── identity/          # Java Spring Boot service
│   └── identity-ts/       # Node.js TypeScript version
└── .github/workflows/     # CI/CD pipelines
```




## 🚀 Quick Start

### 🐳 Simple Todo App
```bash
cd app/
```
📖 **[See app/README.md](app/README.md)** for detailed setup instructions

### ☸️ Kubernetes Deployment
```bash
cd k8/
```
📖 **[See k8/README.md](k8/README.md)** for Kubernetes deployment guide

### 📊 Full Monitoring Stack
```bash
cd helm-with-monitoring/
```
📖 **[See helm-with-monitoring/README.md](helm-with-monitoring/README.md)** for complete monitoring setup





---

*Built for learning, experimenting, and having fun with DevOps tools! 🎉*