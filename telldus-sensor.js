module.exports = function(RED) {
  function TelldusSensorNode(config) {
    RED.nodes.createNode(this, config);
    var node = this;

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
