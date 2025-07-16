# React + Vite Frontend (frontend-voice-ui/)

# Requirements:

- Node.js ≥ 18
- npm


# Create the frontend scaffold:
```
cd C:\Users\Gebruiker\Documents\ai4m\laboratory\jupyter_notebook\livekit-step-by-step

npm create vite@latest frontend-voice-ui --template react
```
**Attention**
This command is outdated and has been replaced by

```
create-vite frontend-voice-ui
    Select a framework: React
    Select a variant: TypeScript
```
# Install and run scaffold:
```
cd frontend-voice-ui
npm install
npm run dev
```
the frontend scaffold is now available at [http://localhost:5173/](http://localhost:5173/)

this is a excellent [documentation](https://codeparrot.ai/blogs/a-beginners-guide-to-using-vite-react) about Vite&React

# Install LiveKit client:
```
npm install livekit-client
```

# git and github:
```
git init
git remote add origin https://github.com/yourusername/livekit-step-by-step-frontend-voice-ui.git
git add .
git commit -m "Initial commit: frontend scaffold Vite-React-TypeScript and npm install livekit-client"
git branch -M main
git push -u origin main
```

# frontend-voice-ui/src/App.tsx (basic setup):
```
...
const LIVEKIT_URL = 'wss://your-livekit-server.com'; // e.g. from Cloud or self-hosted
const TOKEN_ENDPOINT = 'http://localhost:8000/token'; // change when deploying
...
```

# Install and run
## Run Token Server in its environment
```
cd C:\Users\Gebruiker\Documents\ai4m\laboratory
.venv_livekit_step_by_step\scripts\activate
cd C:\Users\Gebruiker\Documents\ai4m\laboratory\jupyter_notebook\livekit-step-by-step\backend-token-server
uvicorn livekit_token_server:app --reload --host 0.0.0.0 --port 8000
```

Test Token Server via [http://localhost:8000/token?identity=alice&room=test-room](http://localhost:8000/token?identity=alice&room=test-room)

## Run frontend
```
cd frontend-voice-ui
npm install
npm run dev
```

Access frontend via [http://localhost:5173/](http://localhost:5173/)

## Deployment
**Deployment**
**Step 1: Deployment of backend on Render**
```
See README.md of backend
See [https://dashboard.render.com/](https://dashboard.render.com/)
We get the endpoint of the [Token Server](https://livekit-step-by-step-backend-token-server.onrender.com)
```
**Step 2: Deployment of frontend on Netlify**
```
Push frontend repo to github
Go to https://netlify.com, click “Add New Project → Import from Git”
Publish directory: dist
Add the .env vars VITE_LIVEKIT_URL and VITE_TOKEN_ENDPOINT in the Netlify environment variables UI
We can use the Render endpoint of Step 1 for the VITE_TOKEN_ENDPOINT (do not forget .../token)
See [https://app.netlify.com/projects/livekit-frontend-voice-ui/overview](https://app.netlify.com/projects/livekit-frontend-voice-ui/overview)
We will get the public Netlify endpoint.
```
**Step 3: Rebuild the backend on Render**
```
See README.md of the backend
We can set ALLOWED_ORIGINS using the Netlify endpoint.
```

# Run frontend (production)

Run [https://livekit-frontend-voice-ui.netlify.app/](https://livekit-frontend-voice-ui.netlify.app/)
Always check console in DevTools (inspect)