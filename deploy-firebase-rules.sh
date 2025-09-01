#!/bin/bash

# Script to deploy Firebase security rules

echo "🚀 Deploying Firebase security rules..."

# Check if Firebase CLI is installed
if ! command -v firebase &> /dev/null
then
    echo "❌ Firebase CLI is not installed"
    echo "Please install it with: npm install -g firebase-tools"
    exit 1
fi

# Check if user is logged in
echo "Checking Firebase login status..."
firebase login --interactive

# Deploy Firestore rules
echo "Deploying Firestore security rules..."
firebase deploy --only firestore:rules

if [ $? -eq 0 ]
then
    echo "✅ Firestore security rules deployed successfully!"
else
    echo "❌ Failed to deploy Firestore security rules"
    exit 1
fi

echo "🎉 Firebase setup complete!"