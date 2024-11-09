import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, StyleSheet, ActivityIndicator, Image } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { analyzeTextAccuracy, fetchSupportingArticles } from '../app/services/api';

export default function FactCheckScreen({ route }) {
    const { pdfUrl, pdfText, documentName } = route.params || {};
    const [accuracyScore, setAccuracyScore] = useState(null);
    const [articles, setArticles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [entityVerificationResults, setEntityVerificationResults] = useState([]);

    useEffect(() => {
        async function analyzeText() {
            if (!pdfText) return;

            setLoading(true);
            try {
                console.log('Starting text analysis...');

                // Send entire text to the API for analysis
                const data = await analyzeTextAccuracy(pdfText); // Ensure that this function processes the whole text
                console.log('Received accuracy data:', data);

                setAccuracyScore(data.accuracyScore);
                setEntityVerificationResults(data.entityVerificationResults);

                if (data.accuracyScore < 50) {
                    // Fetch supporting articles if accuracy score is below 50
                    const supportingArticles = await fetchSupportingArticles(pdfText);
                    setArticles(supportingArticles);
                }
            } catch (error) {
                console.error('Error analyzing text:', error);
            } finally {
                setLoading(false);
                console.log('Text analysis completed.');
            }
        }

        analyzeText();
    }, [pdfText]);

    const renderEntityVerificationResults = () => {
        if (!Array.isArray(entityVerificationResults)) {
          return <Text style={styles.warningText}>No entity verification results available.</Text>;
        }

        return entityVerificationResults.map((result, index) => {
          if (result === undefined) {
            return (
              <Text key={index} style={styles.warningText}>Entity {index + 1} could not be verified.</Text>
            );
          }
          return (
            <Text key={index} style={result ? styles.successText : styles.errorText}>
              Entity {index + 1}: {result ? 'Verified' : 'Not Verified'}
            </Text>
          );
        });
      };

    return (
        <SafeAreaProvider>
            <SafeAreaView style={{ flex: 1, backgroundColor: '#B7E4FA' }}>
                <ScrollView>
                <View style={styles.container}>
                <View style={styles.background}></View>
                        <View style={styles.uploadSection}>
                            {pdfUrl && (
                            <View style={styles.documentCard}>
                                <Image style={styles.documentIcon} source={require('../assets/images/document_icon.png')} />
                                <View>
                                    <Text style={styles.documentTitle}>{documentName || 'Document Name'}</Text>
                                    <Text style={styles.documentDate}>{new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</Text>
                                </View>
                            </View>
                        )}
                        {loading ? (
                            <ActivityIndicator size="large" color="#0FA5EF" />
                        ) : (
                            <>
                                <Text>Accuracy: {accuracyScore ? `${Math.round(accuracyScore)}%` : 'N/A'}</Text>
                                {accuracyScore < 50 && <Text style={styles.warningText}>The document's accuracy is below 50%. Please verify with credible sources.</Text>}
                                {renderEntityVerificationResults()}
                                <Text>Supporting Articles:</Text>
                                {/* {/* {articles && articles.length > 0 ? (
                                    articles.map((article, index) => (
                                        <View key={index} style={styles.articleCard}>
                                            <Image style={styles.articleIcon} source={require('../assets/images/web_icon.png')} />
                                            <View>
                                                <Text style={styles.articleTitle}>{article.title}</Text>
                                                <Text style={styles.articleSource}>{article.source}</Text>
                                            </View>
                                        </View>
                                    ))
                                ) : (
                                    <Text>No relevant articles found</Text>
                                )}  */}
                            </>
                        )}

                        </View>
                        <View style={styles.progressBar}>
                            <View style={styles.progress}></View>
                        </View>
                        <Text style={styles.processingText}>Processing</Text>
                    </View>
                </ScrollView>
            </SafeAreaView>
        </SafeAreaProvider>
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
    urlSection: {
        marginBottom: 20,
        width: '100%',
    },
    urlLabel: {
        fontSize: 17,
        fontWeight: 'bold',
        color: '#001A23',
        fontFamily: 'FuturaPTBold',
        marginTop: 17,
        marginBottom: 17,
    },
    urlInputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderColor: '#0FA5EF',
        borderWidth: 1,
        borderRadius: 15,
        paddingHorizontal: 10,
        height: 50,
        backgroundColor: '#FFFFFF',
    },
    urlInput: {
        flex: 1,
        color: '#333',
        paddingHorizontal: 10,
    },
    factCheckUrlButton: {
        backgroundColor: '#0FA5EF',
        paddingVertical: 10,
        paddingHorizontal: 15,
        borderRadius: 10,
        marginLeft: 5,
    },
    factCheckButtonText2: {
        color: '#FFFFFF',
        fontWeight: 'bold',
        fontSize: 14,
    },
    historySection: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    historyLabel: {
        fontSize: 17,
        fontWeight: 'bold',
        color: '#001A23',
        fontFamily: 'FuturaPTBold',
        marginBottom: 17,
    },
    viewAllText: {
        color: '#0FA5EF',
        fontSize: 14,
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
        color: '#000',
        marginBottom: 2
    },
    date: {
        fontSize: 16,
        color: '#808089',
        fontFamily: 'MontserratReg',
    },
    percentage: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#000',
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
    uploadPrompt: {
        fontSize: 16,
        color: '#808089',
        textAlign: 'center',
        marginVertical: 10,
        position: 'absolute',
        fontFamily: 'MontserratReg',
        bottom: 5,
    },
    progressBar: {
        height: 15,
        width: '100%',
        backgroundColor: '#CBE9F8',
        borderRadius: 15,
        overflow: 'hidden',
        marginTop: 20,
    },
    progress: {
        width: '50%',
        height: '100%',
        backgroundColor: '#0FA5EF',
    },
    processingText: {
        fontSize: 16,
        color: '#808089',
        textAlign: 'center',
        marginVertical: 10,
    },
    accuracySection: {
        marginBottom: 20,
    },
    accuracyLabel: {
        fontSize: 20,
        fontFamily: 'FuturaPTBold',
        color: '#001A23',
        fontWeight: 'bold',
    },
    accuracyPercentage: {
        fontSize: 32,
        fontFamily: 'FuturaPTBold',
        fontWeight: 'bold',
        color: '#001A23',
    },
    supportingArticles: {
        backgroundColor: '#FFFFFF',
        borderRadius: 15,
    },
    articlesLabel: {
        fontSize: 20,
        fontFamily: 'FuturaPTBold',
        color: '#001A23',
        fontWeight: 'bold',
        marginBottom: 10,
    },
    articleCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F5F8FA',
        borderRadius: 15,
        padding: 15,
        height: 96,
    },
    articleIcon: {
        width: 53,
        height: 53,
        marginRight: 10,
    },
    articleTitle: {
        fontSize: 17,
        fontWeight: 'bold',
        color: '#001A23',
        fontFamily: 'FuturaPTBold',
    },
    articleSource: {
        fontSize: 16,
        color: '#808089',
        fontFamily: 'MontserratReg',
    },

});
