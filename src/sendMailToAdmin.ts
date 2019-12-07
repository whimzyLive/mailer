import { S3, SNS } from "aws-sdk";
import { Parser } from "json2csv";

export async function sendMailToAdmin(event: any) {
  const topicArn = process.env.snsTopicArn;
  const bucketName = process.env.bucketName;

  if (!bucketName || !topicArn) {
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Something went wrong!" })
    };
  }

  try {
    const sns = new SNS();

    const s3 = new S3();

    const date = new Date().toDateString();

    if (!event.name) {
      return {
        statusCode: 400,
        body: JSON.stringify({
          message: "Missing required name property on body."
        })
      };
    }

    const parser = new Parser();
    const csv = parser.parse(event);

    const response = await s3
      .upload({
        Bucket: bucketName,
        Key: `enquiries/${date}/${event.name}.csv`,
        Body: csv,
        ContentType: "text/csv"
      })
      .promise();

    await sns
      .publish({
        Subject: "The Topper Enquiry",
        Message: JSON.stringify(
          `New Enquiry received. view it here: ${response.Location} `
        ),
        TopicArn: topicArn
      })
      .promise();
    return {
      statusCode: 200,
      body: JSON.stringify({ message: "Request Successfully Submitted." })
    };
  } catch (err) {
    console.log(err);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Something went wrong!" })
    };
  }
}
