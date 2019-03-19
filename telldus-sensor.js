module.exports = function(RED) {
  function TelldusSensorNode(config) {
    RED.nodes.createNode(this, config);
    var node = this;

    node.on("input", function(msg) {
      msg.payload = "The Id of the node is: " + node.id;
      node.send(msg);
    });
  }

  RED.nodes.registerType("telldus-sensor", TelldusSensorNode);
};
