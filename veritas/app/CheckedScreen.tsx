import React, { useEffect, useState, useRef } from 'react';
import { View, Text, ScrollView, StyleSheet, ActivityIndicator, Image, Animated, TextInput, Linking } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { analyzeTextAccuracy, fetchSupportingArticles } from '../app/services/api';
import axios from 'axios';

export default function FactCheckScreen({ route }) {
    const { pdfUrl, pdfText, documentName } = route.params || {};
    const [accuracyScore, setAccuracyScore] = useState(null);
    const [articles, setArticles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchResults, setSearchResults] = useState({});
    const progressAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        async function analyzeText() {
            if (!pdfText) return;

            setLoading(true);
            progressAnim.setValue(0);  // Reset progress bar

            // Start the progress bar animation
            Animated.timing(progressAnim, {
                toValue: 100,  // Target completion
                duration: 3000,  // Duration
                useNativeDriver: false,
            }).start();

            try {
                const data = await analyzeTextAccuracy(pdfText);
                setAccuracyScore(data.accuracyScore);

                // Always fetch supporting articles regardless of accuracy score
                const supportingArticles = await fetchSupportingArticles(pdfText);
                setArticles(supportingArticles);

            } catch (error) {
                console.error('Error analyzing text:', error);
            } finally {
                // Complete progress bar animation after loading is finished
                Animated.timing(progressAnim, {
                    toValue: 100,
                    duration: 500,
                    useNativeDriver: false,
                }).start(() => setLoading(false));
            }
        }

        analyzeText();
    }, [pdfText]);

    const searchGoogleForArticle = async (articleTitle, index) => {
        try {
            const API_KEY = 'AIzaSyABcEV78efo3MPyYh8Pf4Q3a1IyH4MdQJE';  // Replace with your Google API key
            const CX = 'd04047984f8654faa'; // Replace with your Custom Search Engine ID
            const response = await axios.get(
                `https://www.googleapis.com/customsearch/v1?q=${articleTitle}&key=${API_KEY}&cx=${CX}`
            );
            const firstResult = response.data.items ? response.data.items[0].link : null;
            setSearchResults((prevResults) => ({
                ...prevResults,
                [index]: firstResult,
            }));
        } catch (error) {
            console.error("Error fetching search results:", error);
        }
    };

    useEffect(() => {
        articles.forEach((article, index) => {
            searchGoogleForArticle(article.title, index);
        });
    }, [articles]);

    const renderSupportingArticles = () => {
        if (articles.length === 0) {
            return <Text style={styles.warningText}>No supporting articles available.</Text>;
        }

        return articles.map((article, index) => (
            <View key={index} style={styles.articleCard}>
                <Image style={styles.articleIcon} source={require('../assets/images/web_icon.png')} />
                
                {/* Render the clickable title if there's a search result */}
                {searchResults[index] ? (
                    <Text
                        style={styles.articleTitle} // Apply the same style as the article title
                        onPress={() => Linking.openURL(searchResults[index])} // Open URL in browser
                    >
                        {article.title} {/* Title remains the same */}
                    </Text>
                ) : (
                    <Text style={styles.loadingText}>Searching...</Text>
                )}
                
                <Text style={styles.articleSource}>{article.source}</Text>
            </View>
        ));
        
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
                        </View>

                        <View style={styles.progressBar}>
                            <Animated.View style={[styles.progress, { width: progressAnim.interpolate({
                                inputRange: [0, 100],
                                outputRange: ['0%', '100%'],
                            }) }]}/>
                        </View>

                        <Text style={styles.processingText}>Processing...</Text>
                        {loading ? (
                            <ActivityIndicator size="large" color="#0FA5EF" />
                        ) : (
                            <>
                                <View style={styles.accuracySection}>
                                    <Text style={styles.accuracyLabel}>Accuracy</Text>
                                    <Text style={styles.accuracyPercentage}>{accuracyScore ? `${Math.round(accuracyScore)}%` : 'N/A'}</Text>
                                    {accuracyScore && accuracyScore < 50 && (
                                        <Text style={styles.warningText}>The document's accuracy is below 50%. Please verify with credible sources.</Text>
                                    )}
                                </View>

                                <View style={styles.supportingArticles}>
                                    <Text style={styles.articlesLabel}>Supporting Articles:</Text>
                                    {renderSupportingArticles()}
                                </View>
                            </>
                        )}
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
        height: 96,
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
        marginTop: 17,
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
        flexDirection: 'row',             // Keep the icon and title in a row
        alignItems: 'center',           // Centers the content horizontally within the container
        backgroundColor: '#F5F8FA',
        borderRadius: 15,
        padding: 15,
        height: 96,
        width: '100%',
        overflow: 'hidden',              // Prevents content from overflowing outside
        flexWrap: 'nowrap',              // Prevents wrapping
        marginBottom: 7,
    },
    
    articleIcon: {
        width: 53,
        height: 53,
        marginRight: 10,
    },
    
    articleSource: {
        fontSize: 16,
        color: '#808089',
        fontFamily: 'MontserratReg',
    },
    
    articleTitle: {
        fontSize: 17,
        fontWeight: 'bold',
        color: '#001A23',
        fontFamily: 'FuturaPTBold',
        flexShrink: 1, // Ensures title can shrink if needed to avoid overflow
        flexWrap: 'wrap', // Allows title to wrap if it's too long
        maxWidth: '80%', // Optional: limits the width of the title to ensure it doesn't overflow
    },
    warningText: {
        fontSize: 16,
        color: '#FF5733',
        fontWeight: 'bold',
    },
    successText: {
        fontSize: 16,
        color: '#2E8B57',
        fontWeight: 'bold',
    },
    errorText: {
        fontSize: 16,
        color: '#FF6347',
        fontWeight: 'bold',
    },
});
