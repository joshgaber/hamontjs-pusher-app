const Pusher = require('pusher');
module.exports = new Pusher({
  appId: '909292',
  key: '3d63639268dbf6809285',
  secret: 'fa823a3af22294eaf262',
  cluster: 'us2',
  useTLS: true,
});
