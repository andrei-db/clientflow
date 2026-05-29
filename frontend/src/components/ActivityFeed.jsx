export default function ActivityFeed({ activities = [] }) {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6">
      <h3 className="text-xl font-semibold">Activity feed</h3>

      <p className="mt-1 text-sm text-neutral-500">
        Recent workspace activity.
      </p>

      <div className="mt-6 space-y-4">
        {activities.map((activity) => (
          <div
            key={activity.id}
            className="rounded-2xl bg-black/30 p-4"
          >
            <p className="font-medium">
              {activity.action} {activity.entityType}
            </p>

            <p className="mt-1 text-sm text-neutral-500">
              {activity.entityName}
            </p>

            <p className="mt-2 text-xs text-neutral-600">
              {new Date(activity.createdAt).toLocaleString()}
            </p>
          </div>
        ))}

        {activities.length === 0 && (
          <p className="text-sm text-neutral-500">
            No activity yet.
          </p>
        )}
      </div>
    </div>
  );
}