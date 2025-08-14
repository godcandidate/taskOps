# TaskOps Kubernetes Deployment

Deploy TaskOps todo app to Kubernetes cluster.

## Quick Deploy

**Option 1: Deploy everything at once**
```bash
# Create namespace
kubectl create namespace taskops

# Deploy all resources
kubectl apply -f . -n taskops
```

**Option 2: Ordered deployment (recommended)**
```bash
# Create namespace
kubectl create namespace taskops

# 1. Create storage and config
kubectl apply -f volumes/ -f config/ -n taskops

# 2. Deploy database
kubectl apply -f deployments/tasksops-mongodb-deploy.yaml -f services/taskops-mongodb-service.yaml -n taskops

# 3. Deploy API
kubectl apply -f deployments/taskops-api-deploy.yaml -f services/taskops-api-service.yaml -n taskops

# 4. Deploy UI
kubectl apply -f deployments/taskops-ui-deploy.yaml -f services/taskops-ui-service.yaml -n taskops
```

## Check Deployment

```bash
# Check all resources
kubectl get all -n taskops

# Check pods status
kubectl get pods -n taskops

# Check services
kubectl get svc -n taskops

# Check persistent volume
kubectl get pvc -n taskops
```

## Access Application

```bash
# Port forward to access locally
kubectl port-forward svc/taskops-ui 3000:80 -n taskops
kubectl port-forward svc/taskops-api 4000:4000 -n taskops
```

**Access URLs:**
- Frontend: http://localhost:3000
- Backend API: http://localhost:4000

## Troubleshooting

```bash
# Check pod logs
kubectl logs -f deployment/taskops-ui -n taskops
kubectl logs -f deployment/taskops-api -n taskops
kubectl logs -f deployment/taskops-mongodb -n taskops

# Describe resources
kubectl describe pod <pod-name> -n taskops
```

## Cleanup

```bash
# Delete all resources
kubectl delete namespace taskops
```