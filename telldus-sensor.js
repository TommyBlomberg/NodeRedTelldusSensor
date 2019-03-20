module.exports = function(RED) {
  var TelldusAPI = require("telldus-live");

  function TelldusSensorNode(config) {
    RED.nodes.createNode(this, config);
    var node = this;

    node.on("input", function(msg) {
      var missingCredentials = [];
      if (this.credentials.public_key == "" || this.credentials.public_key == null) {
        missingCredentials.push("Public key");
      }
      if (this.credentials.private_key == "" || this.credentials.private_key == null) {
        missingCredentials.push("Private key");
      }
      if (this.credentials.token == "" || this.credentials.token == null) {
        missingCredentials.push("Token");
      }
      if (this.credentials.token_secret == "" || this.credentials.token_secret == null) {
        missingCredentials.push("Token secret");
      }

      if (missingCredentials.length > 0) {
        var errorMessage = `Error: Following credentials are missing - ${missingCredentials.join(", ")}`;
        node.status({ fill: "red", shape: "ring", text: errorMessage });
        node.error(errorMessage);
        return;
      }

      var api = new TelldusAPI.TelldusAPI({
        publicKey: this.credentials.public_key,
        privateKey: this.credentials.private_key
      });

      api.login(this.credentials.token, this.credentials.token_secret, function(err, user) {
        if (!!err) {
          var errorMessage = `Login failed: ${err.message}`;
          node.status({ fill: "red", shape: "ring", text: errorMessage });

          return node.log(errorMessage);
        }

        node.status({ fill: "green", shape: "dot", text: `Login succesful for ${user.firstname} ${user.lastname}` });
        node.log(`user: ${JSON.stringify(user, null, 2)}`);

        msg.payload = `The Id of ${node.name} is ${node.id}`;
        node.send(msg);
      });
    });
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
