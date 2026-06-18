/**
 * Seed Firestore with the bundled CV defaults using the Firebase Admin SDK.
 * The Admin SDK authenticates with a service-account key and writes with IAM
 * privileges (it bypasses Firestore Security Rules — no rule changes needed).
 *
 * Usage:
 *   1. Put a service-account key at ./serviceAccountKey.json (gitignored).
 *   2. npx tsx scripts/seed-firestore.ts
 *
 * After Firestore has data, content is managed through the /admin dashboard;
 * this script is only for the initial seed (or a reset).
 */
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { cert, initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { defaultData } from "../src/lib/defaultData";

const keyPath = resolve(process.cwd(), "serviceAccountKey.json");
const serviceAccount = JSON.parse(readFileSync(keyPath, "utf8"));

initializeApp({ credential: cert(serviceAccount) });
const db = getFirestore();

async function main() {
  const batch = db.batch();

  batch.set(db.doc("profile/main"), defaultData.profile);

  const collections = [
    ["socials", defaultData.socials],
    ["skills", defaultData.skills],
    ["experiences", defaultData.experiences],
    ["projects", defaultData.projects],
    ["education", defaultData.education],
    ["certificates", defaultData.certificates],
  ] as const;

  let count = 1;
  for (const [name, rows] of collections) {
    for (const row of rows) {
      const { id, ...rest } = row as { id: string } & Record<string, unknown>;
      batch.set(db.collection(name).doc(id), rest);
      count++;
    }
  }

  await batch.commit();
  console.log(`Seeded ${count} documents into Firestore (project ${serviceAccount.project_id}).`);
}

main()
  .then(() => process.exit(0))
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
