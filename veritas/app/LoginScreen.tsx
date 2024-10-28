import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, Alert } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import CheckBox from 'expo-checkbox';
import React, { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { auth, provider } from './firebase'; // Import provider from your firebase config
import * as Google from 'expo-auth-session/providers/google';

export default function LoginScreen() {
  const [isChecked, setIsChecked] = useState(false);
  const navigation = useNavigation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [request, response, promptAsync] = Google.useIdTokenAuthRequest({
    clientId: '<YOUR_GOOGLE_CLIENT_ID>', // Replace with your Google Client ID
  });

  const handleLogin = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigation.navigate('HistoryScreen');
    } catch (error) {
      Alert.alert('Login Failed'); // Show error message
    }
  };

  

  const handleGoogleSignIn = async () => {
    try {
      const result = await promptAsync();
      if (result?.type === 'success') {
        const { id_token } = result.params;

        const credential = GoogleAuthProvider.credential(id_token);
        const userCredential = await signInWithCredential(auth, credential);
        const user = userCredential.user;

        console.log('Logged in with Google: ', user.email);
        navigation.navigate('HistoryScreen');
      }
    } catch (error) {
      console.error('Google Sign-In Error: ', error);
      Alert.alert('Google Sign-In Failed', error.message);
    }
  };

  return (
    <View style={styles.container_big}>
      <View style={styles.container}>
        <Image style={styles.image} source={require('../assets/images/signup.png')} />
        <ThemedText type="title">Welcome</ThemedText>
        <ThemedText style={styles.subtitle} type="subtitle">Start fact-checking your work</ThemedText>

        <View style={styles.inputcontainer}>
          <ThemedText type="minititle" style={styles.inputtitle}>Email</ThemedText>
          <TextInput
            style={styles.input}
            placeholderTextColor="#808089"
            placeholder="Enter your email"
            onChangeText={setEmail}
            value={email}
          />
        </View>

        <View style={styles.inputcontainer}>
          <ThemedText type="minititle" style={styles.inputtitle2}>Password</ThemedText>
          <TextInput
            style={styles.input}
            placeholderTextColor="#808089"
            secureTextEntry
            placeholder="Enter your password"
            onChangeText={setPassword}
            value={password}
          />
        </View>

        <View style={styles.checkboxcontainer}>
          <CheckBox
            style={styles.checkbox}
            value={isChecked}
            onValueChange={setIsChecked}
          />
          <ThemedText type="subtitle" style={styles.checkboxtext}>Remember Me</ThemedText>
        </View>

        <TouchableOpacity style={styles.button} onPress={handleLogin}>
          <Text style={styles.buttonText}>Log In</Text>
        </TouchableOpacity>

        <Image style={styles.signupwithimg} source={require('../assets/images/signupwith.png')} />

        <View style={styles.onlinesignupcontainer}>
          <TouchableOpacity onPress={handleGoogleSignIn}>
            <Image style={styles.onlineicon} source={require('../assets/images/google.png')} />
          </TouchableOpacity>
          <Image style={styles.onlineicon} source={require('../assets/images/facebook.png')} />
          <Image style={styles.onlineicon} source={require('../assets/images/apple.png')} />
        </View>
      </View>
    </View>
  );
}

// Styles for the components using StyleSheet
const styles = StyleSheet.create({
  container_big: {
    flex: 1, // Take up the full height of the screen
    justifyContent: 'flex-end', // Align content at the bottom
    backgroundColor: 'white', // Background color
    borderTopRightRadius: 35, // Rounded top-right corners
    borderTopLeftRadius: 35, // Rounded top-left corners
  },
  image: {
    height: 250, // Image height
    width: 250, // Image width
    alignItems: 'center', // Center items in the image container
  },
  container: {
    justifyContent: 'center', // Center content vertically
    alignItems: 'center', // Center content horizontally
    padding: 20, // Padding around the container
  },
  subtitle: {
    color: '#808089', // Subtitle text color
    marginTop: 10, // Top margin
    marginBottom: 20, // Bottom margin
  },
  inputcontainer: {
    width: '100%', // Full width
    height: 60, // Fixed height
    marginBottom: 20, // Space below the input
  },
  inputtitle: {
    color: "#000000", // Input title text color
    height: 25, // Fixed height for the title
    width: "17%", // Fixed width for the title
    position: 'absolute', // Position the title absolutely
    marginLeft: 30, // Space from the left
    paddingLeft: 8, // Space within the title container
    backgroundColor: "#FFFFFF", // Background color for the title
    zIndex: 1, // Ensure the title appears above the input
  },
  inputtitle2: {
    color: "#000000", // Input title text color for password
    height: 25, // Fixed height for the title
    width: "28%", // Fixed width for the title
    position: 'absolute', // Position the title absolutely
    marginLeft: 30, // Space from the left
    paddingLeft: 8, // Space within the title container
    backgroundColor: "#FFFFFF", // Background color for the title
    zIndex: 1, // Ensure the title appears above the input
  },
  input: {
    width: '100%', // Full width for input field
    height: 50, // Fixed height for input field
    borderWidth: 1, // Border width
    borderColor: '#0FA5EF', // Border color
    borderRadius: 15, // Rounded corners
    marginBottom: 20, // Space below the input
    marginTop: 10, // Space above the input
    fontSize: 16, // Font size
    paddingLeft: 20, // Left padding for input text
    fontFamily: 'MontserratReg', // Font family for input text
  },
  checkboxcontainer: {
    width: 160, // Fixed width for the checkbox container
    display: 'flex', // Flex display
    flexDirection: 'row', // Align items in a row
    marginLeft: -150, // Adjust left margin for alignment
  },
  checkbox: {
    marginRight: 5, // Space to the right of the checkbox
  },
  checkboxtext: {
    color: "#808089" // Checkbox label text color
  },
  button: {
    width: '100%', // Full width for the button
    height: 58, // Fixed height for the button
    backgroundColor: '#0FA5EF', // Button background color
    justifyContent: 'center', // Center button text vertically
    alignItems: 'center', // Center button text horizontally
    borderRadius: 15, // Rounded corners
    marginTop: 20, // Space above the button
  },
  buttonText: {
    color: '#fff', // Button text color
    fontSize: 20, // Font size for button text
    fontWeight: 'bold', // Bold font weight
    fontFamily: 'FuturaPTBold', // Font family for button text
  },
  signupwithimg: {
    width: '100%', // Full width for the sign-up image
    marginTop: 10, // Space above the sign-up image
    marginBottom: 10, // Space below the sign-up image
    objectFit: 'contain', // Maintain aspect ratio of the image
  },
  onlinesignupcontainer: {
    width: '100%', // Full width for the social media icons container
    display: 'flex', // Flex display
    flexDirection: 'row', // Align icons in a row
  },
  onlineicon: {
    objectFit: 'contain', // Maintain aspect ratio of the icons
    height: 50, // Fixed height for icons
  },
});
