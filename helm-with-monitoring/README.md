# TaskOps with Monitoring 📊

Complete TaskOps deployment with Prometheus, Grafana, and Loki monitoring stack.

## 🚀 Quick Deploy

```bash
# One-click deployment
./deploy.sh
```

## 🌐 Access URLs

- **Frontend**: http://192.168.49.2:30001
- **API**: http://192.168.49.2:30400  
- **Grafana**: http://192.168.49.2:30300 (admin/admin123)
- **Prometheus**: http://192.168.49.2:30301

## 📦 What's Included

- **TaskOps App**: Frontend + API + MongoDB
- **Prometheus**: Metrics collection
- **Grafana**: Dashboards and visualization
- **Loki**: Log aggregation
- **Promtail**: Log collection agent

## 🛠️ Manual Deploy

```bash
# Add repos
helm repo add prometheus-community https://prometheus-community.github.io/helm-charts
helm repo add grafana https://grafana.github.io/helm-charts
helm repo update

# Install monitoring
helm dependency update monitoring/
helm install monitoring ./monitoring -n monitoring --create-namespace

# Install app
helm install taskops ./taskops -n taskops --create-namespace --set monitoring.enabled=true
```

## 📊 Monitor Your App

1. **Metrics**: View in Grafana dashboards
2. **Logs**: Search in Grafana Explore
3. **Alerts**: Configure in Prometheus

## 🧹 Cleanup

```bash
helm uninstall taskops -n taskops
helm uninstall monitoring -n monitoring
kubectl delete namespace taskops monitoring
```