import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, ScrollView, ActivityIndicator } from 'react-native';
import { SafeAreaView, SafeAreaProvider } from 'react-native-safe-area-context';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage'; // Firebase Storage functions for handling file uploads
import { storage } from '../app/firebase'; // Firebase storage instance configured in a separate file
import { useNavigation } from '@react-navigation/native';
import 'promise.allsettled';
import * as pdfjs from 'pdfjs-dist/es5/build/pdf'; // PDF.js library to extract text from PDF files
import { Platform } from 'react-native';
import * as DocumentPicker from 'expo-document-picker'; // Expo's DocumentPicker for picking documents

// Setup PDF worker for non-web platforms
if (Platform.OS !== 'web') {
    pdfjs.GlobalWorkerOptions.workerSrc = require('pdfjs-dist/es5/build/pdf.worker.entry');
} else {
    // For web, use a CDN link to the PDF worker
    pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;
}

export default function FactCheckScreen() {
    const navigation = useNavigation();
    const [loading, setLoading] = useState(false);
    const [pdfUrl, setPdfUrl] = useState<string | null>(null); // Store the URL of the uploaded PDF
    const [documentName, setDocumentName] = useState<string | null>(null); // Store the document name
    const [pdfText, setPdfText] = useState<string>(''); // Store the extracted text from the PDF

    // Function to handle document selection, upload to Firebase, and text extraction from the PDF
    const handleDocumentSelectionAndUpload = async () => {
        setLoading(true); // Set loading state to true while the document is being processed
        try {
            // Open the document picker for PDF selection
            const result = await DocumentPicker.getDocumentAsync({ type: 'application/pdf' });
            console.log("Result from DocumentPicker:", result);

            if (!result.canceled && result.assets && result.assets.length > 0) {
                const document = result.assets[0];
                setDocumentName(document.name); // Save document name

                const cleanedTitle = document.name.endsWith('.pdf') ? document.name.slice(0, -4) : document.name; // Clean the document title
                console.log('Cleaned Title:', cleanedTitle);

                const documentTitle = cleanedTitle; // Assign cleaned title for future use

                // Create a reference to the Firebase storage location where the PDF will be stored
                const fileRef = ref(storage, `pdfs/${document.name}`);
                // Fetch the PDF from the picked file URI, convert it to a blob, and upload it to Firebase Storage
                const pdfBytes = await fetch(document.uri).then(res => res.blob());
                await uploadBytes(fileRef, pdfBytes); // Upload file to Firebase
                // After upload, retrieve the download URL from Firebase
                const url = await getDownloadURL(fileRef);
                setPdfUrl(url); // Set the PDF URL

                console.log("Uploaded PDF URL:", url);

                // Once the PDF is uploaded, extract text content from it using pdf.js
                const pdfDoc = await pdfjs.getDocument({ url }).promise;
                const text = await extractTextFromPdf(pdfDoc); // Extract text from PDF
                setPdfText(text); // Set the extracted text

                console.log("Extracted PDF Text:", text);
            } else {
                console.log("Document picking canceled or unsuccessful.");
            }
        } catch (error) {
            console.error("Error during document selection, upload, or processing:", error); // Handle any errors
        } finally {
            setLoading(false); // Set loading to false after processing
        }
    };

    // Function to extract text from the PDF document using PDF.js
    const extractTextFromPdf = async (pdfDoc: any) => {
        let fullText = '';
        const numPages = pdfDoc.numPages; // Get the number of pages in the PDF

        // Loop through each page in the PDF and extract its text content
        for (let pageNumber = 1; pageNumber <= numPages; pageNumber++) {
            const page = await pdfDoc.getPage(pageNumber);
            const textContent = await page.getTextContent();
            const pageText = textContent.items.map((item: any) => item.str).join(' ');
            fullText += pageText + '\n'; // Append the text of each page to the full text
        }
        return fullText; // Return the extracted text
    };

    // Function to navigate to the Checked screen with the uploaded document's details
    const handleNavigateToCheckedScreen = () => {
        if (pdfUrl && documentName) {
            navigation.navigate('Checked', { pdfUrl, documentName, pdfText }); // Pass the PDF URL, document name, and extracted text to the Checked screen
        }
    };

    // Function to navigate to the CustomSearch screen with the cleaned document title
    const handleNavigateToSearchScreen = () => {
        if (documentName) {
            navigation.navigate('CustomSearch', { cleanedTitle: documentName }); // Pass the document name to the CustomSearch screen
        }
    };

    return (
        <SafeAreaProvider>
            <SafeAreaView style={{ flex: 1, backgroundColor: "#B7E4FA" }}>
                <ScrollView>
                    <View style={styles.container}>
                        <View style={styles.background}></View>
                        <View style={styles.header}>
                            <Image style={styles.appimage} source={require('../assets/images/icon.png')} />
                            <View>
                                <Text style={styles.greetingText}>Veritas</Text>
                            </View>
                        </View>

                        <View style={styles.uploadSection}>
                            <TouchableOpacity style={styles.touchbutton} onPress={handleDocumentSelectionAndUpload} disabled={loading}>
                                {!pdfUrl ? (
                                    <>
                                        <Image style={styles.uploadicon} source={require('../assets/images/upload_icon.png')} />
                                        <Text style={styles.uploadText}>Tap to upload .pdf file</Text>
                                    </>
                                ) : (
                                    <View style={styles.documentCard}>
                                        <Image style={styles.documentIcon} source={require('../assets/images/document_icon.png')} />
                                        <View>
                                            <Text style={styles.documentTitle}>{documentName || 'Document Name'}</Text>
                                            <Text style={styles.documentDate}>{new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</Text>
                                        </View>
                                    </View>
                                )}
                            </TouchableOpacity>

                            <TouchableOpacity style={styles.factCheckButton} onPress={handleNavigateToCheckedScreen}>
                                <Text style={styles.factCheckButtonText}>Fact Check</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={handleNavigateToSearchScreen} style={styles.factCheckButton}>
                                <Text style={styles.factCheckButtonText}>Search Based on PDF Title</Text>
                            </TouchableOpacity>
                        </View>

                    </View>
                </ScrollView>
            </SafeAreaView>
        </SafeAreaProvider >
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
        padding: 20,
        height: 645,
    },
    background: {
        backgroundColor: '#B7E4FA',
        height: 215,
        width: 500,
        position: 'absolute',
        top: 0,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
    },
    appimage: {
        width: 32,
        height: 32,
        borderRadius: 25,
        marginRight: 10,
    },
    greetingText: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#001A23',
        fontFamily: 'FuturaPTBold',
    },
    uploadSection: {
        backgroundColor: '#F5F8FA',
        borderRadius: 15,
        height: 560,
        alignItems: 'center',
        padding: 20,
    },
    touchbutton: {
        height: 390,
        width: '100%',
        backgroundColor: '#B7E4FA',
        borderRadius: 15,
        alignItems: 'center',
        justifyContent: 'center',
    },
    uploadicon: {
        width: 121,
        height: 159,
        marginBottom: 30,
    },
    uploadText: {
        color: '#808089',
        fontSize: 16,
        fontFamily: 'MontserratReg',
    },
    factCheckButton: {
        backgroundColor: '#0FA5EF',
        paddingVertical: 10,
        paddingHorizontal: 20,
        width: '100%',
        height: 43,
        marginTop: 18,
        borderRadius: 12,
        alignItems: 'center',
    },
    factCheckButtonText: {
        fontSize: 17,
        fontWeight: 'bold',
        color: '#FFFFFF',
        fontFamily: 'FuturaPTBold',
    },
    documentCard: {
        height: 86,
        width: '90%',
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F5F8FA',
        borderRadius: 10,
        padding: 15,
        marginBottom: 10,
        position: 'absolute',
        top: 15,
    },
    documentIcon: {
        width: 33,
        height: 46,
        marginRight: 10,
    },
    documentTitle: {
        fontSize: 16,
        width: 180,
        height: 40,
        fontWeight: 'bold',
        color: '#001A23',
        fontFamily: 'FuturaPTBold',
        overflow: 'hidden',
    },
    documentDate: {
        fontSize: 14,
        color: '#808089',
        fontFamily: 'MontserratReg',
    },
    item: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#F5F8FA',
        borderRadius: 10,
        padding: 15,
        marginBottom: 15,
        height: 96,
    },
    icon: {
        width: 37,
        height: 51,
        marginRight: 15,
        objectFit: 'contain',
    },
    title: {
        fontSize: 17,
        fontWeight: 'bold',
        color: '#001A23',
        fontFamily: 'FuturaPTBold',
        marginBottom: 2,
    },
    date: {
        fontSize: 16,
        color: '#808089',
        fontFamily: 'MontserratReg',
    },
});
