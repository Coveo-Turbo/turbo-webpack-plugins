# turbo-webpack-plugins

Disclaimer: This component was built by the community at large and is not an official Coveo JSUI Component. Use this component at your own risk.

## Getting Started

1. Install the component into your project.

```
npm i @coveops/turbo-webpack-plugins
```

2. Use the Component or extend it

Typescript:

```javascript
import { DeploySearchPagePlugin } from '@coveops/turbo-webpack-plugins';
```

Javascript

```javascript
const DeploySearchPagePlugin = require('@coveops/turbo-webpack-plugins').DeploySearchPagePlugin;
```

3. You can also expose the component alongside other components being built in your project.

```javascript
export * from '@coveops/turbo-webpack-plugins'
```

4. Or for quick testing, you can add the script from unpkg

```html
<script src="https://unpkg.com/@coveops/turbo-webpack-plugins@latest/dist/index.min.js"></script>
```

> Disclaimer: Unpkg should be used for testing but not for production.

## Contribute

1. Clone the project
2. Copy `.env.dist` to `.env` and update the COVEO_ORG_ID and COVEO_TOKEN fields in the `.env` file to use your Coveo credentials and SERVER_PORT to configure the port of the sandbox - it will use 8080 by default.
3. Build the code base: `npm run build`
4. Serve the sandbox for live development `npm run serve`