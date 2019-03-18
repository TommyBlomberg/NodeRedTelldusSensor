module.exports = function (RED) {
    function TelldusSensorNode(config) {
        RED.nodes.createNode(this, config);
        var node = this;

        node.on('input', function (msg) {
            msg.payload = "Basic skeleton, no real functionality. WIP...";
            node.send(msg);
        });
    }

    RED.nodes.registerType("telldus-sensor", TelldusSensorNode);
}