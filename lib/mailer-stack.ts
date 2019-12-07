import cdk = require("@aws-cdk/core");
import { LambdaIntegration, RestApi } from "@aws-cdk/aws-apigateway";
import { AssetCode, Function, Runtime } from "@aws-cdk/aws-lambda";
import { Bucket } from "@aws-cdk/aws-s3";
import { Topic } from "@aws-cdk/aws-sns";
import { EmailSubscription } from "@aws-cdk/aws-sns-subscriptions";
import { StackProps } from "@aws-cdk/core";

interface MailerStackProps extends StackProps {
  email: string;
}
export class MailerStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props: MailerStackProps) {
    super(scope, id, props);
    const topic = new Topic(this, "Topic", {
      displayName: "Customer subscription topic"
    });
    const equiryBucket = new Bucket(this, "EnquiryBucket", {
      versioned: false
    });
    const sendMailFunction = new Function(this, "SendMailFuncion", {
      functionName: "sendMailFunction",
      runtime: Runtime.NODEJS_10_X,
      code: new AssetCode("./src"),
      handler: "index.sendMailToAdmin",
      environment: {
        snsTopicArn: topic.topicArn,
        bucketName: equiryBucket.bucketName
      }
    });
    const api = new RestApi(this, "SendMailApi");
    const notify = api.root.addResource("notify");
    notify.addMethod("POST", new LambdaIntegration(sendMailFunction));
    topic.grantPublish(sendMailFunction);
    const sub = new EmailSubscription(props.email);
    topic.addSubscription(sub);
    equiryBucket.grantPut(sendMailFunction);
  }
}
