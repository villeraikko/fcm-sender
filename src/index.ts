#!/usr/bin/env node

import { program, Command } from "commander";
import * as admin from "firebase-admin";
import * as fs from "fs";

const { version } = require('../package.json');

program
  .name("fcm-sender")
  .version(version)
  .option("-c, --credentials <string>", "Path to service-account-file.json")
  .option("-m, --message <string>", "Path to message file")
  .option("-d, --device <string>", "Device ID")
  .parse(process.argv);

admin.initializeApp({
  credential: admin.credential.cert(program.credentials),
});

const msg: string = fs.readFileSync(program.message, "utf-8");
const msgO: any = JSON.parse(msg);

if (msgO.tokens == undefined) msgO.tokens = [];
msgO.tokens.push(program.device);

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
