var request = require('request'),
    _       = require('lodash'),
    moment  = require('moment'),
    postFix = '/clover/request_processor/'
    format  = 'yyyy-MM-dd HH:mm';

function required (obj, message) {
  if (_.isUndefined(obj)) {
    throw new Error(message);
  }
}

module.exports = function CloverNode (options) {
  required(options.username, 'CloverNode requires a username');
  required(options.password, 'CloverNode requires a password');
  required(options.baseUrl, 'CloverNode requires a baseUrl');
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
    makeRequest('help', options, fn);
  },
  graphRun: function (options, fn) {
    required(options.graphID, 'graphRun requires a graphID');
    required(options.sandbox, 'graphRun requires a sandbox');
    _.defaults(options, {
      graphID: '',
      sandbox: '',
      nodeID: '',
      verbose: 'MESSAGE'
    });
    makeRequest('graph_run', options, fn);
  },
  graphStatus: function (options, fn) {
    required(options.runID, 'graphStatus requires a runID');
    _.defaults(options, {
      runID: '',
      returnType: 'STATUS',
      waitForStatus: '',
      waitTimeout: '0',
      verbose: 'MESSAGE'
    });
    makeRequest('graph_status', options, fn);
  },
  graphKill: function (options, fn) {
    required(options.runID, 'graphKill requires a runID');
    _.defaults(options, {
      runID: '',
      returnType: 'STATUS',
      verbose: 'MESSAGE'
    });
    makeRequest('graph_kill', options, fn);
  },
  serverJobs: function (options, fn) {
    makeRequest('server_jobs', options, fn);
  },
  sandboxList: function (options, fn) {
    makeRequest('sandbox_list', options, fn);
  },
  sandboxContent: function (options, fn) {
    required(options.sandbox, 'sandboxContent requires a sandbox');
    _.defaults(options, {
      sandbox: '',
      verbose: 'MESSAGE'
    });
    makeRequest('graph_kill', options, fn);
  },
  executionsHistory: function (options, fn) {
    required(options.sandbox, 'executionsHistory requires a sandbox');
    _.defaults(options, {
      sandbox: '',
      from: '',
      to: '',
      stopFrom: '',
      stopTo: '',
      status: '',
      graphID: '',
      orderBy: '',
      orderDescend: 'true',
      returnType: 'IDs',
      index: '0',
      records: 'infinite',
      verbose: 'MESSAGE'
    });
    makeRequest('executions_history', options, fn);
  },
  suspend: function (options, fn) {
    _.defaults(options, {
      sandbox: '',
      atonce: ''
    });
    makeRequest('suspend', options, fn);
  },
  resume: function (options, fn) {
    _.defaults(options, {
      sandbox: '',
      verbose: 'MESSAGE'
    });
    makeRequest('resume', options, fn);
  },
  sandboxCreate: function (options, fn) {
    required(options.sandbox, 'sandboxCreate requires a sandbox');
    _.defaults(options, {
      sandbox: '',
      path: '',
      type: '',
      createDirs: '',
      verbose: 'MESSAGE'
    });
    makeRequest('sandbox_create', options, fn);
  },
  sandboxAddLocation: function (options, fn) {
    required(options.sandbox, 'sandboxAddLocation requires a sandbox');
    required(options.nodeId, 'sandboxAddLocation requires a nodeId');
    required(options.path, 'sandboxAddLocation requires a path');
    _.defaults(options, {
      sandbox: '',
      path: '',
      nodeId: '',
      location: '',
      verbose: 'MESSAGE'
    });
    makeRequest('sandbox_add_location', options, fn);
  },
  sandboxRemoveLocation: function (options, fn) {
    required(options.sandbox, 'sandboxRemoveLocation requires a sandbox');
    required(options.location, 'sandboxRemoveLocation requires a location');
    _.defaults(options, {
      sandbox: '',
      location: '',
      verbose: 'MESSAGE'
    });
    makeRequest('sandbox_remove_location', options, fn);
  },
  clusterStatus: function (options, fn) {
    makeRequest('cluster_status', options, fn);
  },
  exportServerConfig: function (options, fn) {
    _.defaults(options, {
      include: 'all'
    });
    makeRequest('export_server_config', options, fn);
  },
  importServerConfig: function (options, fn) {
    required(options.xmlFile, 'importServerConfig requires a xmlFile');
    _.defaults(options, {
      xmlFile: '',
      dryRun: 'true',
      newOnly: 'false',
      include: 'all',
      verbose: 'MESSAGE'
    });
    makeRequest('import_server_config', options, fn);
  },
  dates: {
    parse: function (str) {
      return moment(str).format(format);
    },
    subtract: function (o, type) {
      return moment().subtract(o, type).format(format);
    },
    getDateFormat: function () {
      return format;
    },
    getDateObject: function () {
      return moment;
    }
  },
  parseDescription: function (desc, fn) {
    var lines = desc.toString().match(/.*/g),
        executions = [];
    for (var i = 0; i < lines.length; i++) {
      if (lines[i].match(/^execution/)) {
        var execution = {};
        executions.push(execution);
        var values = lines[i].split('|');
        _.set(execution, 'runID',             values[1] || '');
        _.set(execution, 'status',            values[2] || '');
        _.set(execution, 'username',          values[3] || '');
        _.set(execution, 'sandbox',           values[4] || '');
        _.set(execution, 'graphID',           values[5] || '');
        _.set(execution, 'startedDatetime',   values[6] || '');
        _.set(execution, 'finishedDatetime',  values[7] || '');
        _.set(execution, 'clusterNode',       values[8] || '');
        _.set(execution, 'graphVersion',      values[9] || '');

        execution.phases = [];

        for (var e = i + 1; e < lines.length; ++e) {
          if (lines[e].match(/^phase/)) {
            var phase = {};
            values = lines[e].split('|');
            _.set(phase, 'executionindex',  values[1] || '');
            _.set(phase, 'execTimeInMilis', values[2] || '');

            execution.phases.push(phase);
            phase.nodes = [];

            for (var j = e + 1; j < lines.length; ++j) {
              if (lines[j].match(/^node/)) {
                var node = {};
                values = lines[j].split('|');
                _.set(node, 'nodeID',         values[1] || '');
                _.set(node, 'status',         values[2] || '');
                _.set(node, 'totalCpuTime',   values[3] || '');
                _.set(node, 'totalUserTime',  values[4] || '');
                _.set(node, 'cpuUsage',       values[5] || '');
                _.set(node, 'peakCpuUsage',   values[6] || '');
                _.set(node, 'userUsage',      values[7] || '');
                _.set(node, 'peakUserUsage',  values[8] || '');

                phase.nodes.push(node);
                node.ports = [];

                for (var r = j + 1; r < lines.length; ++r) {
                  if (lines[r].match(/^port/)) {
                    var port = {};
                    values = lines[r].split('|');
                    _.set(port, 'portType',   values[1] || '');
                    _.set(port, 'index',      values[2] || '');
                    _.set(port, 'avgBytes',   values[3] || '');
                    _.set(port, 'avgRows',    values[4] || '');
                    _.set(port, 'peakBytes',  values[5] || '');
                    _.set(port, 'peakRows',   values[6] || '');
                    _.set(port, 'totalBytes', values[7] || '');
                    _.set(port, 'totalRows',  values[8] || '');

                    node.ports.push(port);
                  } else if (lines[r].match(/^(execution.*|phase.*|node.*)/)) { break; }
                }
              } else if (lines[j].match(/^(execution.*|phase.*)/)) { break; }
            }
          } else if (lines[e].match(/^(execution.*)/)) { break; }
        }
      }
    }
    fn(executions);
  }
}
