import React, { useState } from 'react';
import { Text, View, ScrollView, TouchableOpacity, TextInput, Modal, Alert, SafeAreaView, StatusBar, Linking, Image, Share, Platform } from 'react-native';

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
    { id: 1, badge: '⚡ Fast', duration: '7 Days', daysCount: 7, name: 'Solar Starter 7D', price: 150, daily: 30, category: 'Weekly' },
    { id: 2, badge: '⚡ Quick', duration: '7 Days', daysCount: 7, name: 'Solar Express 7D', price: 300, daily: 65, category: 'Weekly' },
    { id: 3, badge: '🔥 Hot', duration: '15 Days', daysCount: 15, name: 'Solar Micro 15D', price: 200, daily: 25, category: '15 Days' },
    { id: 4, badge: '⭐ Popular', duration: '15 Days', daysCount: 15, name: 'Solar Mini 15D', price: 400, daily: 55, category: '15 Days' },
    { id: 5, badge: '🚀 Boost', duration: '15 Days', daysCount: 15, name: 'Solar Boost 15D', price: 800, daily: 120, category: '15 Days' },
    { id: 6, badge: '🌱 Stable', duration: '30 Days', daysCount: 30, name: 'Solar Plant 30D', price: 1500, daily: 240, category: '30 Days' },
    { id: 7, badge: '👑 Mega', duration: '30 Days', daysCount: 30, name: 'Solar Farm Max', price: 3000, daily: 520, category: '30 Days' }
  ];

  const filtered = activeTab === 'All' ? plans : plans.filter(p => p.category === activeTab);
  const openSupport = () => Linking.openURL('https://t.me/Guri7412').catch(() => Alert.alert('Support', '@Guri7412'));

  const openUpi = (app) => {
    const amt = Number(depositAmount) > 0 ? depositAmount : '500';
    const generic = `upi://pay?pa=${selectedUpi}&pn=SolarInvest&am=${amt}&cu=INR`;
    const u = app === 'phonepe' ? `phonepe://pay?pa=${selectedUpi}&pn=SolarInvest&am=${amt}&cu=INR` : (app === 'paytm' ? `paytmmp://pay?pa=${selectedUpi}&pn=SolarInvest&am=${amt}&cu=INR` : generic);
    Linking.openURL(u).catch(() => Linking.openURL(generic).catch(() => Alert.alert('UPI Error', 'Manual payment karein.')));
  };

  const handleInvest = (p) => {
    if (balance < p.price) {
      return Alert.alert('Low Balance', `₹${p.price} recharge karein.`, [
        { text: 'Cancel' },
        { text: 'Recharge', onPress: () => { setDepositAmount(p.price.toString()); setModalVisible(true); } }
      ]);
    }
    setBalance(b => b - p.price);
    setMyActivePlans([{ id: Date.now().toString(), name: p.name, price: p.price, daily: p.daily, daysLeft: p.daysCount, lastCollected: '' }, ...myActivePlans]);
    setHistory([{ id: Date.now().toString(), type: `Invest: ${p.name}`, amount: `-₹${p.price}`, status: 'Running', date: 'Today' }, ...history]);
    Alert.alert('Success', `${p.name} activate ho gaya!`);
  };

  const handleClaimIncome = (plan) => {
    if (plan.lastCollected === todayStr) return Alert.alert('Already Collected', 'Aaj ki income le chuke hain.');
    setBalance(b => b + plan.daily);
    setMyActivePlans(myActivePlans.map(p => p.id === plan.id ? { ...p, lastCollected: todayStr } : p));
    setHistory([{ id: Date.now().toString(), type: `Income: ${plan.name}`, amount: `+₹${plan.daily}`, status: 'Credited', date: 'Today' }, ...history]);
    Alert.alert('Success', `₹${plan.daily} wallet me add ho gaye!`);
  };

  const handleDepositSubmit = () => {
    if (!transactionId.trim() || transactionId.length < 6) return Alert.alert('Required', '12-digit UTR enter karein.');
    const amt = Number(depositAmount) > 0 ? Number(depositAmount) : 500;
    const req = { id: Date.now().toString(), amount: amt, utr: transactionId, upi: selectedUpi, date: 'Today' };
    setDepositRequests([req, ...depositRequests]);
    setHistory([{ id: req.id, type: 'Recharge Request', amount: `+₹${amt}`, status: 'Pending Approval', date: 'Today' }, ...history]);
    Alert.alert('Request Sent', 'Recharge verify hone ke baad wallet me add hoga.');
    setModalVisible(false);
    setTransactionId('');
  };

  const handleWithdrawSubmit = () => {
    if (!withdrawAmount || Number(withdrawAmount) < 200 || !withdrawUpi.trim() || Number(withdrawAmount) > balance) return Alert.alert('Error', 'Check details (Min ₹200).');
    const amt = Number(withdrawAmount);
    setBalance(b => b - amt);
    const req = { id: Date.now().toString(), amount: amt, upi: withdrawUpi, date: 'Today' };
    setWithdrawRequests([req, ...withdrawRequests]);
    setHistory([{ id: req.id, type: `Withdraw (${withdrawUpi})`, amount: `-₹${amt}`, status: 'Under Admin Review', date: 'Today' }, ...history]);
    Alert.alert('Request Sent', `₹${amt} withdrawal submit ho gaya.`);
    setWithdrawModalVisible(false);
    setWithdrawAmount('');
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#0a101d' }}>
      <StatusBar barStyle="light-content" backgroundColor="#0a101d" />

      {/* Header */}
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, paddingTop: Platform.OS === 'android' ? 35 : 12, paddingBottom: 12, backgroundColor: '#0e1726', borderBottomWidth: 1, borderColor: '#1e293b' }}>
        <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#fff' }}>SOLAR <Text style={{ color: '#f59e0b' }}>INVEST</Text></Text>
        <TouchableOpacity style={{ backgroundColor: '#0284c7', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 16 }} onPress={openSupport}>
          <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 12 }}>✈️ @Guri7412</Text>
        </TouchableOpacity>
      </View>

      {/* Main Body */}
      <ScrollView contentContainerStyle={{ padding: 14, paddingBottom: 90 }}>
        {bottomNav === 'Invest' && (
          <>
            {/* Wallet Card */}
            <View style={{ backgroundColor: '#1e293b', borderRadius: 14, padding: 16, marginBottom: 12, borderWidth: 1, borderColor: '#334155' }}>
              <Text style={{ color: '#94a3b8', fontSize: 11, fontWeight: '700' }}>TOTAL WALLET BALANCE</Text>
              <Text style={{ fontSize: 32, fontWeight: 'bold', color: '#fff', marginVertical: 8 }}>₹{balance.toFixed(2)}</Text>
              <View style={{ flexDirection: 'row', gap: 10 }}>
                <TouchableOpacity style={{ flex: 1, backgroundColor: '#16a34a', borderRadius: 10, padding: 12, alignItems: 'center' }} onPress={() => setModalVisible(true)}>
                  <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 12 }}>⚡ + Recharge</Text>
                </TouchableOpacity>
                <TouchableOpacity style={{ flex: 1, backgroundColor: '#0284c7', borderRadius: 10, padding: 12, alignItems: 'center' }} onPress={() => setWithdrawModalVisible(true)}>
                  <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 12 }}>↗ Withdraw</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Active Investments */}
            {myActivePlans.length > 0 && (
              <View style={{ marginBottom: 12 }}>
                <Text style={{ color: '#fff', fontSize: 14, fontWeight: 'bold', marginBottom: 8 }}>⚡ Running Investments ({myActivePlans.length})</Text>
                {myActivePlans.map((ap) => {
                  const isCollected = ap.lastCollected === todayStr;
                  return (
                    <View key={ap.id} style={{ backgroundColor: '#162235', borderRadius: 10, padding: 10, marginBottom: 6, borderWidth: 1, borderColor: '#22c55e', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                      <View>
                        <Text style={{ color: '#fff', fontWeight: 'bold' }}>{ap.name}</Text>
                        <Text style={{ color: '#94a3b8', fontSize: 11 }}>Daily: <Text style={{ color: '#22c55e', fontWeight: 'bold' }}>+₹{ap.daily}</Text></Text>
                      </View>
                      <TouchableOpacity style={{ backgroundColor: isCollected ? '#334155' : '#16a34a', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8 }} onPress={() => handleClaimIncome(ap)}>
                        <Text style={{ color: isCollected ? '#94a3b8' : '#fff', fontSize: 11, fontWeight: 'bold' }}>{isCollected ? '✅ Done' : '💰 Collect'}</Text>
                      </TouchableOpacity>
                    </View>
                  );
                })}
              </View>
            )}

            {/* Category Filter */}
            <View style={{ flexDirection: 'row', backgroundColor: '#162235', borderRadius: 10, padding: 3, marginBottom: 10 }}>
              {['All', 'Weekly', '15 Days', '30 Days'].map((t) => (
                <TouchableOpacity key={t} style={{ flex: 1, paddingVertical: 6, alignItems: 'center', borderRadius: 8, backgroundColor: activeTab === t ? '#f59e0b' : 'transparent' }} onPress={() => setActiveTab(t)}>
                  <Text style={{ color: activeTab === t ? '#fff' : '#94a3b8', fontSize: 11, fontWeight: activeTab === t ? 'bold' : 'normal' }}>{t}</Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* 7 Plans */}
            {filtered.map((p) => (
              <View key={p.id} style={{ backgroundColor: '#1e293b', borderRadius: 14, padding: 14, marginBottom: 10, borderWidth: 1, borderColor: '#334155' }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 }}>
                  <Text style={{ color: '#f59e0b', fontSize: 11, fontWeight: 'bold' }}>{p.badge}</Text>
                  <Text style={{ color: '#94a3b8', fontSize: 11 }}>⏱ {p.duration}</Text>
                </View>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                  <View>
                    <Text style={{ color: '#fff', fontSize: 15, fontWeight: 'bold' }}>{p.name}</Text>
                    <Text style={{ color: '#94a3b8', fontSize: 12 }}>Daily: <Text style={{ color: '#22c55e', fontWeight: 'bold' }}>₹{p.daily}</Text></Text>
                  </View>
                  <TouchableOpacity style={{ backgroundColor: '#f59e0b', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 8 }} onPress={() => handleInvest(p)}>
                    <Text style={{ color: '#000', fontWeight: 'bold', fontSize: 12 }}>Invest ₹{p.price}</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </>
        )}

        {bottomNav === 'History' && (
          <View style={{ backgroundColor: '#1e293b', borderRadius: 14, padding: 14 }}>
            <Text style={{ color: '#fff', fontSize: 14, fontWeight: 'bold', marginBottom: 8 }}>Transaction History</Text>
            {history.map((h) => (
              <View key={h.id} style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: '#334155' }}>
                <View><Text style={{ color: '#fff', fontSize: 13 }}>{h.type}</Text><Text style={{ color: '#64748b', fontSize: 10 }}>{h.date}</Text></View>
                <Text style={{ fontSize: 13, fontWeight: 'bold', color: h.amount.includes('+') ? '#22c55e' : '#fff' }}>{h.amount}</Text>
              </View>
            ))}
          </View>
        )}

        {bottomNav === 'Invite' && (
          <View style={{ backgroundColor: '#1e293b', borderRadius: 14, padding: 14 }}>
            <Text style={{ color: '#f59e0b', fontSize: 12, fontWeight: 'bold' }}>🎉 30% BONUS</Text>
            <Text style={{ color: '#fff', fontSize: 15, fontWeight: 'bold', marginVertical: 6 }}>Invite Friends & Earn 30% Commission</Text>
            <View style={{ backgroundColor: '#0f172a', padding: 10, borderRadius: 8, borderWidth: 1, borderColor: '#334155', marginBottom: 10 }}>
              <Text style={{ color: '#22c55e', fontWeight: 'bold', fontSize: 12 }}>{refLink}</Text>
            </View>
            <TouchableOpacity style={{ backgroundColor: '#16a34a', padding: 12, borderRadius: 10, alignItems: 'center' }} onPress={() => Share.share({ message: `☀️ Join Solar Invest: ${refLink}` })}>
              <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 12 }}>🚀 Share Invite Link</Text>
            </TouchableOpacity>
          </View>
        )}

        {bottomNav === 'Profile' && (
          <View style={{ backgroundColor: '#1e293b', borderRadius: 14, padding: 14 }}>
            <Text style={{ color: '#fff', fontSize: 14, fontWeight: 'bold', marginBottom: 8 }}>User Dashboard</Text>
            <Text style={{ color: '#e2e8f0', fontSize: 13, marginBottom: 6 }}>Total Balance: ₹{balance.toFixed(2)}</Text>
            <Text style={{ color: '#e2e8f0', fontSize: 13, marginBottom: 12 }}>Active Plans: {myActivePlans.length}</Text>
            <TouchableOpacity style={{ backgroundColor: '#f59e0b', padding: 12, borderRadius: 10, alignItems: 'center', marginBottom: 8 }} onPress={() => setAdminModalVisible(true)}>
              <Text style={{ color: '#000', fontWeight: 'bold' }}>👑 Owner Panel ({depositRequests.length + withdrawRequests.length})</Text>
            </TouchableOpacity>
            <TouchableOpacity style={{ backgroundColor: '#0284c7', padding: 11, borderRadius: 10, alignItems: 'center' }} onPress={openSupport}>
              <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 12 }}>✈️ Official Support (@Guri7412)</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>

      {/* 4 Bottom Tabs */}
      <View style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 65, backgroundColor: '#0e1726', flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', borderTopWidth: 1, borderTopColor: '#1e293b' }}>
        {[ { id: 'Invest', l: 'Invest', i: '⚡' }, { id: 'History', l: 'History', i: '📋' }, { id: 'Invite', l: 'Invite', i: '🎁' }, { id: 'Profile', l: 'Profile', i: '👤' } ].map((item) => (
          <TouchableOpacity key={item.id} style={{ alignItems: 'center', flex: 1 }} onPress={() => setBottomNav(item.id)}>
            <Text style={{ fontSize: 18, color: bottomNav === item.id ? '#f59e0b' : '#64748b' }}>{item.i}</Text>
            <Text style={{ fontSize: 11, fontWeight: 'bold', marginTop: 2, color: bottomNav === item.id ? '#f59e0b' : '#94a3b8' }}>{item.l}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Recharge Modal */}
      <Modal visible={modalVisible} transparent={true} animationType="fade">
        <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.85)', justifyContent: 'center', alignItems: 'center', padding: 16 }}>
          <View style={{ backgroundColor: '#fff', borderRadius: 18, padding: 16, width: '100%', maxWidth: 350 }}>
            <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#0f172a', marginBottom: 6 }}>Recharge & Scan QR</Text>
            <TextInput style={{ borderWidth: 1, borderColor: '#cbd5e1', borderRadius: 8, padding: 8, marginVertical: 4 }} placeholder="Amount (₹)" value={depositAmount} onChangeText={setDepositAmount} keyboardType="number-pad" />
            <View style={{ flexDirection: 'row', gap: 6, marginVertical: 4 }}>
              <TouchableOpacity style={{ flex: 1, borderWidth: 1, borderColor: selectedUpi === 'deepsingh7412@ibl' ? '#16a34a' : '#cbd5e1', borderRadius: 6, padding: 6, backgroundColor: selectedUpi === 'deepsingh7412@ibl' ? '#f0fdf4' : '#fff' }} onPress={() => setSelectedUpi('deepsingh7412@ibl')}>
                <Text style={{ fontSize: 11, fontWeight: 'bold', color: '#0f172a' }}>1. deepsingh7412@ibl</Text>
              </TouchableOpacity>
              <TouchableOpacity style={{ flex: 1, borderWidth: 1, borderColor: selectedUpi === 'mandeep7412@axl' ? '#16a34a' : '#cbd5e1', borderRadius: 6, padding: 6, backgroundColor: selectedUpi === 'mandeep7412@axl' ? '#f0fdf4' : '#fff' }} onPress={() => setSelectedUpi('mandeep7412@axl')}>
                <Text style={{ fontSize: 11, fontWeight: 'bold', color: '#0f172a' }}>2. mandeep7412@axl</Text>
              </TouchableOpacity>
            </View>
            <View style={{ alignItems: 'center', marginVertical: 6, backgroundColor: '#f8fafc', padding: 8, borderRadius: 10, borderWidth: 1, borderColor: '#e2e8f0' }}>
              <Image source={{ uri: 'https://api.qrserver.com/v1/create-qr-code/?size=140x140&data=upi://pay?pa=' + selectedUpi + '%26pn=SolarInvest%26am=' + (depositAmount || '500') }} style={{ width: 130, height: 130, borderRadius: 6 }} />
              <Text style={{ fontSize: 11, color: '#0f172a', marginTop: 4, fontWeight: 'bold' }}>UPI: {selectedUpi}</Text>
            </View>
            <View style={{ flexDirection: 'row', gap: 6, marginBottom: 6 }}>
              <TouchableOpacity style={{ flex: 1, backgroundColor: '#5f259f', padding: 8, borderRadius: 8, alignItems: 'center' }} onPress={() => openUpi('phonepe')}><Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 12 }}>🟣 PhonePe</Text></TouchableOpacity>
              <TouchableOpacity style={{ flex: 1, backgroundColor: '#00baf2', padding: 8, borderRadius: 8, alignItems: 'center' }} onPress={() => openUpi('paytm')}><Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 12 }}>🔵 Paytm</Text></TouchableOpacity>
            </View>
            <TextInput style={{ borderWidth: 1, borderColor: '#cbd5e1', borderRadius: 8, padding: 8, marginVertical: 4 }} placeholder="Enter 12-digit UTR No." value={transactionId} onChangeText={setTransactionId} keyboardType="number-pad" />
            <TouchableOpacity style={{ backgroundColor: '#16a34a', borderRadius: 8, padding: 10, alignItems: 'center', marginTop: 6 }} onPress={handleDepositSubmit}><Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 12 }}>Submit Recharge</Text></TouchableOpacity>
            <TouchableOpacity style={{ alignItems: 'center', marginTop: 6 }} onPress={() => setModalVisible(false)}><Text style={{ color: '#ef4444', fontWeight: 'bold' }}>Cancel</Text></TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Withdraw Modal */}
      <Modal visible={withdrawModalVisible} transparent={true} animationType="fade">
        <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.85)', justifyContent: 'center', alignItems: 'center', padding: 20 }}>
          <View style={{ backgroundColor: '#fff', borderRadius: 18, padding: 18, width: '100%', maxWidth: 360 }}>
            <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#0f172a', marginBottom: 4 }}>Withdraw Balance</Text>
            <Text style={{ color: '#64748b', fontSize: 12, marginBottom: 6 }}>Available: ₹{balance.toFixed(2)}</Text>
            <TextInput style={{ borderWidth: 1, borderColor: '#cbd5e1', borderRadius: 8, padding: 8, marginVertical: 4 }} placeholder="Amount (Min ₹200)" value={withdrawAmount} onChangeText={setWithdrawAmount} keyboardType="number-pad" />
            <TextInput style={{ borderWidth: 1, borderColor: '#cbd5e1', borderRadius: 8, padding: 8, marginVertical: 4 }}
