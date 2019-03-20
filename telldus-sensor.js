module.exports = function(RED) {
  var TelldusAPI = require("telldus-live");

  function TelldusSensorNode(config) {
    RED.nodes.createNode(this, config);
    var node = this;

    var api = new TelldusAPI.TelldusAPI({
      publicKey: this.credentials.public_key,
      privateKey: this.credentials.private_key
    });

    node.on("input", function(msg) {
      msg.payload = `The Id of ${node.name} is ${node.id}`;
      node.send(msg);
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
