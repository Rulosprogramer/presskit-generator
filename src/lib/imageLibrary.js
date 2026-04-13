import { collection, addDoc, query, where, getDocs, deleteDoc, doc, getDoc } from 'firebase/firestore';
import { ref, deleteObject } from 'firebase/storage';
import { db, storage } from './firebase';

/**
 * Agrega una imagen a la biblioteca del usuario
 * @param {string} userId - ID del usuario
 * @param {string} imageUrl - URL de descarga de la imagen
 * @param {string} fileName - Nombre del archivo original
 * @param {string} type - Tipo de imagen (cover, recognition, gallery)
 * @returns {Promise<string>} ID del documento agregado
 */
export async function addImageToLibrary({ userId, imageUrl, fileName, type }) {
  const libraryRef = collection(db, 'users', userId, 'imageLibrary');
  const docRef = await addDoc(libraryRef, {
    url: imageUrl,
    fileName: fileName,
    type: type,
    originalName: fileName,
    uploadedAt: new Date(),
  });
  return docRef.id;
}

/**
 * Obtiene todas las imágenes de la biblioteca del usuario
 * @param {string} userId - ID del usuario
 * @param {string} type - Tipo de imagen (opcional: cover, recognition, gallery)
 * @returns {Promise<Array>} Lista de imágenes en la biblioteca
 */
export async function getImageLibrary({ userId, type }) {
  const libraryRef = collection(db, 'users', userId, 'imageLibrary');
  let q;

  if (type) {
    q = query(libraryRef, where('type', '==', type));
  } else {
    q = query(libraryRef);
  }

  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
}

/**
 * Verifica si un archivo con el mismo nombre ya existe en la biblioteca
 * @param {string} userId - ID del usuario
 * @param {string} fileName - Nombre del archivo a verificar
 * @returns {Promise<boolean>} True si existe, false si no
 */
export async function fileExistsInLibrary({ userId, fileName }) {
  const libraryRef = collection(db, 'users', userId, 'imageLibrary');
  const q = query(libraryRef, where('fileName', '==', fileName));
  const snapshot = await getDocs(q);
  return snapshot.docs.length > 0;
}

/**
 * Obtiene metadatos de un archivo en la biblioteca
 * @param {string} userId - ID del usuario
 * @param {string} fileName - Nombre del archivo
 * @returns {Promise<Object|null>} Documento con metadatos o null si no existe
 */
export async function getImageMetadata({ userId, fileName }) {
  const libraryRef = collection(db, 'users', userId, 'imageLibrary');
  const q = query(libraryRef, where('fileName', '==', fileName));
  const snapshot = await getDocs(q);
  
  if (snapshot.docs.length === 0) return null;
  
  const doc = snapshot.docs[0];
  return {
    id: doc.id,
    ...doc.data(),
  };
}

/**
 * Elimina una imagen de la biblioteca
 * @param {string} userId - ID del usuario
 * @param {string} imageId - ID del documento en la biblioteca
 * @param {string} storagePath - Ruta del archivo en Firebase Storage (opcional)
 * @returns {Promise<void>}
 */
export async function deleteImageFromLibrary({ userId, imageId, storagePath }) {
  // Eliminar de Firestore
  const docRef = doc(db, 'users', userId, 'imageLibrary', imageId);
  await deleteDoc(docRef);

  // Eliminar de Storage si está disponible la ruta
  if (storagePath) {
    try {
      const fileRef = ref(storage, storagePath);
      await deleteObject(fileRef);
    } catch (error) {
      console.warn('No se pudo eliminar archivo de Storage:', error);
    }
  }
}

/**
 * Obtiene información de un archivo en la biblioteca por ID
 * @param {string} userId - ID del usuario
 * @param {string} imageId - ID del documento en la biblioteca
 * @returns {Promise<Object|null>}
 */
export async function getImageById({ userId, imageId }) {
  const libraryRef = collection(db, 'users', userId, 'imageLibrary');
  const docRef = doc(libraryRef, imageId);
  const snapshot = await getDoc(docRef);
  
  if (!snapshot.exists()) return null;
  
  return {
    id: snapshot.id,
    ...snapshot.data(),
  };
}
