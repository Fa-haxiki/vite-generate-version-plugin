# vite-generate-version-plugin

[![NPM version](https://img.shields.io/npm/v/vite-generate-version-plugin.svg?style=flat)](https://npmjs.com/package/vite-generate-version-plugin)
[![NPM downloads](http://img.shields.io/npm/dm/vite-generate-version-plugin.svg?style=flat)](https://npmjs.com/package/vite-generate-version-plugin)

## Description

A vite plugin to generate version file into your project. User can receive the new version update by this file.

## Install

```bash
$ npm install vite-generate-version-plugin
```

## Usage

```js
// vite.config.js
import { defineConfig } from 'vite'
import { generateVersionPlugin } from 'vite-generate-version-plugin'

export default defineConfig({
  plugins: [
    generateVersionPlugin()
  ]
})
```

```jsx
// App.jsx
import React from 'react';
import { HashRouter as Router } from 'react-router-dom';
import RouterContent from './router/index';
import { useVersionCheck } from 'vite-generate-version-plugin';
import { Modal } from 'antd';

function App() {
  useVersionCheck({
    fetchVersionUrl: `${import.meta.env.BASE_URL}/version.json?t=${Date.now()}`,
    onNewVersionCallback: ({ currentVersion, latestVersion }) => {
      Modal.confirm({
        title: 'Get New Version',
        centered: true,
        content: (
          <p>
            Current Version：{currentVersion} <br />
            Latest Version：{latestVersion}
          </p>
        ),
        cancelButtonProps: { style: { display: 'none' } },
        okText: 'Update',
        onOk: () => {
          window.location.reload();
        },
      });
    },
  });

  return (
    <Router>
      <RouterContent />
    </Router>
  );
}
```
## Options

### generateVersionPlugin(options?: GenerateVersionPluginOptions)

| Option | Type                  | Default          | Description                                                                                              |
| --- |-----------------------|------------------|----------------------------------------------------------------------------------------------------------|
| `filename` | `string`              | `'version.json'` | The filename of the version file.                                                                        |
| `versionStrategy` | `string  \| function` | `undefined`      | The strategy to generate version. If type is string, you can use 'git', it will use the git commit hash. |


### useVersionCheck(options: UseVersionCheckOptions)

| Option | Type | Default | Description                                           |
| --- | --- | --- |-------------------------------------------------------|
| `fetchVersionUrl` | `string` | `''` | The url to fetch the version file.                    |
| `onNewVersionCallback` | `(options: { currentVersion: string, latestVersion: string }) => void` | `undefined` | The callback function when a new version is detected. |
| `checkInterval` | `number` | `60 * 1000` | The interval to check version.                        |


## LICENSE

MIT
