import {
  expect as expectCDK,
  MatchStyle,
  matchTemplate
} from "@aws-cdk/assert";
import cdk = require("@aws-cdk/core");
import Mailer = require("../lib/mailer-stack");

test("Empty Stack", () => {
  const app = new cdk.App();
  // WHEN
  const stack = new Mailer.MailerStack(app, "MyTestStack", {
    email: "test@example.com"
  });
  // THEN
  expectCDK(stack).to(
    matchTemplate(
      {
        Resources: {}
      },
      MatchStyle.EXACT
    )
  );
});
