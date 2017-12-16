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

    appIndex: resolveApp('src_view/index.js'),
    appOcsJs: resolveApp('src_view/ocs.js'),
    appOriginalDiagnosisJs: resolveApp('src_view/originalDiagnosis.js'),
    appPharmacyJs: resolveApp('src_view/pharmacy.js'),
    appPrediagnosisJs: resolveApp('src_view/prediagnosis.js'),
    appReceiptJs: resolveApp('src_view/receipt.js'),

    appPackageJson: resolveApp('package.json'),
    appSrc: resolveApp('src_view'),
    appNodeModules: resolveApp('node_modules'),
};