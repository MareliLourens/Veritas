import axios from 'axios';

// Set up the API key for Google APIs
const GOOGLE_API_KEY = 'AIzaSyABcEV78efo3MPyYh8Pf4Q3a1IyH4MdQJE'; // Replace with your actual API key

// Function to add <br> after periods to hint sentence boundaries
const formatTextWithLineBreaks = (text) => {
  return text.replace(/(\.)(?!\s|$)/g, '$1<br>'); // Adds <br> after each period that is not followed by a space or end of text
};

// Function to analyze the text and detect sentences
const analyzeSentences = async (text) => {
    try {
      // Format text with <br> after periods
      const formattedText = formatTextWithLineBreaks(text);
  
      const NLP_API_URL = `https://language.googleapis.com/v1/documents:analyzeSentiment?key=${GOOGLE_API_KEY}`;
      const data = {
        document: { content: formattedText, type: 'HTML' },
        encodingType: 'UTF8',
      };
  
      const response = await axios.post(NLP_API_URL, data);
  
      // Check if the response contains valid data
      if (!response.data || !response.data.sentences) {
        console.error('No sentences found in NLP API response.');
        return [];
      }
  
      const sentences = response.data.sentences.map(sentence => sentence.text.content);
      console.log('Detected Sentences:', sentences);
      return sentences;
    } catch (error) {
      console.error('Error analyzing sentences:', error);
      return [];
    }
};

// Function to analyze the accuracy of each sentence
export const analyzeTextAccuracy = async (text) => {
  try {
    // Step 1: Detect sentences in the text
    const sentences = await analyzeSentences(text);
    console.log('Sentences detected:', sentences);

    // Step 2: Analyze each sentence individually
    const sentenceResults = await Promise.all(sentences.map(async (sentence) => {
      try {
        const result = await analyzeSentenceAccuracy(sentence);
        return { sentence, result };
      } catch (error) {
        console.error('Error analyzing sentence:', sentence, error);
        return { sentence, result: { accuracyScore: 0, supportingArticles: [] } };
      }
    }));

    // Step 3: Calculate overall accuracy score (if needed)
    const accuracyScores = sentenceResults.map(result => result.result.accuracyScore);
    const accuracyScore = accuracyScores.length > 0 ? (accuracyScores.reduce((a, b) => a + b, 0) / accuracyScores.length) : 0;

    // Step 4: Gather all supporting articles
    const allSupportingArticles = sentenceResults.flatMap(result => result.result.supportingArticles);

    // Log the accuracy score and supporting articles
    console.log(`Overall Accuracy Score: ${accuracyScore}`);
    console.log('All Supporting Articles:', allSupportingArticles);

    return { accuracyScore, sentenceResults, supportingArticles: allSupportingArticles };
  } catch (error) {
    console.error('Error analyzing text accuracy:', error);
    return { accuracyScore: 0, sentenceResults: [], supportingArticles: [] };
  }
};


  
  // Function to analyze sentence accuracy and fetch supporting articles
  const analyzeSentenceAccuracy = async (sentence) => {
    try {
      const NLP_API_URL = `https://language.googleapis.com/v1/documents:analyzeEntities?key=${GOOGLE_API_KEY}`;
      const data = {
        document: { content: sentence, type: 'PLAIN_TEXT' },
      };
  
      const response = await axios.post(NLP_API_URL, data);
      console.log('NLP API response for sentence:', sentence, response.data);
  
      // Handle missing or empty entities in the response
      if (!response.data || !response.data.entities || response.data.entities.length === 0) {
        console.error('No meaningful entities found in the response for sentence:', sentence);
        return { accuracyScore: 0, supportingArticles: [] };
      }
  
      const entities = response.data.entities;
  
      // Filter entities based on relevance (e.g., salience > 0.1)
      const validEntities = entities.filter(entity => entity.salience > 0.1 && entity.type !== 'NUMBER');
      console.log('Filtered valid entities for sentence:', validEntities);
  
      if (validEntities.length === 0) {
        console.error('No valid entities found for sentence:', sentence);
        return { accuracyScore: 0, supportingArticles: [] };
      }
  
      // Check the accuracy for each entity in the sentence
      const accuracyResults = await Promise.all(validEntities.map(async (entity) => {
        try {
          const result = await checkFactAccuracy(entity.name);
          return result;
        } catch (error) {
          console.error('Error checking fact accuracy for entity:', entity.name);
          return false;
        }
      }));
  
      // Calculate the accuracy score for the sentence
      let accuracyScore = (accuracyResults.filter(res => res).length / validEntities.length) * 100;
  
      // If the accuracy score is below 50, fetch supporting articles
      let supportingArticles = [];
      if (accuracyScore < 50) {
        supportingArticles = await fetchSupportingArticlesFromSearch(sentence); // Use the new search function here
      }
  
      // Penalize further if any false claim was found
      if (accuracyResults.includes(false)) {
        accuracyScore -= 20; // Reduce the score by 20 for false claims
        console.log('Penalty applied for false or mostly false claims');
      }
  
      // Ensure the accuracy score doesn't go below 0
      accuracyScore = Math.max(accuracyScore, 0);
  
      return { accuracyScore, supportingArticles };
    } catch (error) {
      console.error('Error analyzing sentence accuracy:', error);
      return { accuracyScore: 0, supportingArticles: [] };
    }
  };

// Function to check fact accuracy for a query (e.g., an entity)
export const checkFactAccuracy = async (query) => {
    try {
      const FACT_CHECK_API_URL = `https://factchecktools.googleapis.com/v1alpha1/claims:search?query=${encodeURIComponent(query)}&key=${GOOGLE_API_KEY}`;
      const response = await axios.get(FACT_CHECK_API_URL);
      console.log('Fact-Check API response:', response.data);
  
      // Handle empty response
      if (!response.data || !response.data.claims || response.data.claims.length === 0) {
        console.warn(`No fact-check claims found for: ${query}`);
        return false; // No claims found, treated as potentially false or unverified.
      }
  
      // Check if the fact-check claims are false or mostly false
      const hasFalseClaims = response.data.claims.some(claim => {
        const rating = claim.claimReview[0]?.textualRating;
        return rating === 'false' || rating === 'mostly false';
      });
  
      if (hasFalseClaims) {
        console.warn(`Claim for "${query}" is false or mostly false.`);
        return false; // Return false if any claim is false or mostly false
      }
  
      return true; // Return true if no false or mostly false claims found
    } catch (error) {
      console.error('Error checking fact accuracy:', error);
      return false; // Treat as inaccurate in case of an error
    }
  };

// Function to fetch supporting articles related to a sentence or entity
export const fetchSupportingArticles = async (query) => {
  try {
    const FACT_CHECK_API_URL = `https://factchecktools.googleapis.com/v1alpha1/claims:search?query=${encodeURIComponent(query)}&key=${GOOGLE_API_KEY}`;
    const response = await axios.get(FACT_CHECK_API_URL);
    console.log('Supporting articles response:', response.data);

    if (!response.data || !response.data.claims || response.data.claims.length === 0) {
      console.warn('No supporting articles found.');
      return [];
    }

    return response.data.claims.map(claim => ({
      title: claim.text,
      source: claim.claimant,
      rating: claim.claimReview[0]?.textualRating,
    }));
  } catch (error) {
    console.error('Error fetching supporting articles:', error);
    return [];
  }
};

