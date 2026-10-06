import {View, Text, Button, Alert} from 'react-native'
import {sair} from '../services/auth'
import {auth} from '../config/firebase'

export default function Home({navigation}){
    
    async function realizarLogout(){
        await sair()
        navigation.navigate('Login')
    }

    return(
        <View>
            <Text>Seja bem-vindo(a)</Text>
            <Text>Usuário: {auth.currentUser?.email}</Text>

            <Button
                title='Sair'
                onPress={realizarLogout}
            />
        </View>
    )
}