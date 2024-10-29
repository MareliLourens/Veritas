import React from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, ScrollView } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

export default function FactCheckScreen() {
    return (
        <SafeAreaProvider>
            <SafeAreaView style={{ flex: 1, backgroundColor: "#B7E4FA" }}>
                <ScrollView>
                    <View style={styles.container}>
                        <View style={styles.background}></View>
                        <View style={styles.header}>
                            <Image style={styles.profileimage} source={require('../assets/images/placeholder_profile.png')} />
                            <View>
                                <Text style={styles.prompttext}>What do you want to fact check today?</Text>
                                <Text style={styles.greetingText}>Hi Mareli</Text>
                            </View>
                        </View>


                        <View style={styles.uploadSection}>
                            <TouchableOpacity style={styles.touchbutton}>
                                <Image style={styles.uploadicon} source={require('../assets/images/upload_icon.png')} />
                                <Text style={styles.uploadText}>Tap to upload .pdf file</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.factCheckButton}>
                                <Text style={styles.factCheckButtonText}>Fact Check</Text>
                            </TouchableOpacity>
                        </View>
                        <View style={styles.urlSection}>
                            <Text style={styles.urlLabel}>URL checker</Text>
                            <View style={styles.urlInputContainer}>
                                <TextInput
                                    style={styles.urlInput}
                                    placeholder="Enter URL"
                                    placeholderTextColor="#999"
                                />
                                <TouchableOpacity style={styles.factCheckUrlButton}>
                                    <Text style={styles.factCheckButtonText2}>Fact Check</Text>
                                </TouchableOpacity>
                            </View>
                        </View>

                        <View style={styles.historySection}>
                            <Text style={styles.historyLabel}>History</Text>
                            <TouchableOpacity>
                                <Text style={styles.viewAllText}>View All</Text>
                            </TouchableOpacity>
                        </View>
                        <View style={styles.item}>
                            <View style={styles.leftSection}>
                                <Image style={styles.icon} source={require('../assets/images/document_icon.png')} />
                                <View style={styles.textSection}>
                                    {/* Display the title and date of the item */}
                                    <Text style={styles.title}>Lions are mammals</Text>
                                    <Text style={styles.date}>20 June 2024</Text>
                                </View>
                            </View>
                            {/* Display the percentage for the item */}
                            <Text style={styles.percentage}>100%</Text>
                        </View>
                        <View style={styles.item}>
                            <View style={styles.leftSection}>
                                <Image style={styles.icon} source={require('../assets/images/document_icon.png')} />
                                <View style={styles.textSection}>
                                    {/* Display the title and date of the item */}
                                    <Text style={styles.title}>Capitec debt</Text>
                                    <Text style={styles.date}>20 June 2024</Text>
                                </View>
                            </View>
                            {/* Display the percentage for the item */}
                            <Text style={styles.percentage}>75%</Text>
                        </View>


                    </View>
                </ScrollView>
            </SafeAreaView>
        </SafeAreaProvider>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,                         // Make the container fill the entire screen
        backgroundColor: '#B7E4FA',     // Set background color
        padding: 20,
    },
    background: {
        backgroundColor: '#FFFFFF',      // Set background color for the bottom view
        height: 700,                      // Set height
        width: 500,                       // Set width
        position: 'absolute',             // Position it absolutely
        bottom: 0,                        // Align to the bottom
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
    },
    profileimage: {
        width: 62,
        height: 62,
        borderRadius: 25,
        marginRight: 10,
    },
    greetingText: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#001A23',
        fontFamily: 'FuturaPTBold',
    },
    prompttext: {
        fontSize: 16,
        color: '#808089',
        width: '90%',
        fontFamily: 'MontserratReg',
    },
    uploadSection: {
        backgroundColor: '#F5F8FA',
        borderRadius: 15,
        height: 436,
        alignItems: 'center',
        padding: 20,
    },
    touchbutton: {
        height: 340,
        width: '100%',
        backgroundColor: '#B7E4FA',
        borderRadius: 15,
        alignItems: 'center',
        justifyContent: 'center',
    },
    uploadicon: {
        width: 121,
        height: 159,
        marginBottom: 30,
    },
    uploadText: {
        color: '#808089',
        fontSize: 16,
        fontFamily: 'MontserratReg',
    },
    factCheckButton: {
        backgroundColor: '#0FA5EF',
        paddingVertical: 10,
        paddingHorizontal: 20,
        width: '100%',
        height: 43,
        marginTop: 18,
        borderRadius: 12,
        alignItems: 'center',
    },
    factCheckButtonText: {
        fontSize: 17,
        fontWeight: 'bold',
        color: '#FFFFFF',
        fontFamily: 'FuturaPTBold',
    },
    urlSection: {
        marginBottom: 20,
        width: '100%',
    },
    urlLabel: {
        fontSize: 17,
        fontWeight: 'bold',
        color: '#001A23',
        fontFamily: 'FuturaPTBold',
        marginTop: 17,
        marginBottom: 17,
    },
    urlInputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderColor: '#0FA5EF',
        borderWidth: 1,
        borderRadius: 15,
        paddingHorizontal: 10,
        height: 50,
        backgroundColor: '#FFFFFF',
    },
    urlInput: {
        flex: 1,
        color: '#333',
        paddingHorizontal: 10,
    },
    factCheckUrlButton: {
        backgroundColor: '#0FA5EF',
        paddingVertical: 10,
        paddingHorizontal: 15,
        borderRadius: 10,
        marginLeft: 5,
    },
    factCheckButtonText2: {
        color: '#FFFFFF',
        fontWeight: 'bold',
        fontSize: 14,
    },
    historySection: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    historyLabel: {
        fontSize: 17,
        fontWeight: 'bold',
        color: '#001A23',
        fontFamily: 'FuturaPTBold',
        marginBottom: 17,
    },
    viewAllText: {
        color: '#0FA5EF',
        fontSize: 14,
    },
    item: {
        flexDirection: 'row',            // Align items in a row
        justifyContent: 'space-between',  // Space items evenly
        alignItems: 'center',            // Center align items vertically
        backgroundColor: '#F5F8FA',      // Set background color for each item
        borderRadius: 10,                 // Round the corners
        padding: 15,                     // Add padding
        marginBottom: 15,                // Add bottom margin
        height: 96,                      // Set height for each item
    },
    leftSection: {
        flexDirection: 'row',            // Align icon and text in a row
        alignItems: 'center',            // Center align vertically
    },
    icon: {
        width: 37,                       // Set width for the icon
        height: 51,                      // Set height for the icon
        marginRight: 15,                 // Add right margin
        objectFit: 'contain',            // Maintain aspect ratio
    },
    textSection: {
        justifyContent: 'center',        // Center the text vertically
    },
    title: {
        fontSize: 17,                   // Set font size for the title
        fontWeight: 'bold',              // Make the title bold
        color: '#000',                   // Set title color
        marginBottom: 2                  // Add bottom margin
    },
    date: {
        fontSize: 16,                   // Set font size for the date
        color: '#7D7D7D',                // Set date color
        fontFamily: 'MontserratReg',     // Set font family
    },
    percentage: {
        fontSize: 32,                   // Set font size for the percentage
        fontWeight: 'bold',              // Make the percentage bold
        color: '#000',                   // Set percentage color
    },
});
