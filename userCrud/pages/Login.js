import { View, Button, TextInput, ActivityIndicator, StyleSheet, Dimensions, KeyboardAvoidingView } from 'react-native';
import React from 'react';
import axios from 'axios';

const { width: screenWidth } = Dimensions.get('window');
const IP = "http://192.168.1.74"

export default class Login extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            email: '',
            password: '',
            loading: false,
        };
    }

    signIn = async () => {
        const { email, password } = this.state;
        this.setState({ loading: true });

        const formData = {
            email: email,
            password: password,
            action: "signIn"
        };

        try {
            const response = await axios.post(IP+"/userCrudBack/api/api.php", formData);

            if (response.data.success) {
                console.log('Connexion réussie');
                this.props.route.params.updateUser(response.data.user);
            } else {
                console.error('Connexion échouée :', response.data.message);
            }
        } catch (error) {
            console.error('Erreur lors de la connexion :', error);
        } finally {
            this.setState({ loading: false });
        }
    }

    signUp = async () => {
        const { email, password } = this.state;
        this.setState({ loading: true });

        const formData = {
            email: email,
            password: password,
            action: "signUp"
        };

        try {
            const response = await axios.post(IP+"/userCrudBack/api/api.php", formData);

            if (response.data.success) {
                console.log('Compte créé');
            } else {
                console.error('Erreur lors de la création du compte:', response.data.message);
            }
        } catch (error) {
            console.error('Erreur lors de la connexion:', error.message);
        } finally {
            this.setState({ loading: false });
        }
    };

    render() {
        const { email, password, loading } = this.state;

        return (
            <View style={styles.container}>
                <KeyboardAvoidingView behavior="padding">
                    <TextInput value={email} style={styles.input} placeholder="Email" autoCapitalize="none" onChangeText={(text) => this.setState({ email: text })}></TextInput>
                    <TextInput secureTextEntry={true} style={styles.input} value={password} placeholder="Password" autoCapitalize="none" onChangeText={(text) => this.setState({ password: text })}></TextInput>
                    {loading ? (
                        <ActivityIndicator size="large" color="#0000ff" />
                    ) : (
                        <>
                            <Button title="Login" onPress={this.signIn} />
                            <Button title="Create account" onPress={this.signUp} />
                        </>
                    )}
                </KeyboardAvoidingView>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
        alignItems: "center",
        justifyContent: "center",
    },
    input: {
        marginVertical: 4,
        height: 50,
        width: screenWidth * 0.8,
        borderWidth: 1,
        borderRadius: 4,
        backgroundColor: '#fff',
    }
});