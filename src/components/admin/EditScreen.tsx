"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import type { CollectionName } from "@/lib/types";
import { getDocById } from "@/lib/firestore";
import { EmptyState, PageHeader } from "./ui";

interface EditScreenProps<TValues, TDoc> {
  collectionName: CollectionName;
  newTitle: string;
  editTitle: (doc: TDoc) => string;
  emptyValues: TValues;
  mapDoc: (doc: TDoc) => TValues;
  render: (id: string | null, values: TValues) => React.ReactNode;
}

function Inner<TValues, TDoc extends { id: string }>({
  collectionName,
  newTitle,
  editTitle,
  emptyValues,
  mapDoc,
  render,
}: EditScreenProps<TValues, TDoc>) {
  const id = useSearchParams().get("id");
  const [values, setValues] = useState<TValues | null>(id ? null : emptyValues);
  const [title, setTitle] = useState(newTitle);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    getDocById<TDoc>(collectionName, id)
      .then((doc) => {
        if (!doc) {
          setError("Item not found.");
          return;
        }
        setValues(mapDoc(doc));
        setTitle(editTitle(doc));
      })
      .catch((e) => setError(e instanceof Error ? e.message : "Failed to load"));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  return (
    <div>
      <PageHeader title={title} />
      {error ? (
        <EmptyState message={error} />
      ) : values === null ? (
        <EmptyState message="Loading…" />
      ) : (
        render(id, values)
      )}
    </div>
  );
}

export function EditScreen<TValues, TDoc extends { id: string }>(
  props: EditScreenProps<TValues, TDoc>
) {
  return (
    <Suspense fallback={<EmptyState message="Loading…" />}>
      <Inner {...props} />
    </Suspense>
  );
}
