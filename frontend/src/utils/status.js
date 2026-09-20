export function statusClass(status) {
  return {
    completed: 'is-accent',
    failed: 'is-danger',
    analyzing: 'is-warn',
    parsing: 'is-warn',
    pending: 'is-info',
  }[status] || ''
}
