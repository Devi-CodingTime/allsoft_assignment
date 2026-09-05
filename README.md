# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is enabled on this template. See [this documentation](https://react.dev/learn/react-compiler) for more information.

Note: This will impact Vite dev & build performances.
You can also try [the experimental native React Compiler support in plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md#rust-react-compiler) by using `compiler: true` in the plugin options instead of using the Babel plugin.

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.


### 1. Configure environment variables (optional)
```bash
 .env
```
By default the app points at `https://apis.allsoft.co/api/documentManagement`. Only edit `.env`
if you need a different API base URL.

### 2. Run the development server
```bash
npm run dev
```
Open **http://localhost:5173** in your browser. You'll land on the login screen.

### 3. Log in
- Enter your 10-digit mobile number and click **Send OTP**.
- Enter the 6-digit code you receive and click **Verify & continue**.
- You'll be redirected to the Upload screen once authenticated.

### 4. Build for production
```bash
npm run build
```
This outputs a production-ready bundle to the `dist/` folder.

### 5. Preview the production build locally
```bash
npm run preview
```
Opens the built app at **http://localhost:4173** so you can sanity-check it before deploying.

