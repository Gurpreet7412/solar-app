import React, { useState } from 'react';
import { Text, View, ScrollView, TouchableOpacity, TextInput, Modal, Alert, SafeAreaView, StatusBar, Linking, Image, Share, Platform, StyleSheet } from 'react-native';

export default function App() {
  const [balance, setBalance] = useState(1100.0);
  const [activeTab, setActiveTab] = useState('All');
  const [bottomNav, setBottomNav] = useState('Invest');
  const [modalVisible, setModalVisible] = useState(false);
  const [withdrawModalVisible, setWithdrawModalVisible] = useState(false);
  const [adminModalVisible, setAdminModalVisible] = useState(false);
  const [adminAuth, setAdminAuth] = useState(false);
  const [adminPin, setAdminPin] = useState('');
  const [depositAmount, setDepositAmount] = useState('500');
  const [selectedUpi, setSelectedUpi] = useState('deepsingh7412@ibl');
  const [transactionId, setTransactionId] = useState('');
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [withdrawUpi, setWithdrawUpi] = useState('');
  const [myActivePlans, setMyActivePlans] = useState([]);
  const [depositRequests, setDepositRequests] = useState([]);
  const [withdrawRequests, setWithdrawRequests] = useState([]);
  const [history, setHistory] = useState([{ id: '1', type: 'Welcome Bonus', amount: '₹1100.00', status: 'Completed', date: 'Initial' }]);

  const refLink = 'https://solarinvest.in/register?ref=Guri7412';
  const telegramLink = 'https://t.me/Guri7412';
  const todayStr = new Date().toDateString();

  const plans = [
    { id: 1, badge: '⚡ Fast', duration: '7 Days', name: 'Solar Starter 7D', price: 150, daily: 30, category: 'Weekly' },
    { id: 2, badge: '⚡ Quick', duration: '7 Days', name: 'Solar Express 7D', price: 300, daily: 65, category: 'Weekly' },
    { id: 3, badge: '🔥 Hot', duration: '15 Days', name: 'Solar Micro 15D', price: 200, daily: 25, category: '15 Days' },
    { id: 4, badge: '⭐ Popular', duration: '15 Days', name: 'Solar Mini 15D', price: 400, daily: 55, category: '15 Days' },
    { id: 5, badge: '🚀 Boost', duration: '15 Days', name: 'Solar Boost 15D', price: 800, daily: 120, category: '15 Days' },
    { id: 6, badge: '🌱 Stable', duration: '30 Days', name: 'Solar Plant 30D', price: 1500, daily: 240, category: '30 Days' },
    { id: 7, badge: '👑 Mega', duration: '30 Days', name: 'Solar Farm Max', price: 3000, daily: 520, category: '30 Days' }
  ];

  const filtered = activeTab === 'All' ? plans : plans.filter(p => p.category === activeTab);
  const openSupport = () => Linking.openURL(telegramLink).catch(() => Alert.alert('Support', 'Telegram link open nahi hua.'));

  const openUpi = (app) => {
    const amt = depositAmount || '500';
    const u = app === 'phonepe' ? `phonepe://pay?pa=${selectedUpi}&pn=SolarInvest&am=${amt}&cu=INR` : `paytmmp://pay?pa=${selectedUpi}&pn=SolarInvest&am=${amt}&cu=INR`;
    Linking.openURL(u).catch(() => Alert.alert('Error', 'App installed nahi hai.'));
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      {/* Header with Telegram Support */}
      <View style={styles.header}>
        <Text style={{color:'#fff', fontSize:18, fontWeight:'bold'}}>SOLAR <Text style={{color:'#f59e0b'}}>INVEST</Text></Text>
        <TouchableOpacity style={styles.suppBtn} onPress={openSupport}>
          <Text style={{color:'#fff', fontSize:12, fontWeight:'bold'}}>✈️ @Guri7412</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={{padding: 15, paddingBottom: 100}}>
        {bottomNav === 'Invest' && (
          <View>
            <View style={styles.balanceCard}>
                <Text style={{color:'#94a3b8', fontSize:11}}>TOTAL BALANCE</Text>
                <Text style={{color:'#fff', fontSize:32, fontWeight:'bold', marginVertical:8}}>₹{balance.toFixed(2)}</Text>
                <View style={{flexDirection:'row', gap:10}}>
                    <TouchableOpacity style={styles.btnGreen} onPress={() => setModalVisible(true)}><Text style={{color:'#fff'}}>⚡ + Recharge</Text></TouchableOpacity>
                    <TouchableOpacity style={styles.btnBlue} onPress={() => setWithdrawModalVisible(true)}><Text style={{color:'#fff'}}>↗ Withdraw</Text></TouchableOpacity>
                </View>
            </View>
            {filtered.map(p => (
              <View key={p.id} style={styles.planCard}>
                <Text style={{color:'#f59e0b', fontSize:12}}>{p.badge}</Text>
                <Text style={{color:'#fff', fontWeight:'bold', fontSize:15}}>{p.name}</Text>
                <TouchableOpacity style={styles.btnInv} onPress={() => Alert.alert('Invest', p.name + ' activate karein?') }><Text style={{color:'#000', fontWeight:'bold'}}>Invest ₹{p.price}</Text></TouchableOpacity>
              </View>
            ))}
          </View>
        )}
      </ScrollView>

      {/* Bottom Nav */}
      <View style={styles.navBar}>
        <TouchableOpacity style={styles.navItem} onPress={() => setBottomNav('Invest')}><Text style={{color:bottomNav==='Invest'?'#f59e0b':'#fff'}}>⚡ Invest</Text></TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={() => setBottomNav('History')}><Text style={{color:bottomNav==='History'?'#f59e0b':'#fff'}}>📋 History</Text></TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={() => setBottomNav('Invite')}><Text style={{color:bottomNav==='Invite'?'#f59e0b':'#fff'}}>🎁 Invite</Text></TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={() => setAdminModalVisible(true)}><Text style={{color:bottomNav==='Profile'?'#f59e0b':'#fff'}}>👤 Profile</Text></TouchableOpacity>
      </View>

      {/* Recharge Modal */}
      <Modal visible={modalVisible} transparent={true}><View style={styles.modal}><View style={styles.modalContent}>
        <Text style={{fontWeight:'bold'}}>Recharge Amount</Text>
        <TextInput style={styles.input} value={depositAmount} onChangeText={setDepositAmount} keyboardType="numeric"/>
        <TouchableOpacity style={styles.btnPP} onPress={() => openUpi('phonepe')}><Text style={{color:'#fff', textAlign:'center'}}>🟣 PhonePe</Text></TouchableOpacity>
        <TouchableOpacity style={styles.btnPT} onPress={() => openUpi('paytm')}><Text style={{color:'#fff', textAlign:'center'}}>🔵 Paytm</Text></TouchableOpacity>
        <TouchableOpacity onPress={() => setModalVisible(false)}><Text style={{color:'red', textAlign:'center', marginTop:10}}>Close</Text></TouchableOpacity>
      </View></View></Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {flex:1, backgroundColor:'#0a101d'},
  header: {padding:15, backgroundColor:'#0e1726', flexDirection:'row', justifyContent:'space-between', alignItems:'center'},
  suppBtn: {backgroundColor:'#0284c7', padding:8, borderRadius:10},
  balanceCard: {backgroundColor:'#1e293b', padding:20, borderRadius:15},
  btnGreen: {flex:1, backgroundColor:'#16a34a', padding:12, borderRadius:8, alignItems:'center'},
  btnBlue: {flex:1, backgroundColor:'#0284c7', padding:12, borderRadius:8, alignItems:'center'},
  planCard: {backgroundColor:'#1e293b', padding:15, marginTop:10, borderRadius:10},
  btnInv: {backgroundColor:'#f59e0b', padding:10, borderRadius:5, marginTop:10},
  navBar: {position:'absolute', bottom:0, width:'100%', flexDirection:'row', justifyContent:'space-around', padding:15, backgroundColor:'#0e1726', borderTopWidth:1, borderColor:'#334155'},
  navItem: {alignItems:'center'},
  modal: {flex:1, backgroundColor:'#0008', justifyContent:'center', padding:20},
  modalContent: {backgroundColor:'#fff', padding:20, borderRadius:15},
  input: {borderWidth:1, marginVertical:10, padding:10},
  btnPP: {backgroundColor:'#5f259f', padding:10, borderRadius:5, marginVertical:5},
  btnPT: {backgroundColor:'#00baf2', padding:10, borderRadius:5}
});
    
