import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { ensureBucketPublic, uploadObject } from "@/lib/minio";

const MAX_SIZE = 8 * 1024 * 1024; // 8 MB
const FOLDERS = ["avatar", "projects", "cv"] as const;

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const formData = await request.formData();
  const file = formData.get("file");
  const folder = formData.get("folder");

  if (!(file instanceof File)) {
    return NextResponse.json({ error: "No file provided" }, { status: 400 });
  }
  if (typeof folder !== "string" || !FOLDERS.includes(folder as (typeof FOLDERS)[number])) {
    return NextResponse.json({ error: "Invalid folder" }, { status: 400 });
  }
  if (file.size > MAX_SIZE) {
    return NextResponse.json({ error: "File too large (max 8 MB)" }, { status: 400 });
  }
  const isImage = file.type.startsWith("image/");
  const isPdf = file.type === "application/pdf";
  if (!isImage && !isPdf) {
    return NextResponse.json({ error: "Only images or PDF allowed" }, { status: 400 });
  }
  if (folder === "cv" && !isPdf) {
    return NextResponse.json({ error: "CV must be a PDF" }, { status: 400 });
  }

  const sanitized = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
  const key = `${folder}/${Date.now()}-${sanitized}`;
  const buffer = Buffer.from(await file.arrayBuffer());

  await ensureBucketPublic();
  const url = await uploadObject(key, buffer, file.type);

  return NextResponse.json({ url });
}
