import axios from 'axios';

const GOOGLE_API_KEY = 'AIzaSyABcEV78efo3MPyYh8Pf4Q3a1IyH4MdQJE';

// Helper function to format text, adding line breaks after each period.
const formatTextWithLineBreaks = (text) => {
  return text.replace(/(\.)(?!\s|$)/g, '$1<br>');
};

// Function to analyze the sentiment of each sentence in the provided text.
const analyzeSentences = async (text) => {
  try {
    const formattedText = formatTextWithLineBreaks(text); // Format text for proper line breaks

    // URL for Google NLP API's analyzeSentiment endpoint
    const NLP_API_URL = `https://language.googleapis.com/v1/documents:analyzeSentiment?key=${GOOGLE_API_KEY}`;
    const data = {
      document: { content: formattedText, type: 'HTML' }, // Set content type to HTML due to formatting
      encodingType: 'UTF8',
    };

    const response = await axios.post(NLP_API_URL, data); // Sending request to analyze sentiment

    if (!response.data || !response.data.sentences) {
      console.error('No sentences found in NLP API response.');
      return [];
    }

    // Map the response to get only the content of each sentence
    const sentences = response.data.sentences.map(sentence => sentence.text.content);
    console.log('Detected Sentences:', sentences);
    return sentences;
  } catch (error) {
    console.error('Error analyzing sentences:', error);
    return [];
  }
};

// Main function to analyze the accuracy of the provided text.
export const analyzeTextAccuracy = async (text) => {
  try {
    // Call analyzeSentences to break down the text into sentences
    const sentences = await analyzeSentences(text);
    console.log('Sentences detected:', sentences);

    // Analyzes each sentence's accuracy using analyzeSentenceAccuracy
    const sentenceResults = await Promise.all(sentences.map(async (sentence) => {
      try {
        const result = await analyzeSentenceAccuracy(sentence); // Analyze each sentence
        return { sentence, result };
      } catch (error) {
        console.error('Error analyzing sentence:', sentence, error);
        return { sentence, result: { accuracyScore: 0, supportingArticles: [] } }; // Return default on error
      }
    }));

    // Calculate the overall accuracy score by averaging individual sentence scores
    const accuracyScores = sentenceResults.map(result => result.result.accuracyScore);
    const accuracyScore = accuracyScores.length > 0 ? (accuracyScores.reduce((a, b) => a + b, 0) / accuracyScores.length) : 0;

    // Flatten the supporting articles from each sentence's result
    const allSupportingArticles = sentenceResults.flatMap(result => result.result.supportingArticles);

    console.log(`Overall Accuracy Score: ${accuracyScore}`);
    console.log('All Supporting Articles:', allSupportingArticles);

    return { accuracyScore, sentenceResults, supportingArticles: allSupportingArticles };
  } catch (error) {
    console.error('Error analyzing text accuracy:', error);
    return { accuracyScore: 0, sentenceResults: [], supportingArticles: [] };
  }
};

// Function to analyze the accuracy of individual sentences by checking their entities.
const analyzeSentenceAccuracy = async (sentence) => {
  try {
    // URL for Google NLP API's analyzeEntities endpoint to detect entities in the sentence
    const NLP_API_URL = `https://language.googleapis.com/v1/documents:analyzeEntities?key=${GOOGLE_API_KEY}`;
    const data = {
      document: { content: sentence, type: 'PLAIN_TEXT' }, // Set content type to PLAIN_TEXT for entity analysis
    };

    const response = await axios.post(NLP_API_URL, data);
    console.log('NLP API response for sentence:', sentence, response.data);

    // If no entities are found, return with a score of 0
    if (!response.data || !response.data.entities || response.data.entities.length === 0) {
      console.error('No meaningful entities found in the response for sentence:', sentence);
      return { accuracyScore: 0, supportingArticles: [] };
    }

    const entities = response.data.entities;

    // Filter out irrelevant entities (numbers or low-salience entities)
    const validEntities = entities.filter(entity => entity.salience > 0.1 && entity.type !== 'NUMBER');
    console.log('Filtered valid entities for sentence:', validEntities);

    // If no valid entities remain, return with a score of 0
    if (validEntities.length === 0) {
      console.error('No valid entities found for sentence:', sentence);
      return { accuracyScore: 0, supportingArticles: [] };
    }

    // Check the accuracy of each valid entity by calling checkFactAccuracy
    const accuracyResults = await Promise.all(validEntities.map(async (entity) => {
      try {
        const result = await checkFactAccuracy(entity.name);
        return result; // Return whether the entity's fact is true or not
      } catch (error) {
        console.error('Error checking fact accuracy for entity:', entity.name);
        return false; // If error occurs, consider the fact false
      }
    }));

    // Calculate accuracy score based on how many valid entities are accurate
    let accuracyScore = (accuracyResults.filter(res => res).length / validEntities.length) * 100;

    let supportingArticles = [];
    // If accuracy score is below 50, fetch supporting articles to validate the information
    if (accuracyScore < 50) {
      supportingArticles = await fetchSupportingArticlesFromSearch(sentence);
    }

    // If any entity check fails, apply a penalty to the accuracy score
    if (accuracyResults.includes(false)) {
      accuracyScore -= 20;
      console.log('Penalty applied for false or mostly false claims');
    }

    // Ensure accuracy score doesn't fall below 0
    accuracyScore = Math.max(accuracyScore, 0);

    return { accuracyScore, supportingArticles };
  } catch (error) {
    console.error('Error analyzing sentence accuracy:', error);
    return { accuracyScore: 0, supportingArticles: [] };
  }
};

// Function to check the factual accuracy of an entity using Google's Fact-Check Tools API.
export const checkFactAccuracy = async (query) => {
  try {
    const FACT_CHECK_API_URL = `https://factchecktools.googleapis.com/v1alpha1/claims:search?query=${encodeURIComponent(query)}&key=${GOOGLE_API_KEY}`;
    const response = await axios.get(FACT_CHECK_API_URL);
    console.log('Fact-Check API response:', response.data);

    // If no claims are found, return false as the fact is unsupported
    if (!response.data || !response.data.claims || response.data.claims.length === 0) {
      console.warn(`No fact-check claims found for: ${query}`);
      return false;
    }

    // Check if any claims are rated as false or mostly false
    const hasFalseClaims = response.data.claims.some(claim => {
      const rating = claim.claimReview[0]?.textualRating;
      return rating === 'false' || rating === 'mostly false';
    });

    // If any false claims are found, return false indicating the claim is not accurate
    if (hasFalseClaims) {
      console.warn(`Claim for "${query}" is false or mostly false.`);
      return false;
    }

    return true; // If no false claims, return true
  } catch (error) {
    console.error('Error checking fact accuracy:', error);
    return false; // Return false if there is an error
  }
};

// Function to fetch supporting articles related to a claim using Google's Fact-Check Tools API.
export const fetchSupportingArticles = async (query) => {
  try {
    const FACT_CHECK_API_URL = `https://factchecktools.googleapis.com/v1alpha1/claims:search?query=${encodeURIComponent(query)}&key=${GOOGLE_API_KEY}`;
    const response = await axios.get(FACT_CHECK_API_URL);
    console.log('Supporting articles response:', response.data);

    // If no claims are found, return an empty array
    if (!response.data || !response.data.claims || response.data.claims.length === 0) {
      console.warn('No supporting articles found.');
      return [];
    }

    // Map through the claims and return a formatted list of supporting articles
    return response.data.claims.map(claim => ({
      title: claim.text,
      source: claim.claimant,
      rating: claim.claimReview[0]?.textualRating,
    }));
  } catch (error) {
    console.error('Error fetching supporting articles:', error);
    return []; // Return an empty array if there is an error
  }
};
