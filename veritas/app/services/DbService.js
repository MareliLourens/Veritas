import { db } from "../firebase";
import { collection, addDoc } from "firebase/firestore";

export const saveExistingDocumentToFirestore = async (fileName, url) => {
    // try {
    //     console.log("Saving document:", fileName);
        
    //     // Create a reference to the "Documents" collection
    //     const entriesRef = collection(db, 'Documents');
        
    //     // Add a new document to the collection with fileName and upload timestamp
    //     const docRef = await addDoc(entriesRef, {
    //         fileName,
    //         url,
    //         uploadedAt: new Date(),
    //     });

    //     console.log("Document saved successfully with ID:", docRef.id);
    // } catch (error) {
    //     console.error("Error saving document to Firestore:", error);
    // }
};
