import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, Alert } from 'react-native'; 
import { ThemedText } from '@/components/ThemedText'; // Custom component, assumed to handle themed text rendering
import React, { useState } from 'react'; 
import { useNavigation } from '@react-navigation/native'; // React Navigation for navigating between screens
import { signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from 'firebase/auth'; // Firebase Authentication methods
import { auth } from './firebase'; // Firebase auth instance from the firebase configuration file
import * as Google from 'expo-auth-session/providers/google'; // Expo package for handling Google authentication via OAuth

export default function LoginScreen() {
  const navigation = useNavigation(); // Hook to navigate to other screens
  const [email, setEmail] = useState(''); // State for email input
  const [password, setPassword] = useState(''); // State for password input

  // Google authentication request configuration using Expo's Google OAuth provider
  const [request, response, promptAsync] = Google.useIdTokenAuthRequest({
    clientId: '561340048771-sh9k6h4j5em87qbvg0vpj5oeo29ssh4a.apps.googleusercontent.com', // Client ID for OAuth
  });

  // Function to handle login using email and password through Firebase Authentication
  const handleLogin = async () => {
    try {
      // Firebase method for signing in with email and password
      await signInWithEmailAndPassword(auth, email, password);
      // Navigate to the FactCheckScreen upon successful login
      navigation.navigate('FactCheckScreen');
    } catch (error) {
      // Display error alert if login fails
      Alert.alert('Login Failed');
    }
  };

  // Function to handle Google Sign-In through Expo's Google OAuth provider
  const handleGoogleSignIn = async () => {
    try {
      // Trigger the Google login flow
      const result = await promptAsync();
      
      // If login is successful, extract the id_token from the response
      if (result?.type === 'success') {
        const { id_token } = result.params;
        
        // Create a Firebase credential using the id_token
        const credential = GoogleAuthProvider.credential(id_token);
        
        // Sign in the user with the generated Firebase credential
        const userCredential = await signInWithCredential(auth, credential);
        
        const user = userCredential.user;
        console.log('Logged in with Google: ', user.email); // Log the email of the logged-in user
        
        // Navigate to the FactCheckScreen upon successful login
        navigation.navigate('FactCheckScreen');
      }
    } catch (error) {
      // Log and alert the user if there was an error during Google sign-in
      console.error('Google Sign-In Error: ', error);
      Alert.alert('Google Sign-In Failed', error.message);
    }
  };

  return (
    <View style={styles.container_big}>
      <View style={styles.container}>
        <Image style={styles.image} source={require('../assets/images/signup.png')} />
        <ThemedText type="title">Welcome Back</ThemedText>
        <ThemedText style={styles.subtitle} type="subtitle">Want to fact check a new document?</ThemedText>
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

        <TouchableOpacity style={styles.button} onPress={handleLogin}>
          <Text style={styles.buttonText}>Log In</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('SignUpScreen')}>
          <Text style={styles.signuptext}>Not a member yet? Create an account</Text>
        </TouchableOpacity>
        <Image style={styles.signupwithimg} source={require('../assets/images/signupwith.png')} />
        <View style={styles.onlinesignupcontainer}>
          <TouchableOpacity onPress={handleGoogleSignIn} style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Image style={styles.onlineicon} source={require('../assets/images/google.png')} />
            <Text style={styles.signupgoogle}>Log in with Google</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container_big: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'white',
  },
  image: {
    height: 250,
    width: 250,
    alignItems: 'center',
  },
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  subtitle: {
    color: '#808089',
    marginTop: 10,
    marginBottom: 20,
  },
  inputcontainer: {
    width: '100%',
    height: 60,
    marginBottom: 20,
  },
  inputtitle: {
    color: "#000000",
    height: 25,
    width: "17%",
    position: 'absolute',
    marginLeft: 30,
    paddingLeft: 8,
    backgroundColor: "#FFFFFF",
    zIndex: 1,
  },
  inputtitle2: {
    color: "#000000",
    height: 25,
    width: "28%",
    position: 'absolute',
    marginLeft: 30,
    paddingLeft: 8,
    backgroundColor: "#FFFFFF",
    zIndex: 1,
  },
  input: {
    width: '100%',
    height: 50,
    borderWidth: 1,
    borderColor: '#0FA5EF',
    borderRadius: 15,
    marginBottom: 20,
    marginTop: 10,
    fontSize: 16,
    paddingLeft: 20,
    fontFamily: 'MontserratReg',
  },
  signuptext: {
    color: "#808089",
    marginTop: 10,
  },
  button: {
    width: '100%',
    height: 58,
    backgroundColor: '#0FA5EF',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 15,
    marginTop: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    fontFamily: 'FuturaPTBold',
  },
  signupwithimg: {
    width: '100%',
    marginTop: 10,
    marginBottom: 10,
    objectFit: 'contain',
  },
  onlinesignupcontainer: {
    width: '100%',
    height: 50,
    borderWidth: 1,
    borderColor: '#0FA5EF',
    borderRadius: 15,
    fontSize: 16,
    paddingLeft: 20,
    fontFamily: 'MontserratReg',
    display: 'flex',
    alignItems: 'center', 
    flexDirection: 'row', 
  },
  onlineicon: {
    objectFit: 'contain',
    height: 30, 
    marginLeft: 15,
  },
  signupgoogle: {
    marginLeft: -15,
    fontSize: 16,
    fontWeight: 'bold',
    fontFamily: 'FuturaPTBold',
  },
});
