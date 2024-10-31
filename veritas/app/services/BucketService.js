import { collection, addDoc } from "firebase/firestore";
import { firestore } from "../firebase";

// Save document URL to Firestore
export const saveDocumentUrlToFirestore = async (downloadURL, collectionName, docData) => {
    try {
        const docRef = await addDoc(collection(firestore, collectionName), {
            ...docData,
            fileUrl: downloadURL,
            createdAt: new Date()
        });
        console.log('Document written with ID: ', docRef.id);
    } catch (e) {
        console.error("Error adding document: ", e);
    }
};

import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { storage } from "../firebase";

// Handle document upload
export const handleUploadOfDocument = async (uri, fileName) => {
    try {
        const blob = await new Promise((resolve, reject) => {
            const xhr = new XMLHttpRequest();
            xhr.onload = function () {
                resolve(xhr.response);
            };
            xhr.onerror = function (e) {
                console.error(e);
                reject(new TypeError("Network request failed"));
            };
            xhr.responseType = "blob";
            xhr.open("GET", uri, true);
            xhr.send(null);
        });

        const documentRef = ref(storage, fileName);

        const uploadResult = await uploadBytes(documentRef, blob);

        blob.close();

        const downloadURL = await getDownloadURL(documentRef);

        return downloadURL;
    } catch (error) {
        console.error("Error uploading document: ", error);
        throw error;
    }
};

// Upload and save document
export const uploadAndSaveDocument = async (uri, fileName, collectionName, docData) => {
    try {
        const downloadURL = await handleUploadOfDocument(uri, fileName);
        await saveDocumentUrlToFirestore(downloadURL, collectionName, docData);
    } catch (error) {
        console.error("Error during the upload and save process: ", error);
    }
};

