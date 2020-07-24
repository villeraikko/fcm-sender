#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const commander_1 = require("commander");
const admin = require("firebase-admin");
const fs = require("fs");
const { version } = require('../package.json');
commander_1.program
    .name("fcm-sender")
    .version(version)
    .option("-c, --credentials <string>", "Path to service-account-file.json")
    .option("-m, --message <string>", "Path to message file")
    .option("-d, --device <string>", "Device ID")
    .parse(process.argv);
admin.initializeApp({
    credential: admin.credential.cert(commander_1.program.credentials),
});
const msg = fs.readFileSync(commander_1.program.message, "utf-8");
const msgO = JSON.parse(msg);
if (msgO.tokens == undefined)
    msgO.tokens = [];
msgO.tokens.push(commander_1.program.device);
admin
    .messaging()
    .sendMulticast(msgO)
    .then((value) => {
    console.log(JSON.stringify(value));
    process.exit();
})
    .catch((err) => {
    console.error(err);
    process.exit(1);
});
