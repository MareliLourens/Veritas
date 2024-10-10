// Import necessary components and hooks from React and React Native libraries
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { ThemedText } from '@/components/ThemedText'; // Custom themed text component
import CheckBox from 'expo-checkbox'; // Checkbox component from Expo
import React, { useState } from 'react'; // Import React and useState hook
import { useNavigation } from '@react-navigation/native'; // Import useNavigation

// Define the HomeScreen component as a functional component
export default function HomeScreen() {
  // State to manage the checkbox status (checked or unchecked)
  const [isChecked, setIsChecked] = useState(false);

  const navigation = useNavigation(); // Get navigation object

  const handleCreateAccount = () => {
    console.log("Button pressed");
    navigation.navigate('history'); 
  };

  // Render the component
  return (
    // Main container for the screen
    <View style={styles.container_big}>
      <View style={styles.container}>
        {/* Display an image at the top of the screen */}
        <Image style={styles.image} source={require('../../assets/images/signup.png')} />
        {/* Welcome title using the themed text component */}
        <ThemedText type="title">Welcome</ThemedText>

        {/* Subtitle prompting the user to start fact-checking */}
        <ThemedText style={styles.subtitle} type="subtitle">Start fact checking your work</ThemedText>

        {/* Email input field */}
        <View style={styles.inputcontainer}>
          <ThemedText type="minititle" style={styles.inputtitle}>Email</ThemedText>
          <TextInput
            style={styles.input}
            placeholderTextColor="#808089" 
            placeholder="Enter your email" 
          />
        </View>

        {/* Password input field */}
        <View style={styles.inputcontainer}>
          <ThemedText type="minititle" style={styles.inputtitle2}>Password</ThemedText>
          <TextInput
            style={styles.input}
            placeholderTextColor="#808089" // Placeholder text color
            secureTextEntry // Hide the password input
            placeholder="Enter your password" // Placeholder text
          />
        </View>

        {/* Checkbox for 'Remember Me' option */}
        <View style={styles.checkboxcontainer}>
          <CheckBox
            style={styles.checkbox} // Style for the checkbox
            value={isChecked} // Bind checkbox value to state
            onValueChange={setIsChecked} // Update state when checkbox is checked/unchecked
          />
          {/* Checkbox label */}
          <ThemedText type="subtitle" style={styles.checkboxtext}>Remember Me</ThemedText>
        </View>

        {/* Button to create an account */}
        <TouchableOpacity style={styles.button} onPress={handleCreateAccount}>
          <Text style={styles.buttonText}>Create Account</Text>
        </TouchableOpacity>

        {/* Image prompting to sign up with social media */}
        <Image style={styles.signupwithimg} source={require('../../assets/images/signupwith.png')} />

        {/* Container for online signup options (social media icons) */}
        <View style={styles.onlinesignupcontainer}>
          {/* Social media icons for signup */}
          <Image style={styles.onlineicon} source={require('../../assets/images/google.png')} />
          <Image style={styles.onlineicon} source={require('../../assets/images/facebook.png')} />
          <Image style={styles.onlineicon} source={require('../../assets/images/apple.png')} />
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
