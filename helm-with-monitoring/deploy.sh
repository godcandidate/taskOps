#!/bin/bash

echo "🚀 Deploying TaskOps with Monitoring..."

# Add Helm repositories
echo "📦 Adding Helm repositories..."
helm repo add prometheus-community https://prometheus-community.github.io/helm-charts
helm repo add grafana https://grafana.github.io/helm-charts
helm repo update

# Install monitoring stack
echo "📊 Installing monitoring stack..."
helm dependency update monitoring/
helm install monitoring ./monitoring -n monitoring --create-namespace

# Wait for monitoring to be ready
echo "⏳ Waiting for monitoring stack..."
kubectl wait --for=condition=ready pod -l app.kubernetes.io/name=grafana -n monitoring --timeout=300s

# Install TaskOps with monitoring enabled
echo "🛠️ Installing TaskOps..."
helm install taskops ./taskops -n taskops --create-namespace --set monitoring.enabled=true

echo "✅ Deployment complete!"
echo ""
echo "🌐 Access URLs:"
echo "  Frontend: http://192.168.49.2:30001"
echo "  API: http://192.168.49.2:30400"
echo "  Grafana: http://192.168.49.2:30300 (admin/admin123)"
echo "  Prometheus: http://192.168.49.2:30301"
echo ""
echo "📊 Check status:"
echo "  kubectl get pods -n monitoring"
echo "  kubectl get pods -n taskops"