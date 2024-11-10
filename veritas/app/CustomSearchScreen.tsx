import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, FlatList, TouchableOpacity, StyleSheet, Linking, SafeAreaView, ScrollView, Image } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useRoute } from '@react-navigation/native';

export default function CustomSearchScreen() {
  const route = useRoute();
  const { cleanedTitle } = route.params; // Get PDF title from navigation params
  const [loading, setLoading] = useState(true);
  const [articles, setArticles] = useState([]);

  console.log('Cleaned Title NEW:', cleanedTitle);

  useEffect(() => {
    const searchArticles = async () => {
      setLoading(true);
      try {
        // Use the cleaned title for the search
        const fetchedArticles = await fetchArticlesByTitle(cleanedTitle);
        setArticles(fetchedArticles);
      } catch (error) {
        console.error('Error fetching supporting articles:', error);
      } finally {
        setLoading(false);
      }
    };

    const fetchArticlesByTitle = async (cleanedTitle) => {
      try {
        // Ensure the title is encoded to handle special characters
        const encodedTitle = encodeURIComponent(cleanedTitle);

        // API key and Custom Search Engine (CX) ID
        const apiKey = 'AIzaSyABcEV78efo3MPyYh8Pf4Q3a1IyH4MdQJE'; // Your API Key
        const searchEngineId = 'd04047984f8654faa';  // Your Custom Search Engine (CX) ID

        // Construct the API request URL to search for articles using Google Custom Search
        const apiUrl = `https://www.googleapis.com/customsearch/v1?q=${encodedTitle}&key=${apiKey}&cx=${searchEngineId}`;

        // Fetch data from Google Custom Search API
        const response = await fetch(apiUrl);
        if (!response.ok) {
          throw new Error(`Error ${response.status}: ${response.statusText}`);
        }

        const data = await response.json();

        // Check if response contains articles (items)
        if (data && data.items) {
          // Return a mapped list of articles, including title, snippet, and link
          return data.items.map(item => ({
            title: item.title,  // The title of the article
            snippet: item.snippet,  // A brief description of the article
            link: item.link,  // URL to the article
            icon: require('../assets/images/web_icon.png'), // Correct way to reference the icon
          }));
        } else {
          console.error("No articles found or unexpected response structure");
          return [];
        }
      } catch (error) {
        console.error('Error fetching articles by title:', error);
        throw error;  // Re-throw to allow upstream handling
      }
    };

    searchArticles();
  }, [cleanedTitle]); // Re-run this effect when cleanedTitle changes

  // Function to handle article link click
  const handleArticleClick = (url) => {
    Linking.openURL(url).catch((err) => console.error('Failed to open URL:', err));
  };

  return (
    <SafeAreaProvider>
      <SafeAreaView style={{ flex: 1, backgroundColor: "#B7E4FA" }}>
        <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
          <View style={styles.container}>
            <View style={styles.background}></View>
            <Text style={styles.articlesLabel}>Articles related to document</Text>
            {loading ? (
              <ActivityIndicator size="large" color="#0000ff" />
            ) : (
              <FlatList
                data={articles}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({ item }) => (
                  <TouchableOpacity onPress={() => handleArticleClick(item.link)}>
                    <View style={styles.articleCard}>
                      <Image source={item.icon} style={styles.articleIcon} />
                      <View style={styles.articleTextContainer}>
                        <Text style={styles.articleTitle}>{item.title}</Text>
                        <Text style={styles.articleSource}>{item.link}</Text>
                      </View>
                    </View>
                  </TouchableOpacity>
                )}
              />
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
    marginTop: 20,
  },
  background: {
    backgroundColor: '#B7E4FA',
    height: 222,
    width: 400,
    position: 'absolute',
    top: 0,
  },
  articleCard: {
    flexDirection: 'row',             // Keep the icon and title in a row
    alignItems: 'center',            // Align icon and text vertically
    backgroundColor: '#F5F8FA',
    borderRadius: 15,
    padding: 15,
    width: '100%',
    overflow: 'hidden',              // Prevents content from overflowing outside
    marginBottom: 7,
  },
  articleIcon: {
    width: 53,
    height: 53,
    marginRight: 10,
  },
  articleTextContainer: {
    flexShrink: 1,
    flexDirection: 'column',  // Stack the title and source vertically
    justifyContent: 'center',  // Ensures the content is centered vertically in the container
    maxWidth: '80%',  // Limits width of text area to prevent overflow
    
  },
  articleTitle: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#001A23',
    fontFamily: 'FuturaPTBold',
    overflow: 'hidden',  // Prevents title text overflow
    width: 220,
    height: 40,
  },
  articleSource:{
    width: 220,
    height: 18,
    marginTop: 4,
  },
  articlesLabel: {
    fontSize: 20,
    fontFamily: 'FuturaPTBold',
    color: '#001A23',
    fontWeight: 'bold',
    marginBottom: 10,
    
  },
});

