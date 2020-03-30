/* eslint-disable @typescript-eslint/no-var-requires */

const process = require("process");

const nbgv = require("nerdbank-gitversioning");

process.chdir("./dist");
nbgv.setPackageVersion();
