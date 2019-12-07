import { APIGatewayEvent } from "aws-lambda";
import { S3, SNS } from "aws-sdk";

export async function sendMailToAdmin(event: APIGatewayEvent) {
  const topicArn = process.env.snsTopicArn;
  const bucketName = process.env.bucketName;
  const sns = new SNS();

  const s3 = new S3();

  if (!bucketName) {
    return;
  }

  const date = new Date().toDateString();
  const body = JSON.parse(event?.body || "{}");

  s3.upload({
    Bucket: bucketName,
    Key: `enquiries/${date}/${body.name}.json`
  });

  await sns
    .publish({
      Subject: "The Topper Enquiry",
      Message: JSON.stringify("New Enquiry received."),
      TopicArn: topicArn
    })
    .promise();
  return {
    statusCode: 200,
    body: JSON.stringify({ message: "Request Successfully Submitted." })
  };
}
