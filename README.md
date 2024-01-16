# 🚓  wanted-angular

wanted-angular is my demo project which uses public API [fbi.gov/wanted](https://fbi.gov/wanted)

<img align="center" src="https://github.com/farnsworth3010/wanted-angular/blob/dev/screenshot.png" alt="Angular" width="75%"/>

# 🔧 Tech Stack

- Angular
- Angular CLI
- Angular Material
- RxJs
- Typescript
- Firebase


## Prerequisites
You have to create a file with api url and firebase key
```ts
// src/environments/environment.ts

export const environment = {
  production: false,
  firebase: {
    apiKey: 'your key',
    authDomain: 'your data',
    projectId: 'your data',
    storageBucket: 'your data',
    messagingSenderId: 'your data',
    appId: 'your data',
    measurementId: 'your data',
  },
  apiUrl: 'https://api.fbi.gov/wanted/v1/list',
};

```

## 👾 Development server

Run `npm start` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## 🤖 Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive/pipe/service/class/module`.

## 🏗 Build

Run `npm run build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `-prod` flag for a production build.

### ✅ Build for Production

Run `npm run build:prod` to build the project minified for production with AOT.

## ❔ Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).
