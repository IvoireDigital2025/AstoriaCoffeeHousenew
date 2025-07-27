#!/bin/bash

# Railway deployment script for Coffee Pro
# This script handles the database migration after Railway deployment

echo "🚀 Starting Coffee Pro deployment process..."

# Wait for database to be ready
echo "⏳ Waiting for database connection..."
sleep 10

# Run database migration
echo "📋 Running database migration..."
npm run db:push

echo "✅ Coffee Pro deployment completed successfully!"