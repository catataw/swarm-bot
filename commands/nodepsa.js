const dockerspawn = require('../lib/docker');
const listTasks = require('../lib/listTasks');

module.exports = {
  expression: '^node psa (.*)',
  async handler(slackPayload, match) {
    const docker = dockerspawn();
    const nodeId = match[1];
    const filter = {
      filters: {
        node: { [nodeId]: true }
      }
    };
    const data = await docker.listTasks(filter);
    return listTasks(data, `Tasks running on node ${nodeId}`, filter);
  },
  description: 'list containers running on a [nodeId]'
};
