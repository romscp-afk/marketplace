import { requireAdmin } from "@/lib/admin/session";
import { getAuditLogs } from "@/lib/admin/data";
import { formatDate } from "@/lib/utils";

export default async function AdminAuditLogsPage() {
  await requireAdmin();
  const logs = await getAuditLogs();

  return (
    <div>
      <h1 className="font-display mb-2 text-2xl font-semibold">Audit logs</h1>
      <p className="text-muted mb-8 text-sm">
        Immutable record of administrative actions ({logs.length} entries)
      </p>

      {logs.length === 0 ? (
        <p className="text-muted text-sm">No audit entries yet.</p>
      ) : (
        <div className="bg-surface overflow-hidden rounded-xl border border-border">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-border border-b text-left">
                <th className="px-4 py-3 font-medium">Time</th>
                <th className="px-4 py-3 font-medium">Actor</th>
                <th className="px-4 py-3 font-medium">Action</th>
                <th className="hidden px-4 py-3 font-medium md:table-cell">Resource</th>
                <th className="hidden px-4 py-3 font-medium lg:table-cell">Summary</th>
              </tr>
            </thead>
            <tbody>
              {logs.map((entry) => (
                <tr key={entry.id} className="border-border border-b last:border-0">
                  <td className="text-muted px-4 py-3 whitespace-nowrap">
                    {formatDate(entry.createdAt)}
                  </td>
                  <td className="px-4 py-3">{entry.actorEmail}</td>
                  <td className="px-4 py-3">
                    <code className="bg-background rounded px-1.5 py-0.5 text-xs">
                      {entry.action}
                    </code>
                  </td>
                  <td className="hidden px-4 py-3 md:table-cell">{entry.resource}</td>
                  <td className="hidden px-4 py-3 lg:table-cell">{entry.summary}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
