import React, { useEffect, useState, useRef } from 'react';
import { View, Text, ScrollView, StyleSheet, ActivityIndicator, Image, Animated, TextInput, Linking } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { analyzeTextAccuracy, fetchSupportingArticles } from '../app/services/api'; // Importing custom backend API functions to analyze text and fetch articles
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
            progressAnim.setValue(0);

            // Animate progress bar
            Animated.timing(progressAnim, {
                toValue: 100,
                duration: 3000,
                useNativeDriver: false,
            }).start();

            try {
                // Backend call to analyze the text accuracy
                const data = await analyzeTextAccuracy(pdfText); 
                setAccuracyScore(data.accuracyScore);

                // Fetch supporting articles based on the analyzed text
                const supportingArticles = await fetchSupportingArticles(pdfText);
                setArticles(supportingArticles);

            } catch (error) {
                console.error('Error analyzing text:', error);
            } finally {

                // Final animation to hide progress after processing
                Animated.timing(progressAnim, {
                    toValue: 100,
                    duration: 500,
                    useNativeDriver: false,
                }).start(() => setLoading(false));
            }
        }

        analyzeText(); // Trigger text analysis when pdfText changes
    }, [pdfText]);

    // Function to search for supporting articles using Google Custom Search API
    const searchGoogleForArticle = async (articleTitle, index) => {
        try {
            const API_KEY = 'AIzaSyABcEV78efo3MPyYh8Pf4Q3a1IyH4MdQJE'; // API key for Google Custom Search
            const CX = 'd04047984f8654faa'; // Custom Search Engine ID
            // Send GET request to Google's custom search API
            const response = await axios.get(
                `https://www.googleapis.com/customsearch/v1?q=${articleTitle}&key=${API_KEY}&cx=${CX}`
            );
            // Extract the first search result link
            const firstResult = response.data.items ? response.data.items[0].link : null;
            setSearchResults((prevResults) => ({
                ...prevResults,
                [index]: firstResult, // Store the result for the specific article index
            }));
        } catch (error) {
            console.error("Error fetching search results:", error); // Handle error from the Google search API
        }
    };

    // Trigger Google search for each article once supporting articles are fetched
    useEffect(() => {
        articles.forEach((article, index) => {
            searchGoogleForArticle(article.title, index); // Perform Google search for each article title
        });
    }, [articles]);

    // Function to render supporting articles and their links
    const renderSupportingArticles = () => {
        if (articles.length === 0) {
            return <Text style={styles.warningText}>No supporting articles available.</Text>;
        }

        return articles.map((article, index) => (
            <View key={index} style={styles.articleCard}>
                <Image style={styles.articleIcon} source={require('../assets/images/web_icon.png')} />

                <View style={styles.articleTextContainer}>
                    {searchResults[index] ? (
                        // Render article title as a clickable link if a search result is available
                        <Text
                            style={styles.articleTitle}
                            onPress={() => Linking.openURL(searchResults[index])} // Open the search result link
                        >
                            {article.title}
                        </Text>
                    ) : (
                        <Text style={styles.loadingText}>Searching...</Text> // Display "Searching..." if no result found yet
                    )}

                    <Text style={styles.articleSource}>{article.source}</Text>
                </View>
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
                            <Animated.View style={[styles.progress, {
                                width: progressAnim.interpolate({
                                    inputRange: [0, 100],
                                    outputRange: ['0%', '100%'],
                                })
                            }]} />
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
    uploadSection: {
        backgroundColor: '#F5F8FA',
        borderRadius: 15,
        height: 436,
        alignItems: 'center',
        padding: 20,
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
        width: 180,
        height: 40,
    },
    documentDate: {
        fontSize: 14,
        color: '#808089',
        fontFamily: 'MontserratReg',
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
        flexDirection: 'row',            
        alignItems: 'center',           
        backgroundColor: '#F5F8FA',
        borderRadius: 15,
        padding: 15,
        height: 96,
        width: '100%',
        overflow: 'hidden',             
        flexWrap: 'nowrap',             
        marginBottom: 7,
    },
    articleIcon: {
        width: 53,
        height: 53,
        marginRight: 10,
    },
    articleSource: {
        fontFamily: 'MontserratReg',
        width: 220,
        height: 18,
        marginTop: 4,
    },
    articleTitle: {
        fontSize: 17,
        fontWeight: 'bold',
        color: '#001A23',
        fontFamily: 'FuturaPTBold',
        flexShrink: 1, 
        flexWrap: 'wrap', 
        maxWidth: '80%', 
        overflow: 'hidden',  
        width: 220,
        height: 40,
    },
    warningText: {
        fontSize: 16,
        color: '#FF5733',
        fontWeight: 'bold',
    },
    articleTextContainer: {
        flexShrink: 1,
        flexDirection: 'column',  
        justifyContent: 'center', 
        maxWidth: '80%',  
    },
});
