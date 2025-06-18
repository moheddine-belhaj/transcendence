#!/bin/bash

# -------------------------------
# ILM Setup Script for ELK Stack
# -------------------------------

# Load environment variables (optional)
if [ -f .env ]; then
  source .env
fi

# Check CA cert exists
if [ ! -f "$CA_CERT" ]; then
  echo "❌ CA certificate not found at $CA_CERT. Please check the path."
  exit 1
fi

# Wait for Elasticsearch to be up
echo "⏳ Waiting for Elasticsearch to be available..."
until curl -s --cacert "$CA_CERT" -u "$ELASTIC_USER:$ELASTIC_PASSWORD" "$ES_HOST" | grep -q "cluster_name"; do
  sleep 5
done
echo "✅ Elasticsearch is available."

# Create ILM policy
echo "📦 Creating ILM policy 'logs_policy'..."
curl -s --cacert "$CA_CERT" -u "$ELASTIC_USER:$ELASTIC_PASSWORD" -X PUT "$ES_HOST/_ilm/policy/logs_policy" \
  -H "Content-Type: application/json" \
  -d '{
    "policy": {
      "phases": {
        "hot": {
          "actions": {
            "rollover": {
              "max_size": "5gb",
              "max_age": "7d"
            }
          }
        },
        "delete": {
          "min_age": "90d",
          "actions": {
            "delete": {}
          }
        }
      }
    }
  }'
echo "✅ ILM policy created."

# Create index template with data stream
echo "🧩 Creating index template 'logs_template'..."
curl -s --cacert "$CA_CERT" -u "$ELASTIC_USER:$ELASTIC_PASSWORD" -X PUT "$ES_HOST/_index_template/logs_template" \
  -H "Content-Type: application/json" \
  -d '{
    "index_patterns": ["logs"],
    "data_stream": {},
    "priority": 500,
    "template": {
      "settings": {
        "number_of_shards": 1,
        "number_of_replicas": 1,
        "index.lifecycle.name": "logs_policy"
      }
    }
  }'
echo "✅ Index template created."

# Short wait for template to be available (usually immediate)
echo "⏳ Short pause for template propagation..."
sleep 5

# Create data stream
echo "📈 Creating data stream 'logs'..."
curl -s --cacert "$CA_CERT" -u "$ELASTIC_USER:$ELASTIC_PASSWORD" -X PUT "$ES_HOST/_data_stream/logs"
echo "✅ Data stream created."

# Insert a test document
echo "📝 Inserting test document..."
curl -s --cacert "$CA_CERT" -u "$ELASTIC_USER:$ELASTIC_PASSWORD" -X POST "$ES_HOST/logs/_doc" \
  -H "Content-Type: application/json" \
  -d '{
    "@timestamp": "'"$(date --utc +%FT%TZ)"'",
    "message": "Test log from ILM script"
  }'
echo "✅ Test document inserted."

echo "🎉 ILM setup completed."

# Keep container running if needed
while true; do sleep 3600; done