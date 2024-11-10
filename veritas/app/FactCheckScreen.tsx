import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, ScrollView, ActivityIndicator } from 'react-native';
import { SafeAreaView, SafeAreaProvider } from 'react-native-safe-area-context';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { storage } from '../app/firebase';
import { useNavigation } from '@react-navigation/native';
// import 'whatwg-streams';  // Polyfill for ReadableStream
import 'promise.allsettled';
import * as pdfjs from 'pdfjs-dist/es5/build/pdf';
import { Platform } from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import { uploadAndSaveDocument } from '../app/services/BucketService'; // Import the upload service

// Check the platform and configure the worker accordingly
if (Platform.OS !== 'web') {
    // Set the workerSrc for React Native environment
    pdfjs.GlobalWorkerOptions.workerSrc = require('pdfjs-dist/es5/build/pdf.worker.entry');
} else {
    // Use the default worker path for web
    pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;
}

export default function FactCheckScreen() {
    const navigation = useNavigation();
    const [loading, setLoading] = useState(false);
    const [pdfUrl, setPdfUrl] = useState<string | null>(null);
    const [documentName, setDocumentName] = useState<string | null>(null);
    const [pdfText, setPdfText] = useState<string>('');

    // Function to handle document selection, upload to Firebase, and text extraction
    const handleDocumentSelectionAndUpload = async () => {
        setLoading(true);
        try {
            const result = await DocumentPicker.getDocumentAsync({ type: 'application/pdf' });
            console.log("Result from DocumentPicker:", result);

            if (!result.canceled && result.assets && result.assets.length > 0) {
                const document = result.assets[0];
                setDocumentName(document.name);

                // Upload to Firebase Storage
                const fileRef = ref(storage, `pdfs/${document.name}`);
                const pdfBytes = await fetch(document.uri).then(res => res.blob());
                await uploadBytes(fileRef, pdfBytes); // Upload the blob to Firebase Storage
                const url = await getDownloadURL(fileRef); // Get the URL for the uploaded PDF

                setPdfUrl(url);
                console.log("Uploaded PDF URL:", url);

                // Fetch the PDF file for text extraction
                const pdfDoc = await pdfjs.getDocument({ url }).promise;
                const text = await extractTextFromPdf(pdfDoc);

                // Set the extracted text in state
                setPdfText(text);
                console.log("Extracted PDF Text:", text);
            } else {
                console.log("Document picking canceled or unsuccessful.");
            }
        } catch (error) {
            console.error("Error during document selection, upload, or processing:", error);
        } finally {
            setLoading(false);
        }
    };

    // Function to extract text from a PDF using pdf.js
    const extractTextFromPdf = async (pdfDoc: any) => {
        let fullText = '';
        const numPages = pdfDoc.numPages;

        for (let pageNumber = 1; pageNumber <= numPages; pageNumber++) {
            const page = await pdfDoc.getPage(pageNumber);
            const textContent = await page.getTextContent();
            const pageText = textContent.items.map((item: any) => item.str).join(' ');
            fullText += pageText + '\n';
        }
        return fullText;
    };

    const handleNavigateToCheckedScreen = () => {
        if (pdfUrl && documentName) {
            navigation.navigate('Checked', { pdfUrl, documentName, pdfText });
        }
    };

    return (
        <SafeAreaProvider>
            <SafeAreaView style={{ flex: 1, backgroundColor: "#B7E4FA" }}>
                <ScrollView>
                    <View style={styles.container}>
                        <View style={styles.background}></View>
                        <View style={styles.header}>
                            <Image style={styles.profileimage} source={require('../assets/images/placeholder_profile.png')} />
                            <View>
                                <Text style={styles.prompttext}>What do you want to fact check today?</Text>
                                <Text style={styles.greetingText}>Hi Mareli</Text>
                            </View>
                        </View>

                        <View style={styles.uploadSection}>
                            <TouchableOpacity style={styles.touchbutton} onPress={handleDocumentSelectionAndUpload} disabled={loading}>
                                {!pdfUrl ? (
                                    // Initial state: display upload icon and text
                                    <>
                                        <Image style={styles.uploadicon} source={require('../assets/images/upload_icon.png')} />
                                        <Text style={styles.uploadText}>Tap to upload .pdf file</Text>
                                    </>
                                ) : (
                                    // After upload: display document card
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
                    </View>
                    <View style={styles.historytitle}>
                        <Text style={styles.historyheader}>History</Text>
                        <Text style={styles.viewall}>View All</Text>
                    </View>
                    <View style={styles.item}>
                        <View style={styles.leftSection}>
                            <Image style={styles.icon} source={require('../assets/images/document_icon.png')} />
                            <View style={styles.textSection}>
                                <Text style={styles.title}>Lions are mammals</Text>
                                <Text style={styles.date}>20 June 2024</Text>
                            </View>
                        </View>
                        <Text style={styles.percentage}>100%</Text>
                    </View>
                    <View style={styles.item}>
                        <View style={styles.leftSection}>
                            <Image style={styles.icon} source={require('../assets/images/document_icon.png')} />
                            <View style={styles.textSection}>
                                <Text style={styles.title}>Lions are mammals</Text>
                                <Text style={styles.date}>20 June 2024</Text>
                            </View>
                        </View>
                        <Text style={styles.percentage}>100%</Text>
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
    profileimage: {
        width: 62,
        height: 62,
        borderRadius: 25,
        marginRight: 10,
    },
    greetingText: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#001A23',
        fontFamily: 'FuturaPTBold',
    },
    prompttext: {
        fontSize: 16,
        color: '#808089',
        width: '85%',
        fontFamily: 'MontserratReg',
    },
    uploadSection: {
        backgroundColor: '#F5F8FA',
        borderRadius: 15,
        height: 436,
        alignItems: 'center',
        padding: 20,
    },
    touchbutton: {
        height: 340,
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
    loadingIndicator: {
        marginTop: 15,
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
        fontWeight: 'bold',
        color: '#001A23',
        fontFamily: 'FuturaPTBold',
    },
    documentDate: {
        fontSize: 14,
        color: '#808089',
        fontFamily: 'MontserratReg',
    },
    historytitle: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
    },
    viewall: {
        position: 'absolute',
        right: 0,
        fontSize: 14,
        fontWeight: 'bold',
        color: '#0FA5EF',
        fontFamily: 'MontserratReg',
    },
    historyheader: {
        fontSize: 20,
        marginBottom: 17,
        fontWeight: 'bold',
        color: '#001A23',
        fontFamily: 'FuturaPTBold',
        marginTop: 17,
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
    leftSection: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    icon: {
        width: 37,
        height: 51,
        marginRight: 15,
        objectFit: 'contain',
    },
    textSection: {
        justifyContent: 'center',
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
    percentage: {
        fontSize: 30,
        fontWeight: 'bold',
        color: '#000',
    },
});
