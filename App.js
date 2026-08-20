import React, { useState } from 'react';
import { Text, View, ScrollView, TouchableOpacity, TextInput, Modal, Alert, SafeAreaView, StatusBar, Linking, Image, ImageBackground, Share } from 'react-native';

export default function App() {
  const [balance, setBalance] = useState(1100.0);
  const [bottomNav, setBottomNav] = useState('Invest');
  const [modalVisible, setModalVisible] = useState(false);
  const [withdrawVisible, setWithdrawVisible] = useState(false);
  const [adminVisible, setAdminVisible] = useState(false);
  const [adminAuth, setAdminAuth] = useState(false);
  const [adminPin, setAdminPin] = useState('');
  const [depositAmount, setDepositAmount] = useState('500');
  const [selectedUpi, setSelectedUpi] = useState('deepsingh7412@ibl');
  const [transactionId, setTransactionId] = useState('');
  const [myPlans, setMyPlans] = useState([]);
  const [depReqs, setDepReqs] = useState([]);
  const [withReqs, setWithReqs] = useState([]);

  const today = new Date().toDateString();
  const refLink = 'https://solarinvest.in/register?ref=Guri7412';

  const openSupport = () => Linking.openURL('https://t.me/Guri7412');

  const handleClaim = (p) => {
    if (p.lastCol === today) return Alert.alert('Limit', 'Aaj ki income le chuke hain.');
    setBalance(b => b + p.daily);
    setMyPlans(myPlans.map(x => x.id === p.id ? {...x, lastCol: today} : x));
    Alert.alert('Success', '₹' + p.daily + ' added!');
  };

  return (
    <SafeAreaView style={{flex:1, backgroundColor:'#0a101d'}}>
      <StatusBar barStyle="light-content" />
      <View style={{padding:14, flexDirection:'row', justifyContent:'space-between', backgroundColor:'#0e1726'}}>
        <Text style={{color:'#f59e0b', fontWeight:'bold', fontSize:18}}>SOLAR INVEST</Text>
        <TouchableOpacity onPress={openSupport} style={{backgroundColor:'#0284c7', padding:5, borderRadius:5}}><Text style={{color:'#fff', fontSize:10}}>✈️ @Guri7412</Text></TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={{paddingBottom: 100}}>
        {bottomNav === 'Invest' && (
          <View style={{padding:20}}>
            <View style={{backgroundColor:'#1e293b', padding:20, borderRadius:15}}>
              <Text style={{color:'#94a3b8', fontSize:12}}>TOTAL BALANCE</Text>
              <Text style={{color:'#fff', fontSize:32, fontWeight:'bold', marginVertical:10}}>₹{balance.toFixed(2)}</Text>
              <View style={{flexDirection:'row', gap:10}}>
                <TouchableOpacity style={{flex:1, backgroundColor:'#16a34a', padding:15, borderRadius:10, alignItems:'center'}} onPress={() => setModalVisible(true)}><Text style={{color:'#fff', fontWeight:'bold'}}>⚡ + Recharge</Text></TouchableOpacity>
                <TouchableOpacity style={{flex:1, backgroundColor:'#0284c7', padding:15, borderRadius:10, alignItems:'center'}} onPress={() => setWithdrawVisible(true)}><Text style={{color:'#fff', fontWeight:'bold'}}>↗ Withdraw</Text></TouchableOpacity>
              </View>
            </View>
            {myPlans.map(p => (
              <View key={p.id} style={{backgroundColor:'#1e293b', padding:15, marginTop:10, borderRadius:10, flexDirection:'row', justifyContent:'space-between'}}>
                <Text style={{color:'#fff'}}>{p.name}</Text>
                <TouchableOpacity onPress={() => handleClaim(p)}><Text style={{color: p.lastCol === today ? 'gray' : '#22c55e'}}>{p.lastCol === today ? 'Collected' : 'Collect'}</Text></TouchableOpacity>
              </View>
            ))}
          </View>
        )}

        {bottomNav === 'Invite' && (
          <View style={{padding:20}}>
            <Text style={{color:'#f59e0b', fontWeight:'bold', fontSize:18}}>🎉 30% BONUS</Text>
            <Text style={{color:'#fff', marginVertical:10}}>Invite friends to earn 30% commission.</Text>
            <Text style={{color:'#22c55e', marginBottom:20}}>{refLink}</Text>
            <TouchableOpacity style={{backgroundColor:'#16a34a', padding:15, borderRadius:10, alignItems:'center'}} onPress={() => Share.share({message: `Join: ${refLink}`})}><Text style={{color:'#fff', fontWeight:'bold'}}>🚀 Share Invite Link</Text></TouchableOpacity>
          </View>
        )}

        {bottomNav === 'Profile' && (
          <View style={{padding:20}}>
            <Text style={{color:'#fff', fontSize:18, marginBottom:20}}>Profile Dashboard</Text>
            <TouchableOpacity onPress={() => setAdminVisible(true)} style={{backgroundColor:'#f59e0b', padding:15, borderRadius:10}}><Text style={{fontWeight:'bold'}}>👑 Admin Panel</Text></TouchableOpacity>
          </View>
        )}
      </ScrollView>

      {/* Bottom Nav */}
      <View style={{position:'absolute', bottom:0, width:'100%', flexDirection:'row', justifyContent:'space-around', padding:15, backgroundColor:'#1e293b'}}>
        <TouchableOpacity onPress={() => setBottomNav('Invest')}><Text style={{color:bottomNav==='Invest'?'#f59e0b':'#fff'}}>⚡ Invest</Text></TouchableOpacity>
        <TouchableOpacity onPress={() => setBottomNav('History')}><Text style={{color:bottomNav==='History'?'#f59e0b':'#fff'}}>📋 History</Text></TouchableOpacity>
        <TouchableOpacity onPress={() => setBottomNav('Invite')}><Text style={{color:bottomNav==='Invite'?'#f59e0b':'#fff'}}>🎁 Invite</Text></TouchableOpacity>
        <TouchableOpacity onPress={() => setBottomNav('Profile')}><Text style={{color:bottomNav==='Profile'?'#f59e0b':'#fff'}}>👤 Profile</Text></TouchableOpacity>
      </View>

      {/* Recharge Modal */}
      <Modal visible={modalVisible} transparent={true}><View style={{flex:1, backgroundColor:'#0008', justifyContent:'center', padding:20}}><View style={{backgroundColor:'#fff', padding:20, borderRadius:15}}>
        <Text style={{fontWeight:'bold'}}>Recharge QR</Text>
        <Image source={{ uri: 'https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=upi://pay?pa='+selectedUpi+'&am='+depositAmount }} style={{width:150, height:150, alignSelf:'center'}} />
        <TextInput placeholder="Amount" value={depositAmount} onChangeText={setDepositAmount} style={{borderBottomWidth:1}} />
        <TextInput placeholder="UTR No" value={transactionId} onChangeText={setTransactionId} style={{borderBottomWidth:1}} />
        <TouchableOpacity style={{backgroundColor:'#16a34a', padding:10, marginTop:10}} onPress={() => {setDepReqs([...depReqs, {}]); setModalVisible(false)}}><Text style={{color:'#fff'}}>Submit</Text></TouchableOpacity>
      </View></View></Modal>
      
      {/* Admin Panel */}
      <Modal visible={adminVisible} transparent={true}><View style={{flex:1, backgroundColor:'#0008', justifyContent:'center', padding:20}}><View style={{backgroundColor:'#fff', padding:20, borderRadius:15}}>
        {!adminAuth ? <><TextInput placeholder="PIN (7412)" secureTextEntry onChangeText={setAdminPin} /><TouchableOpacity onPress={() => {if(adminPin==='7412') setAdminAuth(true)}}><Text>Login</Text></TouchableOpacity></> : <Text>Pending Req: {depReqs.length}</Text>}
        <TouchableOpacity onPress={() => {setAdminVisible(false); setAdminAuth(false)}}><Text style={{color:'red'}}>Close</Text></TouchableOpacity>
      </View></View></Modal>
    </SafeAreaView>
  );
                   }
