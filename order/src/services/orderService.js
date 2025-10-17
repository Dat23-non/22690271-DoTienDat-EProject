const Order = require('../models/order');

class OrderService {
  async createOrder({ products, totalPrice }) {
    // Tối thiểu: validate đơn giản
    if (!Array.isArray(products) || products.length === 0) {
      throw new Error('Products is required');
    }
    if (typeof totalPrice !== 'number' || totalPrice < 0) {
      throw new Error('totalPrice must be a non-negative number');
    }
    const order = await Order.create({ products, totalPrice });
    return order.toObject();
  }
}

module.exports = OrderService;
