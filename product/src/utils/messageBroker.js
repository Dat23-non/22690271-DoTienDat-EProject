const amqp = require("amqplib");

class MessageBroker {
  constructor() {
    this.channel = null;
  }

  async connect() {
  console.log("Connecting to RabbitMQ...");

  // Cho phép lấy URL từ biến môi trường, fallback về localhost
  const RABBITMQ_URL = process.env.RABBITMQ_URL || "amqp://localhost:5672";

  setTimeout(async () => {
    try {
      const connection = await amqp.connect(RABBITMQ_URL);
      this.channel = await connection.createChannel();

      // Đảm bảo hàng đợi products tồn tại
      await this.channel.assertQueue("products", { durable: true });

      console.log(`✅ RabbitMQ connected at ${RABBITMQ_URL}`);
    } catch (err) {
      console.error("❌ Failed to connect to RabbitMQ:", err.message);
      // Thử lại sau 5 giây nếu fail
      setTimeout(() => this.connect(), 5000);
    }
  }, 5000);
}


  async publishMessage(queue, message) {
    if (!this.channel) {
      console.error("No RabbitMQ channel available.");
      return;
    }

    try {
      await this.channel.sendToQueue(
        queue,
        Buffer.from(JSON.stringify(message))
      );
    } catch (err) {
      console.log(err);
    }
  }

  async consumeMessage(queue, callback) {
    if (!this.channel) {
      console.error("No RabbitMQ channel available.");
      return;
    }

    try {
      await this.channel.consume(queue, (message) => {
        const content = message.content.toString();
        const parsedContent = JSON.parse(content);
        callback(parsedContent);
        this.channel.ack(message);
      });
    } catch (err) {
      console.log(err);
    }
  }
}

module.exports = new MessageBroker();
