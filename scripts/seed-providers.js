// Simple script to seed test providers
// Run with: node scripts/seed-providers.js

const admin = require('firebase-admin');

// Initialize Firebase Admin (you'll need to set up service account)
if (!admin.apps.length) {
  admin.initializeApp({
    // Add your Firebase config here
    // For now, this is just a template
  });
}

const db = admin.firestore();

const testProviders = [
  {
    uid: 'provider-1',
    displayName: 'AI Solutions Pro',
    email: 'ai.solutions@example.com',
    role: 'provider',
    bio: 'We specialize in creating enterprise-grade AI automation solutions that transform business processes. Our team of expert AI engineers and data scientists work with Fortune 500 companies to implement cutting-edge artificial intelligence systems.',
    skills: ['Machine Learning', 'Process Automation', 'Custom AI Development', 'Natural Language Processing', 'Computer Vision', 'Deep Learning'],
    location: 'San Francisco, CA',
    verified: true,
    hourlyRate: 150,
    languages: ['English', 'Spanish'],
    timezone: 'America/Los_Angeles',
    experience: 'Expert',
    specializations: ['AI Automation', 'Machine Learning'],
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
    updatedAt: admin.firestore.FieldValue.serverTimestamp()
  },
  {
    uid: 'provider-2', 
    displayName: 'DataFlow Experts',
    email: 'dataflow@example.com',
    role: 'provider',
    bio: 'Specialized in data pipeline automation and AI-driven analytics solutions. We help businesses unlock the power of their data through intelligent automation and machine learning.',
    skills: ['Data Engineering', 'Analytics', 'Python', 'SQL', 'Machine Learning', 'Cloud Computing'],
    location: 'New York, NY',
    verified: true,
    hourlyRate: 120,
    languages: ['English'],
    timezone: 'America/New_York',
    experience: 'Senior',
    specializations: ['Data Analytics', 'Cloud Solutions'],
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
    updatedAt: admin.firestore.FieldValue.serverTimestamp()
  },
  {
    uid: 'provider-3',
    displayName: 'InnovateLabs',
    email: 'innovate@example.com', 
    role: 'provider',
    bio: 'Cutting-edge AI research and development lab focused on creating innovative solutions for complex business challenges. We bring academic research into practical applications.',
    skills: ['Research & Development', 'AI Strategy', 'Consulting', 'Prototyping', 'Innovation'],
    location: 'Austin, TX',
    verified: false,
    hourlyRate: 200,
    languages: ['English', 'French'],
    timezone: 'America/Chicago',
    experience: 'Expert',
    specializations: ['AI Research', 'Innovation Consulting'],
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
    updatedAt: admin.firestore.FieldValue.serverTimestamp()
  }
];

async function seedProviders() {
  try {
    console.log('Seeding test providers...');
    
    for (const provider of testProviders) {
      await db.collection('users').doc(provider.uid).set(provider);
      console.log(`✅ Created provider: ${provider.displayName}`);
    }
    
    console.log('✅ All providers seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding providers:', error);
    process.exit(1);
  }
}

// Uncomment to run seeding
// seedProviders();

console.log('Provider seeding script ready. Configure Firebase Admin and uncomment seedProviders() to run.');
