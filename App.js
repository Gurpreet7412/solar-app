import React, { useState } from 'react';
import { Text, View, ScrollView, TouchableOpacity, TextInput, Modal, Alert, SafeAreaView, StatusBar, Linking, Image, ImageBackground, Share } from 'react-native';

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
  
  // Owner Request Queues
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
    Linking.openURL(u).catch(() => Linking.openURL(generic).catch(() => Alert.alert('UPI Error', 'UPI app open nahi hui. Manual payment karein.')));
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

  // 1-Day 1-Time Collection Logic
  const handleClaimIncome = (plan) => {
    if (plan.lastCollected === todayStr) {
      return Alert.alert('Already Collected', 'Aapne aaj ki earning collect kar li hai. Kal dobara collect karein.');
    }
    setBalance(b => b + plan.daily);
    setMyActivePlans(myActivePlans.map(p => p.id === plan.id ? { ...p, lastCollected: todayStr } : p));
    setHistory([{ id: Date.now().toString(), type: `Income: ${plan.name}`, amount: `+₹${plan.daily}`, status: 'Credited', date: 'Today' }, ...history]);
    Alert.alert('Success', `₹${plan.daily} wallet me add ho gaye!`);
  };

  // User submits recharge -> goes to Admin
  const handleDepositSubmit = () => {
    if (!transactionId.trim() || transactionId.length < 6) return Alert.alert('Required', 'Valid 12-digit UTR enter karein.');
    const amt = Number(depositAmount) > 0 ? Number(depositAmount) : 500;
    const req = { id: Date.now().toString(), amount: amt, utr: transactionId, upi: selectedUpi, date: 'Today' };
    
    setDepositRequests([req, ...depositRequests]);
    setHistory([{ id: req.id, type: 'Recharge Request', amount: `+₹${amt}`, status: 'Pending Approval', date: 'Today' }, ...history]);
    Alert.alert('Request Sent', 'Recharge request submit ho gayi hai. Admin verify karke balance add karega.');
    setModalVisible(false);
    setTransactionId('');
  };

  // User submits withdraw -> goes to Admin
  const handleWithdrawSubmit = () => {
    if (!withdrawAmount || Number(withdrawAmount) < 200 || !withdrawUpi.trim() || Number(withdrawAmount) > balance) return Alert.alert('Error', 'Details check karein (Min ₹200).');
    const amt = Number(withdrawAmount);
    setBalance(b => b - amt);
    const req = { id: Date.now().toString(), amount: amt, upi: withdrawUpi, date: 'Today' };
    
    setWithdrawRequests([req, ...withdrawRequests]);
    setHistory([{ id: req.id, type: `Withdraw (${withdrawUpi})`, amount: `-₹${amt}`, status: 'Under Admin Review', date: 'Today' }, ...history]);
    Alert.alert('Request Sent', `₹${amt} withdrawal request submit ho gayi hai.`);
    setWithdrawModalVisible(false);
    setWithdrawAmount('');
  };

  // Admin Actions
  const handleApproveDeposit = (req) => {
    setBalance(b => b + req.amount);
    setDepositRequests(depositRequests.filter(d => d.id !== req.id));
    setHistory(history.map(h => h.id === req.id ? { ...h, status: 'Success (Approved)' } : h));
    Alert.alert('Approved', `₹${req.amount} recharge balance add kar diya gaya!`);
  };

  const handleRejectDeposit = (req) => {
    setDepositRequests(depositRequests.filter(d => d.id !== req.id));
    setHistory(history.map(h => h.id === req.id ? { ...h, status: 'Rejected' } : h));
    Alert.alert('Rejected', 'Recharge request reject ho gayi.');
  };

  const handleApproveWithdraw = (req) => {
    setWithdrawRequests(withdrawRequests.filter(w => w.id !== req.id));
    setHistory(history.map(h => h.id === req.id ? { ...h, status: 'Completed (Paid)' } : h));
    Alert.alert('Approved', `₹${req.amount} withdrawal complete marked!`);
  };

  const handleRejectWithdraw = (req) => {
    setBalance(b => b + req.amount);
    setWithdrawRequests(withdrawRequests.filter(w => w.id !== req.id));
    setHistory(history.map(h => h.id === req.id ? { ...h, status: 'Rejected (Refunded)' } : h));
    Alert.alert('Rejected', 'Withdrawal reject kar diya gaya aur balance refund ho gaya.');
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#0a101d' }}>
      <StatusBar barStyle="light-content" backgroundColor="#0a101d" />
      <ImageBackground source={{ uri: 'https://images.unsplash.com/photo-1509391365360-2e959784a276?q=80&w=1080&auto=format&fit=crop' }} style={{ flex: 1 }} resizeMode="cover">
        <View style={{ flex: 1, backgroundColor: 'rgba(10, 16, 29, 0.88)' }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 14, backgroundColor: 'rgba(14, 23, 38, 0.85)' }}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Image source={require('./icon.png')} style={{ width: 34, height: 34, borderRadius: 8, marginRight: 8 }} />
              <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#fff' }}>SOLAR <Text style={{ color: '#f59e0b' }}>INVEST</Text></Text>
            </View>
            <TouchableOpacity style={{ backgroundColor: '#0284c7', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 16 }} onPress={openSupport}>
              <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 12 }}>✈️ @Guri7412</Text>
            </TouchableOpacity>
          </View>

          <ScrollView contentContainerStyle={{ padding: 14, paddingBottom: 110 }}>
            {bottomNav === 'Invest' && (
              <>
                <View style={{ backgroundColor: 'rgba(27, 38, 59, 0.92)', borderRadius: 14, padding: 14, marginBottom: 10, borderWidth: 1, borderColor: '#2e3d5b' }}>
                  <Text style={{ color: '#94a3b8', fontSize: 11, fontWeight: '700' }}>TOTAL WALLET BALANCE</Text>
                  <Text style={{ fontSize: 32, fontWeight: 'bold', color: '#fff', marginVertical: 8 }}>₹{balance.toFixed(2)}</Text>
                  <View style={{ flexDirection: 'row', gap: 10 }}>
                    <TouchableOpacity style={{ flex: 1, backgroundColor: '#16a34a', borderRadius: 10, padding: 10, alignItems: 'center' }} onPress={() => setModalVisible(true)}><Text style={{ color: '#fff', fontWeight: 'bold' }}>⚡ + Recharge</Text></TouchableOpacity>
                    <TouchableOpacity style={{ flex: 1, backgroundColor: '#2e3d5b', borderRadius: 10, padding: 10, alignItems: 'center' }} onPress={() => setWithdrawModalVisible(true)}><Text style={{ color: '#fff', fontWeight: 'bold' }}>↗ Withdraw</Text></TouchableOpacity>
                  </View>
                </View>

                {myActivePlans.length > 0 && (
                  <View style={{ marginBottom: 10 }}>
                    <Text style={{ color: '#fff', fontSize: 14, fontWeight: 'bold', marginBottom: 6 }}>⚡ Running Investments ({myActivePlans.length})</Text>
                    {myActivePlans.map((ap) => {
                      const isCollected = ap.lastCollected === todayStr;
                      return (
                        <View key={ap.id} style={{ backgroundColor: 'rgba(22, 34, 53, 0.95)', borderRadius: 10, padding: 10, marginBottom: 6, borderWidth: 1, borderColor: isCollected ? '#334155' : '#22c55e', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                          <View>
                            <Text style={{ color: '#fff', fontWeight: 'bold' }}>{ap.name}</Text>
                            <Text style={{ color: '#94a3b8', fontSize: 11 }}>Daily: <Text style={{ color: '#22c55e', fontWeight: 'bold' }}>+₹{ap.daily}</Text></Text>
                          </View>
                          <TouchableOpacity 
                            style={{ backgroundColor: isCollected ? '#334155' : '#16a34a', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 8 }} 
                            onPress={() => handleClaimIncome(ap)}
                          >
                            <Text style={{ color: isCollected ? '#94a3b8' : '#fff', fontSize: 11, fontWeight: 'bold' }}>
                              {isCollected ? '✅ Done' : '💰 Collect'}
                            </Text>
                          </TouchableOpacity>
                        </View>
                      );
                    })}
                  </View>
                )}

                <View style={{ flexDirection: 'row', backgroundColor: 'rgba(22, 34, 53, 0.85)', borderRadius: 10, padding: 3, marginBottom: 10 }}>
                  {['All', 'Weekly', '15 Days', '30 Days'].map((t) => (
                    <TouchableOpacity key={t} style={{ flex: 1, paddingVertical: 6, alignItems: 'center', borderRadius: 8, backgroundColor: activeTab === t ? '#f59e0b' : 'transparent' }} onPress={() => setActiveTab(t)}>
                      <Text style={{ color: activeTab === t ? '#fff' : '#94a3b8', fontSize: 11, fontWeight: activeTab === t ? 'bold' : 'normal' }}>{t}</Text>
                    </TouchableOpacity>
                  ))}
                </View>

                {filtered.map((p) => (
                  <View key={p.id} style={{ backgroundColor: 'rgba(27, 38, 59, 0.92)', borderRadius: 14, padding: 14, marginBottom: 10, borderWidth: 1, borderColor: '#2e3d5b' }}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 }}><Text style={{ color: '#f59e0b', fontSize: 11, fontWeight: 'bold' }}>{p.badge}</Text><Text style={{ color: '#94a3b8', fontSize: 11 }}>⏱ {p.duration}</Text></View>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                      <View><Text style={{ color: '#fff', fontSize: 15, fontWeight: 'bold' }}>{p.name}</Text><Text style={{ color: '#94a3b8', fontSize: 12 }}>Daily: <Text style={{ color: '#22c55e', fontWeight: 'bold' }}>₹{p.daily}</Text></Text></View>
                      <TouchableOpacity style={{ backgroundColor: '#f59e0b', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 8 }} onPress={() => handleInvest(p)}><Text style={{ color: '#000', fontWeight: 'bold', fontSize: 12 }}>Invest ₹{p.price}</Text></TouchableOpacity>
                    </View>
                  </View>
                ))}
              </>
            )}

            {bottomNav === 'History' && (
              <View style={{ backgroundColor: 'rgba(27, 38, 59, 0.92)', borderRadius: 14, padding: 14 }}>
                <Text style={{ color: '#fff', fontSize: 14, fontWeight: 'bold', marginBottom: 6 }}>Transaction History</Text>
                {history.map((h) => (
                  <View key={h.id} style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: '#334155' }}>
                    <View><Text style={{ color: '#fff', fontSize: 13 }}>{h.type}</Text><Text style={{ color: '#64748b', fontSize: 10 }}>{h.date}</Text></View>
                    <View style={{ alignItems: 'flex-end' }}>
                      <Text style={{ fontSize: 13, fontWeight: 'bold', color: h.amount.includes('+') ? '#22c55e' : '#fff' }}>{h.amount}</Text>
                      <Text style={{ color: h.status.includes('Pending') || h.status.includes('Review') ? '#f59e0b' : '#94a3b8', fontSize: 10 }}>{h.status}</Text>
                    </View>
                  </View>
                ))}
              </View>
            )}

            {bottomNav === 'Invite' && (
              <View style={{ backgroundColor: 'rgba(27, 38, 59, 0.92)', borderRadius: 14, padding: 14 }}>
                <Text style={{ color: '#f59e0b', fontSize: 11, fontWeight: 'bold' }}>🎉 30% BONUS</Text>
                <Text style={{ color: '#fff', fontSize: 14, fontWeight: 'bold', marginVertical: 6 }}>Invite & Earn 30% Bonus</Text>
                <Text style={{ color: '#22c55e', fontWeight: 'bold', fontSize: 12, marginBottom: 10 }}>{refLink}</Text>
                <TouchableOpacity style={{ backgroundColor: '#16a34a', padding: 10, borderRadius: 10, alignItems: 'center', marginBottom: 8 }} onPress={() => Share.share({ message: `Join Solar Invest: ${refLink}` })}><Text style={{ color: '#fff', fontWeight: 'bold' }}>🚀 Share Invite Link</Text></TouchableOpacity>
                <TouchableOpacity style={{ backgroundColor: '#0284c7', padding: 10, borderRadius: 10, alignItems: 'center' }} onPress={openSupport}>
                  <Text style={{ color: '#fff', fontWeight: 'bold' }}>✈️ Support (@Guri7412)</Text>
                </TouchableOpacity>
              </View>
            )}

            {bottomNav === 'Profile' && (
              <View style={{ backgroundColor: 'rgba(27, 38, 59, 0.92)', borderRadius: 14, padding: 14 }}>
                <Text style={{ color: '#fff', fontSize: 14, fontWeight: 'bold', marginBottom: 8 }}>User Dashboard</Text>
                <Text style={{ color: '#e2e8f0', fontSize: 13, marginBottom: 6 }}>Total Balance: ₹{balance.toFixed(2)}</Text>
                <Text style={{ color: '#e2e8f0', fontSize: 13, marginBottom: 10 }}>Active Plans: {myActivePlans.length}</Text>
                
                {/* Admin Button */}
                <TouchableOpacity style={{ backgroundColor: '#f59e0b', padding: 12, borderRadius: 10, alignItems: 'center', marginBottom: 8 }} onPress={() => setAdminModalVisible(true)}>
                  <Text style={{ color: '#000', fontWeight: 'bold' }}>👑 Admin Panel (Pending: {depositRequests.length + withdrawRequests.length})</Text>
                </TouchableOpacity>

                <TouchableOpacity style={{ backgroundColor: '#0284c7', padding: 10, borderRadius: 10, alignItems: 'center' }} onPress={openSupport}>
                  <Text style={{ color: '#fff', fontWeight: 'bold' }}>✈️ 24/7 Support (@Guri7412)</Text>
                </TouchableOpacity>
              </View>
            )}
          </ScrollView>

          <View style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 70, backgroundColor: '#0c1322', flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', borderTopWidth: 1, borderTopColor: '#1e293b' }}>
            {[ { id: 'Invest', l: 'Invest', i: '⚡' }, { id: 'History', l: 'History', i: '📋' }, { id: 'Invite', l: 'Invite', i: '🎁' }, { id: 'Profile', l: 'Profile', i: '👤' } ].map((item) => (
              <TouchableOpacity key={item.id} style={{ alignItems: 'center', flex: 1 }} onPress={() => setBottomNav(item.id)}>
                <Text style={{ fontSize: 20, color: bottomNav === item.id ? '#f59e0b' : '#64748b' }}>{item.i}</Text>
                <Text style={{ fontSize: 11, color: bottomNav === item.id ? '#f59e0b' : '#94a3b8', fontWeight: 'bold' }}>{item.l}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ImageBackground>

      {/* Recharge Modal with Both UPI IDs & Live QR */}
      <Modal visible={modalVisible} transparent={true} animationType="fade">
        <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.85)', justifyContent: 'center', alignItems: 'center', padding: 16 }}>
          <View style={{ backgroundColor: '#fff', borderRadius: 18, padding: 16, width: '100%', maxWidth: 360 }}>
            <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#0f172a', marginBottom: 4 }}>Recharge & Scan QR</Text>
            
            <TextInput style={{ borderWidth: 1, borderColor: '#cbd5e1', borderRadius: 8, padding: 8, marginVertical: 4 }} placeholder="Amount (₹)" value={depositAmount} onChangeText={setDepositAmount} keyboardType="number-pad" />
            
            <Text style={{ fontSize: 11, color: '#64748b', marginTop: 4, fontWeight: '600' }}>Select UPI ID:</Text>
            <View style={{ flexDirection: 'row', gap: 6, marginVertical: 4 }}>
              <TouchableOpacity style={{ flex: 1, borderWidth: 1, borderColor: selectedUpi === 'deepsingh7412@ibl' ? '#16a34a' : '#cbd5e1', borderRadius: 6, padding: 6, backgroundColor: selectedUpi === 'deepsingh7412@ibl' ? '#f0fdf4' : '#fff' }} onPress={() => setSelectedUpi('deepsingh7412@ibl')}>
                <Text style={{ fontSize: 11, fontWeight: 'bold', color: '#0f172a' }}>1. deepsingh7412@ibl</Text>
              </TouchableOpacity>
              <TouchableOpacity style={{ flex: 1, borderWidth: 1, borderColor: selectedUpi === 'mandeep7412@axl' ? '#16a34a' : '#cbd5e1', borderRadius: 6, padding: 6, backgroundColor: selectedUpi === 'mandeep7412@axl' ? '#f0fdf4' : '#fff' }} onPress={() => setSelectedUpi('mandeep7412@axl')}>
                <Text style={{ fontSize: 11, fontWeight: 'bold', color: '#0f172a' }}>2. mandeep7412@axl</Text>
              </TouchableOpacity>
            </View>

            {/* Dynamic Auto-Updating QR Image with Selected UPI ID Display */}
            <View style={{ alignItems: 'center', marginVertical: 6, backgroundColor: '#f8fafc', padding: 8, borderRadius: 10, bor
