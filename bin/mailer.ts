#!/usr/bin/env node
import "source-map-support/register";
import { MailerStack } from "../lib/mailer-stack";
import cdk = require("@aws-cdk/core");

const app = new cdk.App();
new MailerStack(app, "MailerStack", {
  email: "rp971.patel@gmail.com",
  env: { region: "ap-south-1" }
});
