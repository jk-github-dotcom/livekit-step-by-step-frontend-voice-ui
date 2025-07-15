# React + Vite Frontend (frontend-voice-ui/)

# Requirements:

- Node.js ≥ 18
- npm


# Create the frontend scaffold
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
# Install and run scaffold
```
cd frontend-voice-ui
npm install
npm run dev
```
the frontend scaffold is now available at [http://localhost:5173/](http://localhost:5173/)

this is a excellent [documentation](https://codeparrot.ai/blogs/a-beginners-guide-to-using-vite-react) about Vite&React

# Install LiveKit client
```
npm install livekit-client
```

# git and github
```
git init
git remote add origin https://github.com/yourusername/livekit-step-by-step-frontend-voice-ui.git
git add .
git commit -m "Initial commit: frontend scaffold Vite-React-TypeScript and npm install livekit-client"
git branch -M main
git push -u origin main
```