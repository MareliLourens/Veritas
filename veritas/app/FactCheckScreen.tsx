import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, ScrollView, ActivityIndicator } from 'react-native';
import { SafeAreaView, SafeAreaProvider } from 'react-native-safe-area-context';
import { getDownloadURL, ref } from 'firebase/storage';
import { storage } from '../app/firebase';
import { useNavigation } from '@react-navigation/native';
import 'whatwg-streams';  // Polyfill for ReadableStream
import 'promise.allsettled'; 
import * as pdfjs from 'pdfjs-dist/es5/build/pdf';
import { Platform } from 'react-native';

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
    const [pdfText, setPdfText] = useState<string>(''); // Variable to store extracted PDF text

    const handleDocumentLoad = async () => {
        setLoading(true);
        try {
            // Reference to the PDF file in Firebase Storage
            const pdfRef = ref(storage, 'sample.pdf');  // Ensure this path is correct
            const url = await getDownloadURL(pdfRef); // Fetch the download URL for the PDF

            // Set the state to hold the URL and document name
            setPdfUrl(url);
            setDocumentName('sample.pdf');
            console.log("PDF URL:", url);

            // Fetch the PDF file from the URL and extract text
            const pdfBytes = await fetch(url).then((res) => res.arrayBuffer());
            const pdfDoc = await pdfjs.getDocument(pdfBytes).promise;

            // Extract text from the PDF document
            const text = await extractTextFromPdf(pdfDoc);

            // Set extracted text in state and log it
            setPdfText(text);
            console.log("Extracted PDF Text:", text);

        } catch (error) {
            console.error("Error loading or processing PDF:", error);
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
            const textContent = await page.getTextContent(); // Get text content from page
            const pageText = textContent.items.map((item: any) => item.str).join(' '); // Join all the text items into one string
            fullText += pageText + '\n'; // Append text from all pages
        }
        return fullText;
    };

    const handleNavigateToCheckedScreen = () => {
        if (pdfUrl && documentName) {
            navigation.navigate('Checked', { pdfUrl, documentName });
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
                            <TouchableOpacity style={styles.touchbutton} onPress={handleDocumentLoad} disabled={loading}>
                                <Image style={styles.uploadicon} source={require('../assets/images/upload_icon.png')} />
                                <Text style={styles.uploadText}>Tap to upload .pdf file</Text>
                                {pdfUrl && (
                                    <View style={styles.documentCard}>
                                        <Image style={styles.documentIcon} source={require('../assets/images/document_icon.png')} />
                                        <View>
                                            <Text style={styles.documentTitle}>{documentName || 'Document Name'}</Text>
                                            <Text style={styles.documentDate}>20 June 2024</Text>
                                        </View>
                                    </View>
                                )}
                            </TouchableOpacity>
                            {loading && <ActivityIndicator size="large" color="#0FA5EF" style={styles.loadingIndicator} />}
                            
                            <TouchableOpacity style={styles.factCheckButton} onPress={handleNavigateToCheckedScreen}>
                                <Text style={styles.factCheckButtonText}>Fact Check</Text>
                            </TouchableOpacity>
                        </View>

                    </View>
                </ScrollView>
            </SafeAreaView>
        </SafeAreaProvider>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#B7E4FA',
        padding: 20,
    },
    background: {
        backgroundColor: '#FFFFFF',
        height: 700,
        width: 500,
        position: 'absolute',
        bottom: 0,
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
        width: '90%',
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
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#CBE9F8',
        borderRadius: 10,
        padding: 15,
        marginBottom: 10,
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
});
