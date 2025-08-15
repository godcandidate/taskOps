# TaskOps Helm Chart

Simple Helm chart for TaskOps todo application.

## Install

```bash
# Install chart
helm install taskops ./helm/taskops -n taskops --create-namespace

# Upgrade
helm upgrade taskops ./helm/taskops -n taskops

# Uninstall
helm uninstall taskops -n taskops
```

## Customize

Edit `helm/taskops/values.yaml` to change:
- Image tags
- Storage size
- URLs
- Replica count

## Validate

```bash
# Check templates
helm template taskops ./helm/taskops

# Dry run
helm install taskops ./helm/taskops --dry-run -n taskops
```