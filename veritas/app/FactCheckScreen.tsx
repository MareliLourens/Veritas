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
                                    <Text style={styles.title}>Lions are mammals</Text>
                                    <Text style={styles.date}>20 June 2024</Text>
                                </View>
                            </View>
                            <Text style={styles.percentage}>100%</Text>
                        </View>
                        <View style={styles.item}>
                            <View style={styles.leftSection}>
                                <Image style={styles.icon} source={require('../assets/images/document_icon.png')} />
                                <View style={styles.textSection}>
                                    <Text style={styles.title}>Capitec debt</Text>
                                    <Text style={styles.date}>20 June 2024</Text>
                                </View>
                            </View>
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
        flex: 1,
        backgroundColor: '#B7E4FA',
        padding: 20,
    },
    background: {
        backgroundColor: '#FFFFFF',
        height: 700,
        width: 500,
        position: 'absolute',
        bottom: 0,
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
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#F5F8FA',
        borderRadius: 10,
        padding: 15,
        marginBottom: 15,
        height: 96,
    },
    leftSection: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    icon: {
        width: 37,
        height: 51,
        marginRight: 15,
        objectFit: 'contain',
    },
    textSection: {
        justifyContent: 'center',
    },
    title: {
        fontSize: 17,
        fontWeight: 'bold',
        color: '#000',
        marginBottom: 2
    },
    date: {
        fontSize: 16,
        color: '#808089',
        fontFamily: 'MontserratReg',
    },
    percentage: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#000',
    },
});
