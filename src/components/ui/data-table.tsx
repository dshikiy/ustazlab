import type { ReactNode } from "react";

export interface Column<T> {
  key: string;
  header: string;
  render: (row: T) => ReactNode;
}

export function DataTable<T>({
  columns,
  data,
  keyExtractor,
  emptyState,
}: {
  columns: Column<T>[];
  data: T[];
  keyExtractor: (row: T) => string;
  emptyState?: ReactNode;
}) {
  if (!data.length) {
    return <>{emptyState || <div className="card text-center muted">Деректер жоқ</div>}</>;
  }

  return (
    <div className="card p-0 overflow-hidden">
      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              {columns.map((col) => (
                <th key={col.key}>{col.header}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((row) => (
              <tr key={keyExtractor(row)}>
                {columns.map((col) => (
                  <td key={col.key}>{col.render(row)}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

