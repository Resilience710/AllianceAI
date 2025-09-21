const { initializeTestEnvironment, assertFails, assertSucceeds } = require('@firebase/rules-unit-testing')
const { readFileSync } = require('fs')
const {
  addDoc,
  collection,
  doc,
  getDocs,
  query,
  setDoc,
  Timestamp,
  where,
} = require('firebase/firestore')

async function run() {
  const testEnv = await initializeTestEnvironment({
    projectId: 'ai-marketplace-40a6b',
    firestore: {
      rules: readFileSync('firestore.rules', 'utf8'),
    },
  })

  try {
    await testEnv.withSecurityRulesDisabled(async (context) => {
      const adminDb = context.firestore()
      await setDoc(doc(adminDb, 'users', 'provider-1'), { role: 'provider', email: 'provider@example.com' })
      await setDoc(doc(adminDb, 'users', 'client-1'), { role: 'client', email: 'client@example.com' })
      await setDoc(doc(adminDb, 'services', 'public-service'), {
        ownerUid: 'provider-1',
        providerName: 'Provider One',
        title: 'Public Service',
        shortDescription: 'Visible to all',
        category: 'Automation',
        price: 500,
        tags: ['automation'],
        visibility: 'public',
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
      })
    })

    const providerContext = testEnv.authenticatedContext('provider-1')
    const providerDb = providerContext.firestore()
    const now = Timestamp.now()
    const createResult = await assertSucceeds(
      addDoc(collection(providerDb, 'services'), {
        ownerUid: 'provider-1',
        providerName: 'Provider One',
        title: 'Draft Service',
        shortDescription: 'Only provider can see',
        category: 'Automation',
        price: 1200,
        tags: ['draft'],
        visibility: 'draft',
        createdAt: now,
        updatedAt: now,
      })
    )

    const ownerQuery = query(collection(providerDb, 'services'), where('ownerUid', '==', 'provider-1'))
    await assertSucceeds(getDocs(ownerQuery))

    const clientContext = testEnv.authenticatedContext('client-1')
    const clientDb = clientContext.firestore()
    await assertFails(
      addDoc(collection(clientDb, 'services'), {
        ownerUid: 'client-1',
        providerName: 'Client User',
        title: 'Invalid',
        shortDescription: 'Should fail',
        category: 'Automation',
        price: 100,
        tags: [],
        visibility: 'draft',
        createdAt: now,
        updatedAt: now,
      })
    )

    const publicQuery = query(collection(clientDb, 'services'), where('visibility', '==', 'public'))
    await assertSucceeds(getDocs(publicQuery))

    console.log('Firestore rule tests passed.', { createdId: createResult.id })
  } finally {
    await testEnv.cleanup()
  }
}

run().catch((error) => {
  console.error(error)
  process.exit(1)
})
