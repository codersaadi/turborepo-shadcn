import { GetObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { Upload } from "@aws-sdk/lib-storage";
import { createPresignedPost } from "@aws-sdk/s3-presigned-post";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import typesafeEnv, { type AppEnv } from "@repo/env";
// IMPORTANT

//  in the @repo/env , you should add cloudflare() preset in the extends before using this. otherwise it will not validate the env variables , likely cause an issue.
// as we are assuming that you have added that plugin to env preset to validate the env
const env = typesafeEnv as AppEnv & {
  CLOUDFLARE_ACCOUNT_ID: string;
  CLOUDFLARE_ACCESS_KEY_ID: string;
  CLOUDFLARE_SECRET_ACCESS_KEY: string;
  CLOUDFLARE_BUCKET_NAME: string;
};

const s3Client = new S3Client({
  region: "auto",
  endpoint: `https://${env.CLOUDFLARE_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: env.CLOUDFLARE_ACCESS_KEY_ID,
    secretAccessKey: env.CLOUDFLARE_SECRET_ACCESS_KEY,
  },
});

export async function getDownloadUrl(objectName: string) {
  return getSignedUrl(
    s3Client,
    new GetObjectCommand({
      Bucket: env.CLOUDFLARE_BUCKET_NAME,
      Key: objectName,
    }),
    { expiresIn: 3600 }
  );
}

export async function uploadFileToBucket(file: File, filename: string) {
  const Key = filename;
  const Bucket = env.CLOUDFLARE_BUCKET_NAME;

  let res: unknown;

  try {
    const parallelUploads = new Upload({
      client: s3Client,
      params: {
        Bucket,
        Key,
        Body: file instanceof File ? file.stream() : file,
        ACL: "public-read",
        ContentType: file.type,
      },
      queueSize: 4,
      leavePartsOnError: false,
    });

    res = await parallelUploads.done();
  } catch (e) {
    console.error("Error uploading file to bucket:", e);
    throw e;
  }

  return res;
}

export async function getPresignedPostUrl(objectName: string) {
  return await createPresignedPost(s3Client, {
    Bucket: env.CLOUDFLARE_BUCKET_NAME,
    Key: objectName,
    // Conditions: [
    //   ["content-length-range", 0, 1024 * 1024 * 2],
    //   ["starts-with", "$Content-Type", contentType],
    // ],
    Expires: 600, // 10 minutes
    // Fields: {
    //   // acl: "public-read",
    //   "Content-Type": contentType,
    // },
  });
}

export async function getFileUrl({ key }: { key: string }) {
  const url = await getSignedUrl(
    s3Client,
    new GetObjectCommand({
      Bucket: env.CLOUDFLARE_BUCKET_NAME,
      Key: key,
    }),
    { expiresIn: 3600 }
  );
  return url;
}
