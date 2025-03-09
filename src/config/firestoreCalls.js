import firebaseAcademia from './firebaseConfig';
import {
  collection,
  getDocs,
  getFirestore,
  query,
  addDoc,
  deleteDoc,
  doc,
  updateDoc, 
} from 'firebase/firestore';
const db = getFirestore(firebaseAcademia);

export const readDataFirestore = async (path) => {
  const q = query(collection(db, path));
  const querySnapshot = await getDocs(q);
  return querySnapshot;
};

export const addTaskFirestore = async (path, task) => {
  const docRef = await addDoc(collection(db, path), task);
  return docRef.id; 
};

export const deleteTaskFirestore = async (path, taskId) => {
  await deleteDoc(doc(db, path, taskId));
};

export const updateTaskFirestore = async (path, taskId, completed) => {
  await updateDoc(doc(db, path, taskId), {
    completed: completed, 
  });
};