const Storage = {
  all: () => window.storage.read(),
  save: (session) => window.storage.append(session),
  completedCount: () => window.storage.read().filter(s => s.ok).length,
  totalCount: () => window.storage.read().length
}