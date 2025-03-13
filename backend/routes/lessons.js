// routes/lessons.js
const express = require('express');
const router = express.Router();
const Lesson = require('../models/lesson');

// GET all lessons
router.get('/lessons', async (req, res) => {
  try {
    const lessons = await Lesson.find();
    res.json(lessons);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET a specific lesson
router.get('/lessons/:id', async (req, res) => {
  try {
    const lesson = await Lesson.findById(req.params.id);
    if (!lesson) {
      return res.status(404).json({ message: 'Lesson not found' });
    }
    res.json(lesson);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// UPDATE lesson availability
router.put('/update/:id', async (req, res) => {
  try {
    const lesson = await Lesson.findById(req.params.id);
    if (!lesson) {
      return res.status(404).json({ message: 'Lesson not found' });
    }
    
    if (lesson.spaces < 1) {
      return res.status(400).json({ message: 'No available spaces for this lesson' });
    }
    
    lesson.spaces = req.body.spaces;
    const updatedLesson = await lesson.save();
    res.json(updatedLesson);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// For initial data seeding (development only)
router.post('/seed-lessons', async (req, res) => {
  try {
    // Sample data
    const sampleLessons = [
      {
        title: 'Web Development Basics',
        description: 'Learn the fundamentals of web development, including HTML, CSS, and JavaScript. Perfect for beginners wanting to start their journey into web development.',
        price: 49.99,
        image: '/images/web-development.jpg',
        category: 'Web Development',
        level: 'Beginner',
        duration: 5,
        rating: 4.5,
        spaces: 20,
        featured: true,
        instructor: {
          name: 'John Smith',
          title: 'Web Developer & Instructor',
          avatar: '/images/instructor1.jpg'
        }
      },
      {
        title: 'Data Science Essentials',
        description: 'Master data analysis techniques with Python and popular libraries like Pandas and NumPy. Learn to clean, analyze, and visualize data effectively.',
        price: 79.99,
        image: '/images/data-science.jpg',
        category: 'Data Science',
        level: 'Intermediate',
        duration: 8,
        rating: 4.7,
        spaces: 15,
        featured: true,
        instructor: {
          name: 'Sarah Johnson',
          title: 'Data Scientist & AI Researcher',
          avatar: '/images/instructor2.jpg'
        }
      },
      {
        title: 'Mobile App Development with React Native',
        description: 'Build cross-platform mobile applications using React Native. Create apps that work on both iOS and Android from a single codebase.',
        price: 69.99,
        image: '/images/react-native.jpg',
        category: 'Mobile Development',
        level: 'Intermediate',
        duration: 6,
        rating: 4.3,
        spaces: 12,
        featured: false,
        instructor: {
          name: 'Mike Williams',
          title: 'Mobile Developer',
          avatar: '/images/instructor3.jpg'
        }
      },
      {
        title: 'UX/UI Design Principles',
        description: 'Learn the fundamental principles of user experience and interface design. Create intuitive, user-friendly designs that delight your users.',
        price: 59.99,
        image: '/images/uxui-design.jpg',
        category: 'Design',
        level: 'Beginner',
        duration: 4,
        rating: 4.8,
        spaces: 18,
        featured: false,
        instructor: {
          name: 'Emma Thompson',
          title: 'UX Designer',
          avatar: '/images/instructor4.jpg'
        }
      },
      {
        title: 'Advanced JavaScript Concepts',
        description: 'Dive deep into advanced JavaScript concepts including closures, prototypes, async programming, and more. Take your JS skills to the next level.',
        price: 89.99,
        image: '/images/advanced-js.jpg',
        category: 'Web Development',
        level: 'Advanced',
        duration: 7,
        rating: 4.9,
        spaces: 10,
        featured: false,
        instructor: {
          name: 'Alex Rodriguez',
          title: 'Senior JavaScript Developer',
          avatar: '/images/instructor5.jpg'
        }
      },
      {
        title: 'Machine Learning Fundamentals',
        description: 'Understand the core concepts of machine learning and build your first ML models with Python and scikit-learn.',
        price: 99.99,
        image: '/images/machine-learning.jpg',
        category: 'Data Science',
        level: 'Advanced',
        duration: 10,
        rating: 4.6,
        spaces: 8,
        featured: false,
        instructor: {
          name: 'Dr. Lisa Chen',
          title: 'ML Engineer & Researcher',
          avatar: '/images/instructor6.jpg'
        }
      },
      {
        title: 'Python for Beginners',
        description: 'Learn Python programming from scratch. Understand the basics of Python syntax, data structures, and control flow.',
        price: 39.99,
        image: '/images/python.jpg',
        category: 'Programming',
        level: 'Beginner',
        duration: 6,
        rating: 4.4,
        spaces: 25,
        featured: false,
        instructor: {
          name: 'David Brown',
          title: 'Python Developer',
          avatar: '/images/instructor7.jpg'
        }
      },
      {
        title: 'Cloud Computing with AWS',
        description: 'Get started with Amazon Web Services (AWS) and learn how to deploy and manage applications in the cloud.',
        price: 89.99,
        image: '/images/aws.jpg',
        category: 'Cloud Computing',
        level: 'Intermediate',
        duration: 7,
        rating: 4.7,
        spaces: 14,
        featured: false,
        instructor: {
          name: 'Karen White',
          title: 'Cloud Architect',
          avatar: '/images/instructor8.jpg'
        }
      },
      {
        title: 'Cybersecurity Basics',
        description: 'Learn the fundamentals of cybersecurity, including threat detection, encryption, and secure coding practices.',
        price: 69.99,
        image: '/images/cybersecurity.jpg',
        category: 'Security',
        level: 'Beginner',
        duration: 5,
        rating: 4.5,
        spaces: 20,
        featured: false,
        instructor: {
          name: 'James Lee',
          title: 'Cybersecurity Expert',
          avatar: '/images/instructor9.jpg'
        }
      },
      {
        title: 'DevOps Essentials',
        description: 'Understand the principles of DevOps and learn how to implement CI/CD pipelines, containerization, and automation.',
        price: 79.99,
        image: '/images/devops.jpg',
        category: 'DevOps',
        level: 'Intermediate',
        duration: 8,
        rating: 4.6,
        spaces: 16,
        featured: false,
        instructor: {
          name: 'Rachel Green',
          title: 'DevOps Engineer',
          avatar: '/images/instructor10.jpg'
        }
      }
    ];
    
    await Lesson.deleteMany({}); // Clear existing data
    await Lesson.insertMany(sampleLessons);
    
    res.json({ message: 'Sample lessons seeded successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;