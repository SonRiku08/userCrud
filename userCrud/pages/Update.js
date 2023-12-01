import React from 'react'
import { View, Button, Text, TextInput, StyleSheet, Dimensions, ActivityIndicator } from 'react-native'
import axios from 'axios'

const { width: screenWidth } = Dimensions.get('window');
const IP = "http://192.168.1.74"

export default class Update extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            email: '',
            password: '',
            loading: false,
        };
    }
    returnHome(){
        this.props.navigation.navigate("Home");
    }

    updatePassword = async($id, $password) => {
        this.setState({ loading: true });
        const formData = {
            id: $id,
            password: $password,
            action: 'editAccount',
        }
        try{
            const response = await axios.post(IP+"/userCrudBack/api/api.php",formData);
            if(response.data.success){
                console.log('Modification réussie');
            }
            else{
                console.error('Modification échouée :', response.data.message);
            }
        } catch (error) {
            console.error('Erreur lors de la connexion :', error);
        } finally {
            this.setState({ loading: false });
        }
    }

    render(){
        const { user } = this.props.route.params;
        const { password, loading } = this.state;
        return(
            <View>
                <View>
                    <Text>{"Id: " + user.id}</Text>
                </View>
                <View style={this.styles.container}>
                    <Text>Update Page</Text>
                    <Text>{"Email: " + user.email}</Text>
                    <TextInput value={password} placeholder="Password" onChangeText={(text) => this.setState({ password: text })}></TextInput>
                    { loading ? (
                        <ActivityIndicator size="large" color="#0000ff" />
                    ) : (
                        <>
                            <Button title="Save" onPress={() => this.updatePassword(user.id, password)}></Button>
                            <Button title="Return" onPress={() => this.returnHome()}></Button>
                        </>      
                    )}
                    
                </View>
            </View>

        )

    }
    
    styles = StyleSheet.create({
        container: {
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
    })

}