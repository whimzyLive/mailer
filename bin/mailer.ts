#!/usr/bin/env node
import 'source-map-support/register';
import cdk = require('@aws-cdk/core');
import { MailerStack } from '../lib/mailer-stack';

const app = new cdk.App();
new MailerStack(app, 'MailerStack');
