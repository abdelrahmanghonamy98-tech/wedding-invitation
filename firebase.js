/**
 * Firebase Configuration & Service Module
 * Handles Firestore collections: Visitors, RSVP, GuestBook, Statistics
 */

// Replace the configuration object below with your Firebase Project config
export const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID",
  measurementId: "YOUR_MEASUREMENT_ID"
};

// CDN Imports for Firebase v10+ Web SDK (ES Modules)
import { initializeApp } from "[https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js](https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js)";
import { 
  getFirestore, collection, addDoc, getDocs, deleteDoc, doc, 
  serverTimestamp, query, orderBy, limit 
} from "[https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js](https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js)";
import { getAnalytics, logEvent } from "[https://www.gstatic.com/firebasejs/10.8.0/firebase-analytics.js](https://www.gstatic.com/firebasejs/10.8.0/firebase-analytics.js)";

let db = null;
let analytics = null;
let isInitialized = false;

/**
 * Initialize Firebase services
 */
export function initFirebase() {
  try {
    if (firebaseConfig.apiKey !== "YOUR_API_KEY") {
      const app = initializeApp(firebaseConfig);
      db = getFirestore(app);
      analytics = getAnalytics(app);
      isInitialized = true;
      console.log("Firebase Service Initialized Successfully.");
    } else {
      console.warn("Firebase running in Mock/Offline mode. Update firebaseConfig to sync live.");
    }
  } catch (error) {
    console.error("Firebase Initialization Error:", error);
  }
}

/**
 * XSS Input Sanitization
 */
export function sanitizeInput(str) {
  if (typeof str !== 'string') return str;
  return str.replace(/[&<>"']/g, (match) => {
    const map = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#x27;'
    };
    return map[match];
  });
}

/**
 * Basic Rate Limiting check (LocalStorage backed)
 */
function isRateLimited(actionKey, cooldownMs = 60000) {
  const lastAction = localStorage.getItem(`rate_${actionKey}`);
  const now = Date.now();
  if (lastAction && now - parseInt(lastAction, 10) < cooldownMs) {
    return true;
  }
  localStorage.setItem(`rate_${actionKey}`, now.toString());
  return false;
}

/**
 * Save RSVP Entry
 */
export async function submitRSVP(data) {
  if (isRateLimited('rsvp', 30000)) {
    throw new Error("يرجى الانتظار قليلاً قبل إرسال تأكيد آخر.");
  }

  const payload = {
    name: sanitizeInput(data.name),
    phone: sanitizeInput(data.phone),
    guests: parseInt(data.guests, 10) || 1,
    attendance: sanitizeInput(data.attendance),
    message: sanitizeInput(data.message || ''),
    createdAt: serverTimestamp()
  };

  if (isInitialized && db) {
    const docRef = await addDoc(collection(db, "RSVP"), payload);
    if (analytics) logEvent(analytics, 'rsvp_submitted', { attendance: payload.attendance });
    return docRef.id;
  } else {
    // LocalStorage Fallback for preview mode
    const localData = JSON.parse(localStorage.getItem('mock_rsvp') || '[]');
    localData.push({ ...payload, id: Date.now().toString(), createdAt: new Date().toISOString() });
    localStorage.setItem('mock_rsvp', JSON.stringify(localData));
    return "mock_id_" + Date.now();
  }
}

/**
 * Save Guestbook Message
 */
export async function submitGuestMessage(data) {
  if (isRateLimited('guestbook', 15000)) {
    throw new Error("يرجى الانتظار بين كل تهنئة والأخرى.");
  }

  const payload = {
    name: sanitizeInput(data.name),
    message: sanitizeInput(data.message),
    createdAt: serverTimestamp()
  };

  if (isInitialized && db) {
    const docRef = await addDoc(collection(db, "GuestBook"), payload);
    if (analytics) logEvent(analytics, 'guestbook_posted');
    return docRef.id;
  } else {
    const localData = JSON.parse(localStorage.getItem('mock_guestbook') || '[]');
    const newEntry = { ...payload, id: Date.now().toString(), createdAt: new Date().toISOString() };
    localData.unshift(newEntry);
    localStorage.setItem('mock_guestbook', JSON.stringify(localData));
    return newEntry;
  }
}

/**
 * Fetch Guestbook Messages
 */
export async function fetchGuestMessages(maxCount = 20) {
  if (isInitialized && db) {
    const q = query(collection(db, "GuestBook"), orderBy("createdAt", "desc"), limit(maxCount));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } else {
    const localData = JSON.parse(localStorage.getItem('mock_guestbook') || '[]');
    return localData.slice(0, maxCount);
  }
}

/**
 * Record Analytics Visit
 */
export async function trackVisit() {
  const visitorId = localStorage.getItem('visitor_id') || 'v_' + Math.random().toString(36).substr(2, 9);
  const isNew = !localStorage.getItem('visitor_id');
  localStorage.setItem('visitor_id', visitorId);

  const visitPayload = {
    visitorId,
    isNew,
    userAgent: navigator.userAgent,
    timestamp: serverTimestamp()
  };

  if (isInitialized && db) {
    await addDoc(collection(db, "Visitors"), visitPayload);
  } else {
    const count = parseInt(localStorage.getItem('mock_visitor_count') || '0', 10);
    localStorage.setItem('mock_visitor_count', (count + 1).toString());
  }
}

/**
 * Fetch Admin Dashboard Data
 */
export async function fetchAdminData() {
  if (isInitialized && db) {
    const rsvpSnap = await getDocs(collection(db, "RSVP"));
    const guestSnap = await getDocs(collection(db, "GuestBook"));
    const visitorSnap = await getDocs(collection(db, "Visitors"));

    return {
      rsvps: rsvpSnap.docs.map(d => ({ id: d.id, ...d.data() })),
      messages: guestSnap.docs.map(d => ({ id: d.id, ...d.data() })),
      visitorsCount: visitorSnap.size
    };
  } else {
    return {
      rsvps: JSON.parse(localStorage.getItem('mock_rsvp') || '[]'),
      messages: JSON.parse(localStorage.getItem('mock_guestbook') || '[]'),
      visitorsCount: parseInt(localStorage.getItem('mock_visitor_count') || '124', 10)
    };
  }
}

/**
 * Delete Document Helper (Admin)
 */
export async function deleteDocument(colName, docId) {
  if (isInitialized && db) {
    await deleteDoc(doc(db, colName, docId));
  } else {
    const key = colName === 'RSVP' ? 'mock_rsvp' : 'mock_guestbook';
    let data = JSON.parse(localStorage.getItem(key) || '[]');
    data = data.filter(item => item.id !== docId);
    localStorage.setItem(key, JSON.stringify(data));
  }
}