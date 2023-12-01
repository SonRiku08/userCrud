import React from 'react'
import { View, Text, StyleSheet, Button } from 'react-native'
import axios from 'axios';

const IP = "http://192.168.1.74"

export default class Home extends React.Component {

    goUpdatePage() {
        this.props.navigation.navigate("Update");
    }

    deleteAccount = async (idDeletion, logOut) => {
        const formData = {
            id: idDeletion,
            action: 'deleteAccount',
        };
        try {
            const response = await axios.post(IP + '/userCrudBack/api/api.php', formData);    
            if (response.data.success) {
                console.log('La Suppression a réussi');
                logOut();
            } else {
                console.error('La Suppression a échouée :', response.data.message);
            }
        } catch (error) {
            console.error('Erreur lors de la connexion :', error);
        }
    };
    render(){
        const { user, logOut } = this.props.route.params;
        return(
            <View>
                <View>
                    <Text>{"Id: " + user.id}</Text>
                    <Text>{"Email: " + user.email}</Text>
                </View>
                <View style={this.styles.container}>
                    <Button title="Edit" onPress={() => this.goUpdatePage()}></Button>
                    <Button title="Delete" onPress={() => this.deleteAccount(user.id, logOut)}></Button>
                    <Button title="Logout" onPress={logOut}></Button>
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
    })


}