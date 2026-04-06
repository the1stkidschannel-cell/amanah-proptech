const fs = require('fs');
const path = require('path');

// Native .env.local parser to bypass npm script blocks
const envPath = path.join(__dirname, '../.env.local');
if (fs.existsSync(envPath)) {
  const envFile = fs.readFileSync(envPath, 'utf8');
  envFile.split('\n').forEach(line => {
    const [key, value] = line.split('=');
    if (key && value) process.env[key.trim()] = value.replace(/['"]+/g, '').trim();
  });
}

const { initializeApp } = require("firebase/app");
const { getFirestore, collection, addDoc, Timestamp } = require("firebase/firestore");

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const properties = [
  {
    name: "Quartier Berlin-Mitte (Institutional)",
    location: "Berlin, Deutschland",
    type: "Wohnanlage / Mixed-Use",
    targetVolume: 45000000,
    yield: 4.2,
    funded: 15,
    holdingPeriod: "10 Jahre",
    tokenSymbol: "QBM",
    tokenPrice: 1000,
    shariaStructure: "Ijarah",
    status: "Live",
    isInstitutional: true,
    minInvest: 100000,
    image: "https://images.unsplash.com/photo-1570129477492-45c003edd2be?auto=format&fit=crop&q=80&w=800"
  },
  {
    name: "Stadtresidenz München-Ost",
    location: "München, Deutschland",
    type: "Mehrfamilienhaus",
    targetVolume: 8500000,
    yield: 4.8,
    funded: 45,
    holdingPeriod: "7 Jahre",
    tokenSymbol: "SMO",
    tokenPrice: 500,
    shariaStructure: "Diminishing Musharakah",
    status: "Live",
    minInvest: 10000,
    image: "https://images.unsplash.com/photo-1582407947304-fd86f028f716?auto=format&fit=crop&q=80&w=800"
  }
];

async function seed() {
  console.log("[SEED] Starting database population...");
  for (const p of properties) {
    const docRef = await addDoc(collection(db, "properties"), { ...p, createdAt: Timestamp.now() });
    console.log(`[OK] Seeded: ${p.name} (ID: ${docRef.id})`);
  }
}

seed().catch(console.error);
