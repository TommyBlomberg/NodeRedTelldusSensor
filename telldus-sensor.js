module.exports = function(RED) {
  var TelldusAPI = require("telldus-live");

  function TelldusSensorNode(config) {
    RED.nodes.createNode(this, config);
    var node = this;

    node.on("input", function(msg) {
      if (hasMissingCredentials(node)) {
        return;
      }

      var api = new TelldusAPI.TelldusAPI({
        publicKey: this.credentials.public_key,
        privateKey: this.credentials.private_key
      });

      api.login(this.credentials.token, this.credentials.token_secret, function(err, user) {
        if (!!err) {
          var error = JSON.parse(err.data).error;
          var errorMessage = `Login failed: ${err.statusCode} - ${error}`;
          node.status({ fill: "red", shape: "ring", text: errorMessage });
          return node.error(errorMessage);
        }

        node.status({ fill: "green", shape: "dot", text: `Login succesful for ${user.firstname} ${user.lastname}` });

        var sensor = {};
        sensor.id = node.id;
        api.getSensorInfo(sensor, function(err, sensorInfo) {
          if (!!err) {
            var error = JSON.parse(err.data).error;
            var errorMessage = `getSensorInfo failed: ${err.statusCode} - ${error}`;
            node.status({ fill: "red", shape: "ring", text: errorMessage });
            return node.error(errorMessage);
          }

          if (sensorInfo.error) {
            var errorMessage = `getSensorInfo failed: ${sensorInfo.error}`;
            node.status({ fill: "red", shape: "ring", text: errorMessage });
            return node.error(errorMessage);
          }

          var dataItems = [];
          sensorInfo.data.forEach(item => {
            var dataItem = `"${item.name}": ${item.value}`;
            dataItems.push(dataItem);
          });
          var dataItemsJson = `{${dataItems.join(",")}}`;
          msg.payload = JSON.parse(dataItemsJson);

          node.send(msg);
        });
      });
    });
  }

  function hasMissingCredentials(node) {
    var missingCredentials = [];
    if (!node.credentials.public_key) {
      missingCredentials.push("Public key");
    }
    if (!node.credentials.private_key) {
      missingCredentials.push("Private key");
    }
    if (!node.credentials.token) {
      missingCredentials.push("Token");
    }
    if (!node.credentials.token_secret) {
      missingCredentials.push("Token secret");
    }

    if (missingCredentials.length > 0) {
      var errorMessage = `Error: Following credentials are missing - ${missingCredentials.join(", ")}`;
      node.status({ fill: "red", shape: "ring", text: errorMessage });
      node.error(errorMessage);
      return true;
    }

    return false;
  }

  RED.nodes.registerType("telldus-sensor", TelldusSensorNode, {
    credentials: {
      public_key: { type: "text", required: true },
      private_key: { type: "text", required: true },
      token: { type: "text", required: true },
      token_secret: { type: "text", required: true }
    }
  });
};
