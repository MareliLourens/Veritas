import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, FlatList, TouchableOpacity, StyleSheet, Linking, SafeAreaView } from 'react-native';
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
    <SafeAreaView style={styles.container}>
      <Text style={styles.articlesLabel}>Supporting Articles:</Text>
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <FlatList
          data={articles}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => handleArticleClick(item.link)}>
              <View style={styles.articleContainer}>
                <Text style={styles.articleTitle}>{item.title}</Text>
                <Text style={styles.articleSnippet}>{item.snippet}</Text>
              </View>
            </TouchableOpacity>
          )}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  articleContainer: {
    marginBottom: 10,
    padding: 15,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 2,
  },
  articleTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  articleSnippet: {
    fontSize: 14,
    color: '#555',
    marginTop: 5,
  },
  articlesLabel: {
    fontSize: 20,
    fontFamily: 'FuturaPTBold',
    color: '#001A23',
    fontWeight: 'bold',
    marginBottom: 10,
},
});
