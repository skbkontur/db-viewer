/* eslint-disable @typescript-eslint/no-var-requires */

const fs = require("fs");
const process = require("process");

const nbgv = require("nerdbank-gitversioning");

process.chdir("./dist");
nbgv.setPackageVersion().then(() => fs.writeFileSync(".npmrc", "//registry.npmjs.org/:_authToken=${npm_auth_token}"));
