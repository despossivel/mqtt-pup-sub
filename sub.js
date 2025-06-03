const Mqtt = require("./Mqtt.js");

const allowedSubTopics = [
      "request",
      "command",
  ];

const allowedPubTopics = [
    "alive",
    "status",
    "error",
    "metrics",
    "response",
];

const mqttClient = new Mqtt({
  host: "192.168.88.194",
  port: 1883,
  publishTopics: allowedPubTopics,
  subscribeTopics: allowedSubTopics,
});

mqttClient.connect();



mqttClient.onMessage((topic, message) => {
  console.log(`Received message on ${topic}:`, message);
});

