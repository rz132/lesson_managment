const express = require('express');
const router = express.Router();
const Order = require('../models/order');
const Lesson = require('../models/lesson');

// Create a new order
router.post('/order', async (req, res) => {
  try {
    const { customer, lessons, totalAmount } = req.body;

    // Validate lessons exist and have available spaces
    for (const item of lessons) {
      const lesson = await Lesson.findById(item.lessonId);
      if (!lesson) {
        return res.status(404).json({ message: `Lesson with ID ${item.lessonId} not found` });
      }

      if (lesson.spaces < 1) {
        return res.status(400).json({ message: `No available spaces for lesson: ${lesson.title}` });
      }
    }

    // Create the order
    const order = new Order({
      customer,
      lessons,
      totalAmount,
      date: new Date(),
    });

    const newOrder = await order.save();
    res.status(201).json(newOrder);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get all orders
router.get('/orders', async (req, res) => {
  try {
    const orders = await Order.find();
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get a specific order
router.get('/orders/:id', async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    res.json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;