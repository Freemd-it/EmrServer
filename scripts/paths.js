'use strict';
const path = require('path');
const fs = require('fs');
const url = require('url');

const appDirectory = fs.realpathSync(process.cwd());
const resolveApp = relativePath => path.resolve(appDirectory, relativePath);


// config after eject: we're in ./config/
module.exports = { 
    appBuild: resolveApp('public/dist/'),
    appPublic: resolveApp('public'),
    appIndexJs: resolveApp('src_view/index.js'), 
    appPackageJson: resolveApp('package.json'),
    appSrc: resolveApp('src_view'),
    appNodeModules: resolveApp('node_modules'),
};