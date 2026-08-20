import React, { useState } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, TextInput, Modal, Alert, SafeAreaView, StatusBar, Linking, Image, ImageBackground, Share, Platform } from 'react-native';

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
  const todayStr = new Date().toDateString();

  const plans = [
    { id: 1, badge: '⚡ Fast', duration: '7 Days', name: 'Solar Starter 7D', price: 150, daily: 30, category: 'Weekly' },
    { id: 2, badge: '⚡ Quick', duration: '7 Days', name: 'Solar Express 7D', price: 300, daily: 65, category: 'Weekly' },
    { id: 3, badge: '🔥 Hot', duration: '15 Days', name: 'Solar Micro 15D', price: 200, daily: 25, category: '15 Days' },
    { id: 4, badge: '⭐ Popular', duration: '15 Days', name: 'Solar Mini 15D', price: 400, daily: 55, category: '15 Days' }
  ];

  const handleClaim = (plan) => {
    if (plan.lastCollected === todayStr) return Alert.alert('Done', 'Aaj ki income collect kar li hai.');
    setBalance(b => b + plan.daily);
    setMyActivePlans(myActivePlans.map(p => p.id === plan.id ? { ...p, lastCollected: todayStr } : p));
    Alert.alert('Success', '₹' + plan.daily + ' added!');
  };

  const submitDeposit = () => {
    setDepositRequests([{ id: Date.now(), amount: depositAmount, utr: transactionId }, ...depositRequests]);
    Alert.alert('Submitted', 'Verification ke liye pending hai.');
    setModalVisible(false);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#0a101d' }}>
      <ImageBackground source={{ uri: 'https://images.unsplash.com/photo-1509391365360-2e959784a276?q=80&w=1080' }} style={{ flex: 1 }}>
        <View style={{ flex: 1, backgroundColor: 'rgba(10, 16, 29, 0.9)' }}>
          <View style={{ padding: 20, paddingTop: 40 }}>
            <Text style={{ color: '#94a3b8', fontSize: 12 }}>TOTAL BALANCE</Text>
            <Text style={{ color: '#fff', fontSize: 32, fontWeight: 'bold' }}>₹{balance.toFixed(2)}</Text>
            <View style={{ flexDirection: 'row', gap: 10, marginTop: 10 }}>
              <TouchableOpacity style={{ flex: 1, backgroundColor: '#16a34a', padding: 15, borderRadius: 10, alignItems: 'center' }} onPress={() => setModalVisible(true)}><Text style={{ color: '#fff', fontWeight: 'bold' }}>Recharge</Text></TouchableOpacity>
              <TouchableOpacity style={{ flex: 1, backgroundColor: '#0284c7', padding: 15, borderRadius: 10, alignItems: 'center' }} onPress={() => setWithdrawModalVisible(true)}><Text style={{ color: '#fff', fontWeight: 'bold' }}>Withdraw</Text></TouchableOpacity>
            </View>
            <TouchableOpacity onPress={() => setAdminModalVisible(true)}><Text style={{ color: '#f59e0b', marginTop: 10, textAlign: 'center' }}>Admin Panel</Text></TouchableOpacity>
          </View>

          <ScrollView style={{ paddingHorizontal: 20 }}>
            {myActivePlans.map(ap => (
              <View key={ap.id} style={{ backgroundColor: '#1e293b', padding: 15, borderRadius: 10, marginBottom: 10, flexDirection: 'row', justifyContent: 'space-between' }}>
                <Text style={{ color: '#fff' }}>{ap.name}</Text>
                <TouchableOpacity onPress={() => collectIncome(ap)}><Text style={{ color: ap.lastCollected === todayStr ? 'gray' : '#22c55e' }}>{ap.lastCollected === todayStr ? 'Collected' : 'Collect'}</Text></TouchableOpacity>
              </View>
            ))}
          </ScrollView>
        </View>
      </ImageBackground>

      {/* Recharge Modal WITH QR */}
      <Modal visible={modalVisible} transparent={true}>
        <View style={{ flex: 1, backgroundColor: '#0008', justifyContent: 'center', padding: 20 }}>
          <View style={{ backgroundColor: '#fff', padding: 20, borderRadius: 15 }}>
            <Text style={{ fontWeight: 'bold', fontSize: 18 }}>Recharge</Text>
            <TextInput placeholder="Amount" value={depositAmount} onChangeText={setDepositAmount} style={{ borderBottomWidth: 1, marginVertical: 10 }} />
            <View style={{ alignItems: 'center', margin: 10 }}>
               <Image source={{ uri: `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=upi://pay?pa=${selectedUpi}&pn=SolarInvest&am=${depositAmount}` }} style={{ width: 150, height: 150 }} />
               <Text>Scan to pay {selectedUpi}</Text>
            </View>
            <TextInput placeholder="UTR No" value={transactionId} onChangeText={setTransactionId} style={{ borderBottomWidth: 1, marginVertical: 10 }} />
            <TouchableOpacity style={{ backgroundColor: '#16a34a', padding: 10, alignItems: 'center' }} onPress={submitDeposit}><Text style={{ color: '#fff' }}>Submit</Text></TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Admin Panel Modal */}
      <Modal visible={adminModalVisible} transparent={true}>
        <View style={{ flex: 1, backgroundColor: '#0009', padding: 20, justifyContent: 'center' }}>
          {!adminAuth ? (
             <View style={{ backgroundColor: '#fff', padding: 20, borderRadius: 10 }}>
               <TextInput placeholder="Admin PIN (7412)" secureTextEntry onChangeText={setAdminPin} />
               <TouchableOpacity onPress={() => { if (adminPin === '7412') setAdminAuth(true); }}><Text>Login</Text></TouchableOpacity>
             </View>
          ) : (
             <View style={{ backgroundColor: '#fff', padding: 20, borderRadius: 10 }}>
               <Text>Pending Recharges: {depositRequests.length}</Text>
               <TouchableOpacity onPress={() => setAdminModalVisible(false)}><Text>Close</Text></TouchableOpacity>
             </View>
          )}
        </View>
      </Modal>
    </SafeAreaView>
  );
}
