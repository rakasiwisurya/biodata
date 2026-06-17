"use client";

import { useCallback, useEffect, useState } from "react";
import type { CollectionName } from "@/lib/types";
import { listDocs, removeDoc, swapOrder } from "@/lib/firestore";
import { useAuth } from "@/lib/auth";
import { EmptyState, PageHeader, tableCls, tdCls, thCls, trCls } from "./ui";
import { RowActions } from "./RowActions";

export interface Column<T> {
  header: string;
  render: (item: T) => React.ReactNode;
}

interface Row {
  id: string;
  order: number;
}

export function EntityList<T extends Row>({
  collectionName,
  title,
  editBase,
  columns,
  emptyMessage,
}: {
  collectionName: CollectionName;
  title: string;
  editBase: string; // e.g. "/admin/skills/edit"
  columns: Column<T>[];
  emptyMessage: string;
}) {
  const { isAdmin } = useAuth();
  const [items, setItems] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    try {
      const data = await listDocs<T>(collectionName);
      setItems(data);
      setError(null);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load");
    } finally {
      setLoading(false);
    }
  }, [collectionName]);

  useEffect(() => {
    if (isAdmin) refresh();
  }, [isAdmin, refresh]);

  async function handleDelete(id: string) {
    await removeDoc(collectionName, id);
    await refresh();
  }

  async function handleMove(index: number, direction: "up" | "down") {
    const target = direction === "up" ? index - 1 : index + 1;
    if (target < 0 || target >= items.length) return;
    await swapOrder(collectionName, items[index], items[target]);
    await refresh();
  }

  return (
    <div>
      <PageHeader title={title} newHref={editBase} />
      {loading ? (
        <EmptyState message="Loading…" />
      ) : error ? (
        <EmptyState message={error} />
      ) : items.length === 0 ? (
        <EmptyState message={emptyMessage} />
      ) : (
        <div className="overflow-x-auto">
          <table className={tableCls}>
            <thead>
              <tr>
                {columns.map((c) => (
                  <th key={c.header} className={thCls}>
                    {c.header}
                  </th>
                ))}
                <th className={thCls} />
              </tr>
            </thead>
            <tbody>
              {items.map((item, i) => (
                <tr key={item.id} className={trCls}>
                  {columns.map((c) => (
                    <td key={c.header} className={tdCls}>
                      {c.render(item)}
                    </td>
                  ))}
                  <td className={tdCls}>
                    <RowActions
                      editHref={`${editBase}?id=${item.id}`}
                      onDelete={() => handleDelete(item.id)}
                      onMove={(dir) => handleMove(i, dir)}
                      isFirst={i === 0}
                      isLast={i === items.length - 1}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
