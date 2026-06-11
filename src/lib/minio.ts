import { Client } from "minio";

const bucket = process.env.MINIO_BUCKET ?? "biodata";
const publicUrl = process.env.MINIO_PUBLIC_URL ?? "";

const globalForMinio = globalThis as unknown as { minio?: Client };

export const minio =
  globalForMinio.minio ??
  new Client({
    endPoint: process.env.MINIO_ENDPOINT ?? "localhost",
    port: Number(process.env.MINIO_PORT ?? 9000),
    useSSL: process.env.MINIO_USE_SSL === "true",
    accessKey: process.env.MINIO_ACCESS_KEY ?? "",
    secretKey: process.env.MINIO_SECRET_KEY ?? "",
  });

if (process.env.NODE_ENV !== "production") globalForMinio.minio = minio;

export async function ensureBucketPublic() {
  const exists = await minio.bucketExists(bucket);
  if (!exists) await minio.makeBucket(bucket);
  const policy = {
    Version: "2012-10-17",
    Statement: [
      {
        Effect: "Allow",
        Principal: { AWS: ["*"] },
        Action: ["s3:GetObject"],
        Resource: [`arn:aws:s3:::${bucket}/*`],
      },
    ],
  };
  await minio.setBucketPolicy(bucket, JSON.stringify(policy));
}

export async function uploadObject(
  key: string,
  buffer: Buffer,
  contentType: string
): Promise<string> {
  await minio.putObject(bucket, key, buffer, buffer.length, {
    "Content-Type": contentType,
  });
  return `${publicUrl}/${bucket}/${key}`;
}
