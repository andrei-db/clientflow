export default function ActivityFeed({ clients = [], projects = [] }) {
  const activities = [
    ...clients.slice(0, 3).map((client) => ({
      id: `client-${client.id}`,
      title: `New client added`,
      description: `${client.name} from ${client.company}`,
      date: client.createdAt,
    })),

    ...projects.slice(0, 3).map((project) => ({
      id: `project-${project.id}`,
      title: `New project created`,
      description: project.title,
      date: project.createdAt,
    })),
  ].sort((a, b) => new Date(b.date) - new Date(a.date));

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
            <p className="font-medium">{activity.title}</p>
            <p className="mt-1 text-sm text-neutral-500">
              {activity.description}
            </p>
          </div>
        ))}

        {activities.length === 0 && (
          <p className="text-sm text-neutral-500">No activity yet.</p>
        )}
      </div>
    </div>
  );
}