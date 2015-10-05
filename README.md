# node-clover

This is a simple wrapper and parser for Clover ETL's HTTP API commands.  A full list of commands are available here: [CloverETL HTTP API](http://server-demo-ec2.cloveretl.com/clover/docs/simple-http-api.html).

## Usage

```js
var CloverNode = require('CloverNode');
var options = {
  username: 'cloverUser',
  password: 'cloverPass',
  baseUrl: 'http://clover-server' // automatically attaches /clover/request_processor/ to url
};
var cloverServer = new CloverNode(options);
```

After the server has been initialized, you can start performing operations.

### Get Help
```js
// Help is a list of available commands
cloverServer.help(null, function (data) {
  console.log(data);
});
```

### Run a Graph
```js
cloverServer.graphRun({
  sandbox: 'Sandbox Name',
  graphID: 'graph/my-graph-name.grf'
}, function (runID) {
  console.log(runID); // Returns the run ID of the new graph process
});
```

### Get Status of a Graph
```js
cloverServer.graphStatus({
  runID: 34563
}, function (data) {
  console.log(data); // This can be changed by altering the returnType
});
```

### Kill a Graph
```js
cloverServer.graphKill({
  runID: 34563
}, function (data) {
  console.log(data);
});
```

### Get List of Server Jobs
```js
cloverServer.serverJobs(null, function (data) {
  console.log(data);
});
```

### Get Sandbox List
```js
cloverServer.sandboxList(null, function (data) {
  console.log(data);
});
```

### Get Sandbox Content
```js
cloverServer.serverJobs({
  sandbox: 'Sandbox Name'
}, function (data) {
  console.log(data);
});
```

### Get Execution History
```js
cloverServer.executionHistory({
  sandbox: 'Sandbox Name',
  from: '2015-09-01 00:00',
  to: '2015-09-30 23:59',
  returnType: 'DESCRIPTION'
}, function (data) {
  // If you set returnType to DESCRIPTION you will receive `|` delimited records
  cloverServer.parseDescriptions(data, function (executions) {
    console.log(executions);
  });
});
```

### Suspend Server or Sandbox
```js
cloverServer.suspend({
  sandbox: 'Sandbox Name',
  atonce: ''
}, function (data) {
  console.log(data);
});
```

### Resume Suspended Sandbox
```js
cloverServer.resume({
  sandbox: 'Sandbox Name'
}, function (data) {
  console.log(data);
});
```

### Create a new Sandbox
```js
cloverServer.sandboxCreate({
  sandbox: 'Sandbox Name'
}, function (data) {
  console.log(data);
});
```

### Add a New Sandbox Location
```js
cloverServer.sandboxAddLocation({
  sandbox: 'Sandbox Name',
  nodeId: 'node A',
  path: 'Sandbox/files/File A'
}, function (data) {
  console.log(data);
});
```

### Remove a Sandbox Location
```js
cloverServer.sandboxRemoveLocation({
  sandbox: 'Sandbox Name',
  location: 'graph A'
}, function (data) {
  console.log(data);
});
```

### Get Cluster Status
```js
cloverServer.clusterStatus(null, function (data) {
  console.log(data);
});
```

### Export the Server Config
```js
cloverServer.exportServerConfig(null, function (data) {
  console.log(data);
});
```

### Import a New Server Config
```js
cloverServer.exportServerConfig({
  xmlFile: 'serverConfig'
}, function (data) {
  console.log(data);
});
```

## Parsing Dates

* Parse dates in CloverETL Default Format: `yyyy-MM-dd HH:mm`

```js
var date = cloverServer.dates.parse('May 5th, 2015');
```

* Subtract Dates

```js
var diff = cloverServer.dates.subtract(date, 8, hours);
```

* Get Date Format

```js
var format = cloverServer.dates.getDateFormat();
```

* Get Date Object (Moment)

```js
var format = cloverServer.dates.getDateObject();
```

`node-clover` uses `momentjs` for date parsing and manipulation.




