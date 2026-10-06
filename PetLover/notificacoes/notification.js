import {StatusBar} from 'expo-status-bar'
import * as Notifications from 'expo-notifications';
import {useEffect} from 'react';

Notifications.setNotificationHandler({
  handleNotification: async ()=>({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  })
})

export default function notification(){
  useEffect(()=>{
    (async ()=>{
      const {status} = await Notifications.requestPermissionsAsync();
      if(status !== 'granted'){
        Alert.alert('Permissão negada.')
      }
    })();
  },[])

  const triggerNotification = async ()=>{
    const {status} = await Notifications.getPermissionsAsync();
    if(status !== 'granted'){
      Alert.alert('Permissão negada.')
      return;
    }

    await Notifications.scheduleNotificationAsync({
      content:{
        title: 'Hello, World!',
        body:'Minha primeira/várias notificações.'
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL, 
        seconds: 2
      }
    })
  }
}