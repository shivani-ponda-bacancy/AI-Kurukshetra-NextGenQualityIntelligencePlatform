import type { ReactNode } from "react";

export function SimpleTable({ headers, rows }: { headers: string[]; rows: ReactNode[][] }) {
  return (
    <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white/90">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-200 text-left text-sm">
          <thead className="bg-slate-50 text-slate-500">
            <tr>
              {headers.map((header) => (
                <th className="px-5 py-4 font-semibold" key={header}>
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {rows.map((row, index) => (
              <tr className="text-slate-700" key={index}>
                {row.map((cell, cellIndex) => (
                  <td className="px-5 py-4 align-top" key={cellIndex}>
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
