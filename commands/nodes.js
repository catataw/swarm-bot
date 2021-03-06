const dockerspawn = require('../lib/docker');

module.exports = {
  expression: '^nodes',
  async handler(slackPayload, match) {
    const docker = dockerspawn();
    const data = await docker.listNodes();
    const send = {
      response_type: 'in_channel',
      text: 'Listing nodes...',
      attachments: data.map((d) => {
        const attachment = {
          title: `Node ID: ${d.ID}`,
          fields: [
            { title: 'ID', value: d.ID, short: true },
            { title: 'Role', value: d.Spec.Role, short: true },
            { title: 'Availability', value: d.Spec.Availability, short: true },
            { title: 'Status', value: d.Status.State, short: true },
            { title: 'Hostname', value: d.Description.Hostname, short: true },
            { title: 'Leader', value: d.ManagerStatus ? d.ManagerStatus.Leader : '', short: true },
            { title: 'Reachability', value: d.ManagerStatus ? d.ManagerStatus.Reachability : '', short: true }
          ]
        };
        switch (d.Spec.Availability) {
          case 'active':
            attachment.color = 'good';
            break;
          case 'paused':
            attachment.color = 'warning';
            break;
          default:
            attachment.color = 'danger';
        }
        return attachment;
      })
    };
    return send;
  },
  description: 'list the nodes in the swarm'
};
