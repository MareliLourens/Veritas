import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, Alert } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import React, { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { auth, provider } from './firebase';
import * as Google from 'expo-auth-session/providers/google';

export default function LoginScreen() {
  // State to track checkbox for "Remember Me" functionality
  const [isChecked, setIsChecked] = useState(false);
  // Navigation object to switch screens
  const navigation = useNavigation();
  // State variables to store email and password input values
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Set up Google sign-in request with the client ID
  const [request, response, promptAsync] = Google.useIdTokenAuthRequest({
    clientId: '561340048771-sh9k6h4j5em87qbvg0vpj5oeo29ssh4a.apps.googleusercontent.com',
  });

  // Function to handle login with email and password
  const handleLogin = async () => {
    try {
      // Sign in using Firebase authentication
      await signInWithEmailAndPassword(auth, email, password);
      // Navigate to the FactCheckScreen upon successful login
      navigation.navigate('FactCheckScreen');
    } catch (error) {
      // Alert the user if login fails
      Alert.alert('Login Failed');
    }
  };

  // Function to handle Google Sign-In
  const handleGoogleSignIn = async () => {
    try {
      // Prompt the user for Google sign-in and get the result
      const result = await promptAsync();
      // Check if the sign-in was successful
      if (result?.type === 'success') {
        // Extract the id_token from the result parameters
        const { id_token } = result.params;
        // Create a credential with the id_token for Firebase authentication
        const credential = GoogleAuthProvider.credential(id_token);
        // Sign in with the credential in Firebase
        const userCredential = await signInWithCredential(auth, credential);
        // Get the logged-in user's information
        const user = userCredential.user;
        // Log the user's email to the console
        console.log('Logged in with Google: ', user.email);
        // Navigate to the FactCheckScreen upon successful login
        navigation.navigate('FactCheckScreen');
      }
    } catch (error) {
      // Log and alert the user if Google sign-in fails
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
    display: 'flex',
    flexDirection: 'row',
  },
  onlineicon: {
    objectFit: 'contain',
    height: 50,
  },
});
