import React, { useState } from 'react';
import { Text, View, ScrollView, TouchableOpacity, TextInput, Modal, Alert, SafeAreaView, StatusBar, Linking, Image, Share } from 'react-native';

export default function App() {
  const [balance, setBalance] = useState(1100.0);
  const [bottomNav, setBottomNav] = useState('Invest');
  const [modalVisible, setModalVisible] = useState(false);
  const [adminVisible, setAdminVisible] = useState(false);
  const [adminAuth, setAdminAuth] = useState(false);
  const [adminPin, setAdminPin] = useState('');
  const [selectedUpi, setSelectedUpi] = useState('deepsingh7412@ibl');
  const [depositAmount, setDepositAmount] = useState('500');

  const openUpi = (app) => {
    const url = app === 'pp' ? `phonepe://pay?pa=${selectedUpi}&pn=SolarInvest&am=${depositAmount}&cu=INR` : `paytmmp://pay?pa=${selectedUpi}&pn=SolarInvest&am=${depositAmount}&cu=INR`;
    Linking.openURL(url).catch(() => Alert.alert('Error', 'App not installed'));
  };

  return (
    <SafeAreaView style={{flex:1, backgroundColor:'#0a101d'}}>
      <StatusBar barStyle="light-content" />
      <View style={{padding:15, flexDirection:'row', justifyContent:'space-between', backgroundColor:'#0e1726'}}>
        <Text style={{color:'#f59e0b', fontWeight:'bold', fontSize:18}}>SOLAR INVEST</Text>
        <TouchableOpacity onPress={() => Linking.openURL('https://t.me/Guri7412')}><Text style={{color:'#fff'}}>✈️ Support</Text></TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={{padding:20, paddingBottom:150}}>
        {bottomNav === 'Invest' && (
          <View>
            <View style={{backgroundColor:'#1e293b', padding:20, borderRadius:15}}>
              <Text style={{color:'#94a3b8'}}>BALANCE</Text>
              <Text style={{color:'#fff', fontSize:30, fontWeight:'bold'}}>₹{balance.toFixed(2)}</Text>
              <TouchableOpacity style={{backgroundColor:'#16a34a', padding:15, marginTop:10, borderRadius:10, alignItems:'center'}} onPress={() => setModalVisible(true)}><Text style={{color:'#fff', fontWeight:'bold'}}>⚡ + Recharge</Text></TouchableOpacity>
            </View>
          </View>
        )}
        {bottomNav === 'Invite' && (
          <View style={{backgroundColor:'#1e293b', padding:20, borderRadius:15}}>
            <Text style={{color:'#f59e0b', fontSize:20}}>🎉 30% BONUS</Text>
            <Text style={{color:'#fff', marginVertical:10}}>Refer Link: https://solarinvest.in/register?ref=Guri7412</Text>
            <TouchableOpacity style={{backgroundColor:'#16a34a', padding:15, borderRadius:10}} onPress={() => Share.share({message: 'Join Solar: https://solarinvest.in/register?ref=Guri7412'})}><Text style={{color:'#fff', textAlign:'center'}}>🚀 Share Link</Text></TouchableOpacity>
          </View>
        )}
        {bottomNav === 'Profile' && (
          <View style={{padding:20}}>
            <TouchableOpacity style={{backgroundColor:'#f59e0b', padding:15, borderRadius:10}} onPress={() => setAdminVisible(true)}><Text style={{fontWeight:'bold'}}>👑 Admin Panel</Text></TouchableOpacity>
          </View>
        )}
      </ScrollView>

      {/* Fixed Bottom Nav */}
      <View style={{position:'absolute', bottom:0, width:'100%', flexDirection:'row', justifyContent:'space-around', padding:15, backgroundColor:'#0e1726', borderTopWidth:1, borderColor:'#334155'}}>
        <TouchableOpacity onPress={() => setBottomNav('Invest')}><Text style={{color:bottomNav==='Invest'?'#f59e0b':'#fff'}}>⚡ Invest</Text></TouchableOpacity>
        <TouchableOpacity onPress={() => setBottomNav('History')}><Text style={{color:bottomNav==='History'?'#f59e0b':'#fff'}}>📋 History</Text></TouchableOpacity>
        <TouchableOpacity onPress={() => setBottomNav('Invite')}><Text style={{color:bottomNav==='Invite'?'#f59e0b':'#fff'}}>🎁 Invite</Text></TouchableOpacity>
        <TouchableOpacity onPress={() => setBottomNav('Profile')}><Text style={{color:bottomNav==='Profile'?'#f59e0b':'#fff'}}>👤 Profile</Text></TouchableOpacity>
      </View>

      {/* Recharge Modal */}
      <Modal visible={modalVisible} transparent={true}><View style={{flex:1, backgroundColor:'#0008', justifyContent:'center', padding:20}}><View style={{backgroundColor:'#fff', padding:20, borderRadius:15}}>
        <TouchableOpacity onPress={() => setSelectedUpi('deepsingh7412@ibl')}><Text style={{padding:10, borderWidth:1, margin:5, backgroundColor:selectedUpi==='deepsingh7412@ibl'?'#d1fae5':'#fff'}}>1. deepsingh7412@ibl</Text></TouchableOpacity>
        <TouchableOpacity onPress={() => setSelectedUpi('mandeep7412@axl')}><Text style={{padding:10, borderWidth:1, margin:5, backgroundColor:selectedUpi==='mandeep7412@axl'?'#d1fae5':'#fff'}}>2. mandeep7412@axl</Text></TouchableOpacity>
        <Image source={{ uri: `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=upi://pay?pa=${selectedUpi}&am=${depositAmount}` }} style={{width:150, height:150, alignSelf:'center'}} />
        <View style={{flexDirection:'row', gap:10, marginVertical:10}}>
            <TouchableOpacity style={{flex:1, backgroundColor:'#5f259f', padding:10}} onPress={() => openUpi('pp')}><Text style={{color:'#fff', textAlign:'center'}}>PhonePe</Text></TouchableOpacity>
            <TouchableOpacity style={{flex:1, backgroundColor:'#00baf2', padding:10}} onPress={() => openUpi('pt')}><Text style={{color:'#fff', textAlign:'center'}}>Paytm</Text></TouchableOpacity>
        </View>
        <TouchableOpacity onPress={() => setModalVisible(false)}><Text style={{color:'red', textAlign:'center'}}>Close</Text></TouchableOpacity>
      </View></View></Modal>

      {/* Admin Panel */}
      <Modal visible={adminVisible} transparent={true}><View style={{flex:1, backgroundColor:'#0008', justifyContent:'center', padding:20}}><View style={{backgroundColor:'#fff', padding:20, borderRadius:15}}>
        {!adminAuth ? <><TextInput placeholder="PIN (7412)" secureTextEntry onChangeText={setAdminPin} /><TouchableOpacity onPress={() => {if(adminPin==='7412') setAdminAuth(true)}}><Text>Login</Text></TouchableOpacity></> : <Text>Admin Access Active</Text>}
        <TouchableOpacity onPress={() => {setAdminVisible(false); setAdminAuth(false)}}><Text style={{color:'red', marginTop:10}}>Close</Text></TouchableOpacity>
      </View></View></Modal>
    </SafeAreaView>
  );
  }
          
