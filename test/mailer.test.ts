import { expect as expectCDK, matchTemplate, MatchStyle } from '@aws-cdk/assert';
import cdk = require('@aws-cdk/core');
import Mailer = require('../lib/mailer-stack');

test('Empty Stack', () => {
    const app = new cdk.App();
    // WHEN
    const stack = new Mailer.MailerStack(app, 'MyTestStack');
    // THEN
    expectCDK(stack).to(matchTemplate({
      "Resources": {}
    }, MatchStyle.EXACT))
});