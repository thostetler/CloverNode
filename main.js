var require = require('request'),
    _       = require('lodash'),
    postFix = '/clover/request_processor/';

module.exports = function CloverNode (options) {

  _.defaults(options, {
    username: '',
    password: '',
    baseUrl: '',
    reqOptions: null
  });

}

function makeRequest (type, params, fn) {
  var opts = {};
  _.defaults(opts, this.reqOptions, {
    method: 'GET',
    uri: this.baseUrl + postFix + type,
    qs: params || {},
    auth: {
      username: this.username,
      password: this.password,
      sendImmediately: false
    }
  });
  request(opts, fn);
}

module.exports.prototype = {
  help: function (options, fn) {
    _.defaults(options, {
      graphID: '',
      sandbox: '',
      nodeID: '',
      verbose: 'MESSAGE'
    });
    makeRequest('help', options, fn);
  },
  graphRun: function () {},
  graphStatus: function () {},
  graphKill: function () {},
  serverJobs: function () {},
  sandboxList: function () {},
  sandboxContent: function () {},
  executionsHistory: function () {},
  suspend: function () {},
  resume: function () {},
  sandboxCreate: function () {},
  sandboxAddLocation: function () {},
  sandboxRemoveLocation: function () {},
  clusterStatus: function () {},
  exportServerConfig: function () {},
  importServerConfig: function () {}
}