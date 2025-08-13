#!/bin/sh
set -e

echo "Starting entrypoint script..."

# Check if config.js exists
if [ ! -f "/app/out/config.js" ]; then
  echo "ERROR: /app/out/config.js file not found!"
  echo "Contents of /app/out directory:"
  ls -la /app/out
  exit 1
fi

echo "Original config.js content:"
cat /app/out/config.js

# Replace the API URLs in the config.js file
if [ ! -z "$AUTH_API_URL" ]; then
  echo "Updating AUTH_API_URL to $AUTH_API_URL"
  sed -i "s|http://localhost:9193/api/v1|$AUTH_API_URL|g" /app/out/config.js
  if [ $? -ne 0 ]; then
    echo "ERROR: Failed to update AUTH_API_URL in config.js"
    exit 1
  fi
else
  echo "WARNING: AUTH_API_URL environment variable not set"
fi

if [ ! -z "$TASK_API_URL" ]; then
  echo "Updating TASK_API_URL to $TASK_API_URL"
  sed -i "s|http://localhost:9191/api/v1|$TASK_API_URL|g" /app/out/config.js
  if [ $? -ne 0 ]; then
    echo "ERROR: Failed to update TASK_API_URL in config.js"
    exit 1
  fi
else
  echo "WARNING: TASK_API_URL environment variable not set"
fi

echo "Updated config.js content:"
cat /app/out/config.js

echo "Entrypoint script completed, starting application..."

# Execute the command passed to the script
exec "$@"
