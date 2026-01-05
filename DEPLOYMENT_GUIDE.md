# Deployment Guide

This guide describes how to deploy the backend to a Kubernetes cluster and the frontend to Vercel.

## Prerequisites
- **Kubernetes Cluster**: A running cluster (e.g., Docker Desktop, Minikube).
- **kubectl**: CLI tool configured to talk to your cluster.
- **Vercel CLI**: For deploying the frontend (or use the Vercel GitHub integration).
- **Drive D:/**: The backend uses `D:/` for persistent storage (configured in `backend/k8s/storage.yaml`). Ensure this drive exists and is shared/mountable by your K8s environment (e.g., in Docker Desktop settings > Resources > File Sharing).

## Backend Deployment (Kubernetes)

### 1. Build Docker Image
Build the backend image locally (if using a local cluster like Minikube/Docker Desktop, you might not need to push if you set `imagePullPolicy: Never` or `IfNotPresent` and build in the right context).

```bash
cd backend
docker build -t backend:latest .
```

### 2. Configure Secrets
The file `backend/k8s/secrets.yaml` contains placeholder values. Edit it with real secrets before applying, or create the secret manually:

```bash
kubectl apply -f backend/k8s/secrets.yaml
```

**TLS Secret**:
To enable TLS for Ingress, you need a secret named `backend-tls`. You can generate a self-signed one for testing:

```bash
openssl req -x509 -nodes -days 365 -newkey rsa:2048 -keyout tls.key -out tls.crt -subj "/CN=backend.local"
kubectl create secret tls backend-tls --key tls.key --cert tls.crt
```

### 3. Deploy
Apply all manifests in the `backend/k8s` directory:

```bash
kubectl apply -f backend/k8s/
```

This will create:
- **PersistentVolume & PVC**: Maps to `D:\k8s_data` (ensure Docker has permission).
- **MongoDB**: Deployment + Service.
- **Backend**: Deployment + Service + HPA.
- **Ingress**: Routes `backend.local` to the backend service.

### 4. Verify
```bash
kubectl get pods
kubectl get svc
kubectl get ingress
```

Add `127.0.0.1 backend.local` to your `C:\Windows\System32\drivers\etc\hosts` file to access the backend via `https://backend.local`.

## Frontend Deployment (Vercel)

The frontend is designed to be deployed on Vercel.

### Option A: Vercel CLI
1. Install Vercel CLI: `npm i -g vercel`
2. Deploy:
   ```bash
   cd frontend
   vercel
   ```
3. Follow the prompts. Set the environment variable `NEXT_PUBLIC_API_GATEWAY_URL` to your production backend URL (e.g., `https://backend.example.com` or your `ngrok` tunnel if testing locally).

### Option B: GitHub Integration
1. Push your code to GitHub.
2. Go to [Vercel Dashboard](https://vercel.com/dashboard) -> Add New -> Project.
3. Import your repository.
4. Configure Build Settings:
   - Framework: Next.js (detected automatically).
   - Environment Variables:
     - `NEXT_PUBLIC_API_GATEWAY_URL`: The URL of your deployed backend.

## CI/CD
A GitHub Actions workflow is provided in `.github/workflows/deploy.yml` which builds and pushes the backend image to GitHub Container Registry on push to `main`.
