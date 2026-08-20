import React, { useState } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, TextInput, Modal, Alert, SafeAreaView, StatusBar, Linking, Image, ImageBackground, Share } from 'react-native';

export default function App() {
  const [balance, setBalance] = useState(1100.0);
  const [bottomNav, setBottomNav] = useState('Invest');
  const [modalVisible, setModalVisible] = useState(false);
  const [withdrawModalVisible, setWithdrawModalVisible] = useState(false);
  const [adminModalVisible, setAdminModalVisible] = useState(false);
  const [adminAuth, setAdminAuth] = useState(false);
  const [adminPin, setAdminPin] = useState('');
  const [depositAmount, setDepositAmount] = useState('500');
  const [selectedUpi, setSelectedUpi] = useState('deepsingh7412@ibl');
  const [transactionId, setTransactionId] = useState('');
  const [myActivePlans, setMyActivePlans] = useState([]);
  const [depositRequests, setDepositRequests] = useState([]);
  const [withdrawRequests, setWithdrawRequests] = useState([]);
  
  const todayStr = new Date().toDateString();

  const plans = [
    { id: 1, badge: '🔥 Hot', name: 'Solar Micro 15D', price: 200, daily: 25, duration: '15 Days' },
    { id: 2, badge: '⭐ Popular', name: 'Solar Mini 15D', price: 400, daily: 55, duration: '15 Days' },
    { id: 3, badge: '🚀 High Return', name: 'Solar Boost 15D', price: 800, daily: 120, duration: '15 Days' },
    { id: 4, badge: '🌱 Stable', name: 'Solar Plant 30D', price: 1500, daily: 240, duration: '30 Days' }
  ];

  const handleInvest = (p) => {
    if (balance < p.price) return Alert.alert('Error', 'Low Balance');
    setBalance(balance - p.price);
    setMyActivePlans([{ id: Date.now().toString(), name: p.name, daily: p.daily, lastCol: '' }, ...myActivePlans]);
    Alert.alert('Success', 'Invested!');
  };

  const handleClaim = (p) => {
    if (p.lastCol === todayStr) return Alert.alert('Limit', 'Aaj ki income le chuke hain.');
    setBalance(balance + p.daily);
    setMyActivePlans(myActivePlans.map(x => x.id === p.id ? {...x, lastCol: todayStr} : x));
    Alert.alert('Success', 'Added!');
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      <View style={styles.header}>
        <Text style={styles.logo}>SOLAR INVEST</Text>
        <TouchableOpacity onPress={() => setAdminModalVisible(true)}><Text style={{color:'#f59e0b', fontSize:10}}>Admin</Text></TouchableOpacity>
      </View>
      <ScrollView contentContainerStyle={{padding:20}}>
        <View style={styles.balanceCard}>
          <Text style={{color:'#94a3b8', fontSize:12}}>TOTAL WALLET BALANCE</Text>
          <Text style={styles.balText}>₹{balance.toFixed(2)}</Text>
          <View style={styles.btnRow}>
            <TouchableOpacity style={styles.btnRecharge} onPress={() => setModalVisible(true)}><Text style={styles.btnTxt}>⚡ + Recharge</Text></TouchableOpacity>
            <TouchableOpacity style={styles.btnWithdraw} onPress={() => setWithdrawModalVisible(true)}><Text style={styles.btnTxt}>↗ Withdraw</Text></TouchableOpacity>
          </View>
        </View>

        {myActivePlans.map(ap => (
          <View key={ap.id} style={styles.planCard}>
            <Text style={{color:'#fff', fontWeight:'bold'}}>{ap.name}</Text>
            <TouchableOpacity onPress={() => handleClaim(ap)}>
                <Text style={{color: ap.lastCol === todayStr ? 'gray' : '#22c55e'}}>{ap.lastCol === todayStr ? 'Collected' : 'Collect Daily'}</Text>
            </TouchableOpacity>
          </View>
        ))}

        {plans.map(p => (
          <View key={p.id} style={styles.planCard}>
            <Text style={styles.badge}>{p.badge}</Text>
            <Text style={styles.planName}>{p.name}</Text>
            <Text style={styles.earning}>Daily Earning: ₹{p.daily}</Text>
            <TouchableOpacity style={styles.investBtn} onPress={() => handleInvest(p)}><Text style={styles.btnTxt}>Invest ₹{p.price}</Text></TouchableOpacity>
          </View>
        ))}
      </ScrollView>

      {/* Recharge Modal WITH QR */}
      <Modal visible={modalVisible} transparent={true}><View style={styles.modal}><View style={styles.modalContent}>
        <Text style={{fontWeight:'bold'}}>Recharge via UPI</Text>
        <Image source={{ uri: `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=upi://pay?pa=${selectedUpi}&am=${depositAmount}` }} style={{width:150, height:150, alignSelf:'center', margin:10}} />
        <TextInput placeholder="Amount" value={depositAmount} onChangeText={setDepositAmount} style={styles.input} />
        <TextInput placeholder="UTR No" value={transactionId} onChangeText={setTransactionId} style={styles.input} />
        <TouchableOpacity style={styles.investBtn} onPress={() => {setDepositRequests([...depositRequests, {amount: depositAmount}]); setModalVisible(false);}}><Text style={styles.btnTxt}>Submit</Text></TouchableOpacity>
      </View></View></Modal>

      {/* Admin Panel */}
      <Modal visible={adminModalVisible} transparent={true}><View style={styles.modal}><View style={styles.modalContent}>
        {!adminAuth ? <>
            <TextInput placeholder="PIN (7412)" secureTextEntry onChangeText={setAdminPin} />
            <TouchableOpacity onPress={() => {if(adminPin==='7412') setAdminAuth(true)}}><Text>Login</Text></TouchableOpacity>
        </> : <Text>Recharge Requests: {depositRequests.length}</Text>}
        <TouchableOpacity onPress={() => {setAdminModalVisible(false); setAdminAuth(false)}}><Text style={{marginTop:10, color:'red'}}>Close</Text></TouchableOpacity>
      </View></View></Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {flex:1, backgroundColor:'#0a101d'},
  header: {padding:20, flexDirection:'row', justifyContent:'space-between'},
  logo: {color:'#f59e0b', fontWeight:'bold', fontSize:18},
  balanceCard: {backgroundColor:'#1e293b', padding:20, borderRadius:15, marginBottom:20},
  balText: {color:'#fff', fontSize:30, fontWeight:'bold', marginVertical:10},
  btnRow: {flexDirection:'row', gap:10},
  btnRecharge: {flex:1, backgroundColor:'#16a34a', padding:15, borderRadius:10, alignItems:'center'},
  btnWithdraw: {flex:1, backgroundColor:'#0284c7', padding:15, borderRadius:10, alignItems:'center'},
  btnTxt: {color:'#fff', fontWeight:'bold'},
  planCard: {backgroundColor:'#1e293b', padding:15, borderRadius:15, marginBottom:10},
  badge: {color:'#f59e0b', fontSize:10, fontWeight:'bold'},
  planName: {color:'#fff', fontSize:16, fontWeight:'bold', marginVertical:5},
  earning: {color:'#22c55e', fontSize:12, marginBottom:10},
  investBtn: {backgroundColor:'#3b82f6', padding:10, borderRadius:8, alignItems:'center'},
  modal: {flex:1, backgroundColor:'#0008', justifyContent:'center', padding:20},
  modalContent: {backgroundColor:'#fff', padding:20, borderRadius:15},
  input: {borderBottomWidth:1, marginBottom:10}
});
                     
