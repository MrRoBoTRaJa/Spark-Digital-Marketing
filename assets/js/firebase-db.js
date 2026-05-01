import { firebaseSettings } from "./firebase-config.js";
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-app.js";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  getFirestore,
  orderBy,
  query,
  serverTimestamp,
  setDoc
} from "https://www.gstatic.com/firebasejs/10.14.1/firebase-firestore.js";

const state = {
  db: null,
  enabled: false
};

const hasConfig = () =>
  firebaseSettings.enabled &&
  firebaseSettings.config.apiKey &&
  !firebaseSettings.config.apiKey.startsWith("PASTE_");

if (hasConfig()) {
  const app = initializeApp(firebaseSettings.config);
  state.db = getFirestore(app);
  state.enabled = true;
}

const requireDb = () => {
  if (!state.enabled || !state.db) {
    return null;
  }
  return state.db;
};

const saveDocument = async (collectionName, data) => {
  const db = requireDb();
  if (!db || !data?.id) {
    return false;
  }
  await setDoc(doc(db, collectionName, data.id), {
    ...data,
    createdAt: serverTimestamp()
  }, { merge: true });
  return true;
};

const readCollection = async (collectionName) => {
  const db = requireDb();
  if (!db) {
    return [];
  }
  const snapshot = await getDocs(query(collection(db, collectionName), orderBy("createdAt", "desc")));
  return snapshot.docs.map((entry) => ({
    id: entry.id,
    ...entry.data()
  }));
};

export const sparkDB = {
  enabled: state.enabled,
  saveServiceRequest: (data) => saveDocument("serviceRequests", data),
  saveSmmOrder: (data) => saveDocument("smmOrders", data),
  getServiceRequests: () => readCollection("serviceRequests"),
  getSmmOrders: () => readCollection("smmOrders"),
  saveSiteSettings: async (settings) => {
    const db = requireDb();
    if (!db) {
      return false;
    }
    await setDoc(doc(db, "siteSettings", "main"), {
      ...settings,
      updatedAt: serverTimestamp()
    }, { merge: true });
    return true;
  },
  getSiteSettings: async () => {
    const db = requireDb();
    if (!db) {
      return null;
    }
    const snapshot = await getDoc(doc(db, "siteSettings", "main"));
    return snapshot.exists() ? snapshot.data() : null;
  }
};
