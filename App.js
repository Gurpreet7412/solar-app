import React, { useState } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, TextInput, Modal, Alert, SafeAreaView, StatusBar, Image } from 'react-native';

export default function App() {
  const [b, setB] = useState(1100.0), [mR, setMR] = useState(false), [mA, setMA] = useState(false), [pin, setPin] = useState(''), [auth, setAuth] = useState(false);
  const [plans, setPlans] = useState([
    { id: 1, name: 'Solar Micro 15D', price: 200, daily: 25, badge: 'Hot' },
    { id: 2, name: 'Solar Mini 15D', price: 400, daily: 55, badge: 'Popular' },
    { id: 3, name: 'Solar Boost 15D', price: 800, daily: 120, badge: 'High Return' },
    { id: 4, name: 'Solar Plant 30D', price: 1500, daily: 240, badge: 'Stable' }
  ]);
  const [myPlans, setMyPlans] = useState([]);
  const today = new Date().toDateString();

  const handleClaim = (p) => {
    if (p.lCol === today) return Alert.alert('Limit', 'Aaj ki earning collect ho chuki hai.');
    setB(x => x + p.daily);
    setMyPlans(myPlans.map(x => x.id === p.id ? {...x, lCol: today} : x));
    Alert.alert('Success', '₹' + p.daily + ' added!');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}><Text style={styles.title}>SOLAR INVEST</Text><TouchableOpacity onPress={() => setMA(true)}><Text style={{color:'#1e293b'}}>Admin</Text></TouchableOpacity></View>
      <ScrollView contentContainerStyle={{padding: 20}}>
        <View style={styles.balCard}>
          <Text style={{color:'#94a3b8', fontSize:12}}>TOTAL WALLET BALANCE</Text>
          <Text style={styles.bal}>₹{b.toFixed(2)}</Text>
          <View style={{flexDirection:'row', gap:10}}>
            <TouchableOpacity style={styles.btnGreen} onPress={() => setMR(true)}><Text style={styles.btnTxt}>⚡ + Recharge</Text></TouchableOpacity>
            <TouchableOpacity style={styles.btnBlue}><Text style={styles.btnTxt}>↗ Withdraw</Text></TouchableOpacity>
          </View>
        </View>
        <Text style={styles.section}>All Plans</Text>
        {plans.map(p => (
          <View key={p.id} style={styles.planCard}>
            <Text style={styles.badge}>{p.badge}</Text>
            <Text style={styles.name}>{p.name}</Text>
            <Text style={styles.daily}>Daily Earning: ₹{p.daily}</Text>
            <TouchableOpacity style={styles.investBtn} onPress={() => {setB(x => x - p.price); setMyPlans([...myPlans, {...p, lCol: ''}]);}}><Text style={styles.btnTxt}>Invest ₹{p.price}</Text></TouchableOpacity>
          </View>
        ))}
        <Text style={styles.section}>My Active Plans</Text>
        {myPlans.map(p => (
          <View key={p.id} style={styles.planCard}>
            <Text style={styles.name}>{p.name}</Text>
            <TouchableOpacity onPress={() => handleClaim(p)}><Text style={{color: p.lCol === today ? 'gray' : '#22c55e'}}>{p.lCol === today ? 'Collected' : 'Collect Daily'}</Text></TouchableOpacity>
          </View>
        ))}
      </ScrollView>

      {/* Recharge Modal */}
      <Modal visible={mR} transparent={true}><View style={styles.modal}><View style={styles.modalContent}>
        <Text style={{fontWeight:'bold'}}>Recharge via UPI</Text>
        <Image source={{ uri: `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=upi://pay?pa=deepsingh7412@ibl&am=500` }} style={{width:150, height:150, alignSelf:'center', margin:15}} />
        <TouchableOpacity onPress={() => setMR(false)}><Text style={{color:'red', textAlign:'center'}}>Close</Text></TouchableOpacity>
      </View></View></Modal>
      
      {/* Admin Panel */}
      <Modal visible={mA} transparent={true}><View style={styles.modal}><View style={styles.modalContent}>
        {!auth ? <><TextInput placeholder="PIN (7412)" secureTextEntry onChangeText={setPin}/><TouchableOpacity onPress={() => {if(pin==='7412') setAuth(true)}}><Text>Login</Text></TouchableOpacity></> : <Text>Admin Access Granted</Text>}
        <TouchableOpacity onPress={() => {setMA(false); setAuth(false)}}><Text style={{marginTop:10}}>Close</Text></TouchableOpacity>
      </View></View></Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {flex:1, backgroundColor:'#0a101d'},
  header: {padding:20, flexDirection:'row', justifyContent:'space-between'},
  title: {color:'#f59e0b', fontWeight:'bold', fontSize:20},
  balCard: {backgroundColor:'#1e293b', padding:20, borderRadius:15},
  bal: {color:'#fff', fontSize:32, fontWeight:'bold', marginVertical:10},
  btnGreen: {flex:1, backgroundColor:'#16a34a', padding:15, borderRadius:10, alignItems:'center'},
  btnBlue: {flex:1, backgroundColor:'#0284c7', padding:15, borderRadius:10, alignItems:'center'},
  btnTxt: {color:'#fff', fontWeight:'bold'},
  section: {color:'#fff', marginVertical:15, fontWeight:'bold'},
  planCard: {backgroundColor:'#1e293b', padding:15, borderRadius:15, marginBottom:10},
  badge: {color:'#f59e0b', fontSize:10},
  name: {color:'#fff', fontWeight:'bold', marginVertical:5},
  daily: {color:'#22c55e', marginBottom:10},
  investBtn: {backgroundColor:'#3b82f6', padding:10, borderRadius:8, alignItems:'center'},
  modal: {flex:1, backgroundColor:'#0008', justifyContent:'center', padding:20},
  modalContent: {backgroundColor:'#fff', padding:20, borderRadius:15}
});
  
