import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, Alert } from 'react-native'; 
import { ThemedText } from '@/components/ThemedText'; // Custom component, assumed to handle themed text rendering
import React, { useState } from 'react'; 
import { useNavigation } from '@react-navigation/native'; // React Navigation for navigating between screens
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth'; // Firebase Authentication methods for user creation and profile updates
import { auth } from './firebase';  // Firebase auth instance from the firebase configuration file

export default function SignUpScreen() {
  const navigation = useNavigation(); // Hook to navigate to other screens
  
  const [email, setEmail] = useState(''); // State for email input
  const [password, setPassword] = useState(''); // State for password input
  const [name, setName] = useState(''); // State for user's name
  const [gender, setGender] = useState(''); // State for user's gender (not used in backend)

  // Function to handle user sign-up
  const handleSignUp = async () => {
    try {
      // Firebase method to create a new user with email and password
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
  
      // Firebase method to update the newly created user's profile with their display name
      await updateProfile(user, {
        displayName: name, // Set the user's display name to the provided 'name'
      });

      // Navigate to the FactCheckScreen upon successful sign-up
      navigation.navigate('FactCheckScreen');
    } catch (error) {
      // Handle errors during sign-up and show an alert with the error message
      Alert.alert('Sign-Up Failed', error.message);  
    }
  };


  return (
    <View style={styles.container_big}>
      <View style={styles.container}>
        <Image style={styles.image} source={require('../assets/images/signup_icon.png')} />
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

        <TouchableOpacity style={styles.button} onPress={handleSignUp}>
          <Text style={styles.buttonText}>Sign Up</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate('LoginScreen')}>
          <Text style={styles.signuptext}>Already a member? Log In</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container_big: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'white',
  },
  image: {
    height: 300,
    overflow: 'hidden',
    objectFit: 'contain',
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
});
