import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  setDoc,
  writeBatch,
  type Firestore,
} from "firebase/firestore";
import { getDb } from "./firebase";
import { defaultData } from "./defaultData";
import type {
  Certificate,
  CollectionName,
  Education,
  PortfolioData,
  Profile,
  Project,
  Skill,
  SocialLink,
  WorkExperience,
} from "./types";

const PROFILE_DOC = "profile/main";

function requireDb(): Firestore {
  const db = getDb();
  if (!db) throw new Error("Firebase is not configured. Set NEXT_PUBLIC_FIREBASE_* env vars.");
  return db;
}

async function readCollection<T>(db: Firestore, name: CollectionName, fallback: T[]): Promise<T[]> {
  const snap = await getDocs(query(collection(db, name), orderBy("order", "asc")));
  if (snap.empty) return fallback;
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }) as T);
}

/**
 * Reads the full portfolio. Falls back to the bundled CV defaults for any
 * collection that has no Firestore documents yet, so the public site is never
 * empty. Returns the bundled defaults wholesale when Firebase isn't configured.
 */
export async function fetchPortfolio(): Promise<PortfolioData> {
  const db = getDb();
  if (!db) return defaultData;

  const [profileSnap, socials, skills, experiences, projects, education, certificates] =
    await Promise.all([
      getDoc(doc(db, PROFILE_DOC)),
      readCollection<SocialLink>(db, "socials", defaultData.socials),
      readCollection<Skill>(db, "skills", defaultData.skills),
      readCollection<WorkExperience>(db, "experiences", defaultData.experiences),
      readCollection<Project>(db, "projects", defaultData.projects),
      readCollection<Education>(db, "education", defaultData.education),
      readCollection<Certificate>(db, "certificates", defaultData.certificates),
    ]);

  return {
    profile: profileSnap.exists() ? (profileSnap.data() as Profile) : defaultData.profile,
    socials,
    skills,
    experiences,
    projects,
    education,
    certificates,
  };
}

// ── Profile ──────────────────────────────────────────────────────────
export async function getProfile(): Promise<Profile> {
  const db = getDb();
  if (!db) return defaultData.profile;
  const snap = await getDoc(doc(db, PROFILE_DOC));
  return snap.exists() ? (snap.data() as Profile) : defaultData.profile;
}

export async function saveProfile(profile: Profile): Promise<void> {
  const db = requireDb();
  await setDoc(doc(db, PROFILE_DOC), profile);
}

// ── Generic collection CRUD ──────────────────────────────────────────
export async function listDocs<T>(name: CollectionName): Promise<T[]> {
  const db = requireDb();
  const snap = await getDocs(query(collection(db, name), orderBy("order", "asc")));
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }) as T);
}

export async function getDocById<T>(name: CollectionName, id: string): Promise<T | null> {
  const db = requireDb();
  const snap = await getDoc(doc(db, name, id));
  return snap.exists() ? ({ id: snap.id, ...snap.data() }) as T : null;
}

/** Create or update a document. `id` empty => new doc with generated id. */
export async function upsertDoc<T extends { id?: string }>(
  name: CollectionName,
  id: string,
  data: Omit<T, "id">
): Promise<void> {
  const db = requireDb();
  const ref = id ? doc(db, name, id) : doc(collection(db, name));
  await setDoc(ref, data, { merge: true });
}

export async function removeDoc(name: CollectionName, id: string): Promise<void> {
  const db = requireDb();
  await deleteDoc(doc(db, name, id));
}

/** Swap the `order` field of two documents (used by the ▲▼ buttons). */
export async function swapOrder(
  name: CollectionName,
  a: { id: string; order: number },
  b: { id: string; order: number }
): Promise<void> {
  const db = requireDb();
  const batch = writeBatch(db);
  batch.update(doc(db, name, a.id), { order: b.order });
  batch.update(doc(db, name, b.id), { order: a.order });
  await batch.commit();
}

/** Highest existing order + 1, for appending new rows. */
export async function nextOrder(name: CollectionName): Promise<number> {
  const items = await listDocs<{ order: number }>(name);
  return items.reduce((max, i) => Math.max(max, i.order), -1) + 1;
}

/**
 * Writes the bundled CV defaults into Firestore (one-time bootstrap from the
 * admin dashboard). Skips collections that already contain data so it never
 * clobbers edits.
 */
export async function importStarterData(): Promise<void> {
  const db = requireDb();

  const profileSnap = await getDoc(doc(db, PROFILE_DOC));
  if (!profileSnap.exists()) {
    await setDoc(doc(db, PROFILE_DOC), defaultData.profile);
  }

  const collections: { name: CollectionName; rows: { id: string }[] }[] = [
    { name: "socials", rows: defaultData.socials },
    { name: "skills", rows: defaultData.skills },
    { name: "experiences", rows: defaultData.experiences },
    { name: "projects", rows: defaultData.projects },
    { name: "education", rows: defaultData.education },
    { name: "certificates", rows: defaultData.certificates },
  ];

  for (const { name, rows } of collections) {
    const existing = await getDocs(collection(db, name));
    if (!existing.empty) continue;
    const batch = writeBatch(db);
    for (const row of rows) {
      const { id, ...rest } = row;
      batch.set(doc(db, name, id), rest);
    }
    await batch.commit();
  }
}
