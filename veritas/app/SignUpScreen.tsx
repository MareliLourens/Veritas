import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, Alert } from 'react-native';
import { ThemedText } from '@/components/ThemedText'; // Custom themed text component
import React, { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { auth } from './firebase';  // Firebase configuration (auth)

export default function SignUpScreen() {
  const [isChecked, setIsChecked] = useState(false);  // Remember Me functionality
  const navigation = useNavigation();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');  // New state for name
  const [gender, setGender] = useState('');  // New state for gender

  // Function to handle the sign-up process
  const handleSignUp = async () => {
    try {
      // Step 1: Create user with email and password
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
  
      // Step 2: Update user's display name
      await updateProfile(user, {
        displayName: name,  // Update display name
      });

      // Step 3: Navigate to the next screen (FactCheckScreen)
      navigation.navigate('FactCheckScreen');
    } catch (error) {
      Alert.alert('Sign-Up Failed', error.message);  // Show error if sign-up fails
    }
  };

  return (
    <View style={styles.container_big}>
      <View style={styles.container}>
        <Image style={styles.image} source={require('../assets/images/signup_icon.png')} />
        <ThemedText type="title">Welcome</ThemedText>
        <ThemedText style={styles.subtitle} type="subtitle">Start fact-checking your work</ThemedText>

        {/* Email Input */}
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

        {/* Password Input */}
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

        {/* Sign Up Button */}
        <TouchableOpacity style={styles.button} onPress={handleSignUp}>
          <Text style={styles.buttonText}>Sign Up</Text>
        </TouchableOpacity>

        {/* Navigation to Login Screen */}
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
