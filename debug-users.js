// Debug script to check users in Firestore
const { initializeApp } = require('firebase/app');
const { getFirestore, collection, getDocs } = require('firebase/firestore');

const firebaseConfig = {
  apiKey: "AIzaSyD-mCZD4AGZfXUITlcbx-PIs tAY2ATnWvw",
  authDomain: "ai-marketplace-40a6b.firebaseapp.com",
  projectId: "ai-marketplace-40a6b",
  storageBucket: "ai-marketplace-40a6b.appspot.com",
  messagingSenderId: "823145816840",
  appId: "1:823145816840:web:ac23545c754985219802bd"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function debugUsers() {
  try {
    console.log('🔍 Checking users in Firestore...');
    
    const usersRef = collection(db, 'users');
    const snapshot = await getDocs(usersRef);
    
    console.log(`📊 Found ${snapshot.size} users in database`);
    
    snapshot.forEach((doc) => {
      const data = doc.data();
      console.log('\n📄 User Document:');
      console.log('ID:', doc.id);
      console.log('Email:', data.email);
      console.log('Role:', data.role);
      console.log('Display Name:', data.displayName);
      console.log('Created At:', data.createdAt);
      console.log('---');
    });
    
    // Check for providers specifically
    const providers = [];
    snapshot.forEach((doc) => {
      const data = doc.data();
      if (data.role === 'provider' || data.role === 'freelancer') {
        providers.push({
          id: doc.id,
          email: data.email,
          role: data.role,
          displayName: data.displayName
        });
      }
    });
    
    console.log(`\n🎯 Found ${providers.length} providers:`);
    providers.forEach(provider => {
      console.log(`- ${provider.displayName} (${provider.email}) - ID: ${provider.id}`);
    });
    
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

debugUsers();
