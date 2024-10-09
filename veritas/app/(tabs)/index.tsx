import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import CheckBox from 'expo-checkbox';
import React, { useState } from 'react';

export default function HomeScreen() {
  const [isChecked, setIsChecked] = useState(false);


  return (
    <View style={styles.container_big}>
      <View style={styles.container}>
        <Image style={styles.image} source={require('../../assets/images/signup.png')} />
        <ThemedText type="title">Welcome</ThemedText>

        <ThemedText style={styles.subtitle} type="subtitle">Start fact checking your work</ThemedText>
        <View style={styles.inputcontainer}>
          <ThemedText type="minititle" style={styles.inputtitle}>Email</ThemedText>
          <TextInput
            style={styles.input}
            placeholderTextColor="#808089"
            placeholder="Enter your email"
          />
        </View>
        <View style={styles.inputcontainer}>
          <ThemedText type="minititle" style={styles.inputtitle2}>Password</ThemedText>
          <TextInput
            style={styles.input}
            placeholderTextColor="#808089"
            secureTextEntry
            placeholder="Enter your password"
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

        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>Create Account</Text>
        </TouchableOpacity>
        <Image style={styles.signupwithimg} source={require('../../assets/images/signupwith.png')} />
        <View style={styles.onlinesignupcontainer}>
          <Image style={styles.onlineicon} source={require('../../assets/images/google.png')} />
          <Image style={styles.onlineicon} source={require('../../assets/images/facebook.png')} />
          <Image style={styles.onlineicon} source={require('../../assets/images/apple.png')} />
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
    borderTopRightRadius: 35,
    borderTopLeftRadius: 35,
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
  checkboxcontainer: {
    width: 150,
    display: 'flex',
    flexDirection: 'row',
    marginLeft: -150,
  },
  checkbox: {
    marginRight: 5,
  },
  checkboxtext: {
    color: "#808089"
  },
  button: {
    width: '100%',
    height: 50,
    backgroundColor: '#0FA5EF',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 15,
    marginTop: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 20,
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
