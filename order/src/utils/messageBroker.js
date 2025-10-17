const amqp = require('amqplib');
const config = require('../config');
const OrderService = require('../services/orderService');

class MessageBroker {
  static async connect() {
    const conn = await amqp.connect(config.rabbitMQUrl);
    const ch = await conn.createChannel();

    // Hàng đợi nhận yêu cầu mua hàng từ product
    await ch.assertQueue(config.rabbitMQQueue, { durable: true });

    // Hàng đợi phản hồi trạng thái về product
    await ch.assertQueue(config.rabbitMQCallbackQueue, { durable: true });

    const orderService = new OrderService();

    ch.consume(config.rabbitMQQueue, async (msg) => {
      try {
        const content = JSON.parse(msg.content.toString());
        // content dự kiến: { orderId, products, totalPrice }
        const { orderId, products, totalPrice } = content;

        // Lưu DB
        const saved = await orderService.createOrder({ products, totalPrice });

        // Gửi trạng thái về product để product cập nhật map trạng thái
        const response = {
          orderId,
          status: 'CONFIRMED',
          savedOrderId: saved._id
        };
        ch.sendToQueue(
          config.rabbitMQCallbackQueue,
          Buffer.from(JSON.stringify(response)),
          { persistent: true }
        );

        ch.ack(msg);
      } catch (err) {
        console.error('[order] consume error:', err);
        // reject không requeue để tránh vòng lặp vô hạn khi payload lỗi
        ch.reject(msg, false);
      }
    });

    console.log('[order] RabbitMQ consumer started');
  }
}

module.exports = MessageBroker;
