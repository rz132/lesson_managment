// models/lesson.js
const mongoose = require('mongoose');

const lessonSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  image: {
    type: String,
    default: '/images/placeholder.jpg'
  },
  category: {
    type: String,
    required: true
  },
  level: {
    type: String,
    enum: ['Beginner', 'Intermediate', 'Advanced'],
    required: true
  },
  duration: {
    type: Number,
    required: true
  },
  rating: {
    type: Number,
    min: 0,
    max: 5,
    default: 0
  },
  spaces: {
    type: Number,
    required: true,
    min: 0
  },
  featured: {
    type: Boolean,
    default: false
  },
  instructor: {
    name: {
      type: String,
      required: true
    },
    title: {
      type: String
    },
    avatar: {
      type: String,
      default: '/images/instructor-placeholder.jpg'
    }
  }
});

module.exports = mongoose.model('Lesson', lessonSchema);