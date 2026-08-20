import React, { useState } from 'react';
import { Text, View, ScrollView, TouchableOpacity, TextInput, Modal, Alert, SafeAreaView, StatusBar, Linking, Image, Share, StyleSheet, Platform } from 'react-native';

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
  const openSupport = () => Linking.openURL('https://t.me/Guri7412').catch(() => Alert.alert('Support', 'Telegram: @Guri7412'));

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
    if (plan.lastCollected === todayStr) {
      return Alert.alert('Already Collected', 'Aapne aaj ki earning collect kar li hai.');
    }
    setBalance(b => b + plan.daily);
    setMyActivePlans(myActivePlans.map(p => p.id === plan.id ? { ...p, lastCollected: todayStr } : p));
    setHistory([{ id: Date.now().toString(), type: `Income: ${plan.name}`, amount: `+₹${plan.daily}`, status: 'Credited', date: 'Today' }, ...history]);
    Alert.alert('Success', `₹${plan.daily} wallet me add ho gaye!`);
  };

  const handleDepositSubmit = () => {
    if (!transactionId.trim() || transactionId.length < 6) return Alert.alert('Required', 'Valid 12-digit UTR enter karein.');
    const amt = Number(depositAmount) > 0 ? Number(depositAmount) : 500;
    const req = { id: Date.now().toString(), amount: amt, utr: transactionId, upi: selectedUpi, date: 'Today' };
    
    setDepositRequests([req, ...depositRequests]);
    setHistory([{ id: req.id, type: 'Recharge Request', amount: `+₹${amt}`, status: 'Pending Approval', date: 'Today' }, ...history]);
    Alert.alert('Request Sent', 'Recharge verify hone ke baad add hoga.');
    setModalVisible(false);
    setTransactionId('');
  };

  const handleWithdrawSubmit = () => {
    if (!withdrawAmount || Number(withdrawAmount) < 200 || !withdrawUpi.trim() || Number(withdrawAmount) > balance) return Alert.alert('Error', 'Details check karein (Min ₹200).');
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
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0a101d" />

      <View style={styles.header}>
        <Text style={styles.logoText}>SOLAR <Text style={{ color: '#f59e0b' }}>INVEST</Text></Text>
        <TouchableOpacity style={styles.supportBtn} onPress={openSupport}>
          <Text style={styles.supportBtnText}>✈️ @Guri7412</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollArea} showsVerticalScrollIndicator={false}>
        {bottomNav === 'Invest' && (
          <>
            <View style={styles.walletCard}>
              <Text style={styles.walletLabel}>TOTAL WALLET BALANCE</Text>
              <Text style={styles.walletBalance}>₹{balance.toFixed(2)}</Text>
              <View style={styles.walletBtnRow}>
                <TouchableOpacity style={styles.rechargeBtn} onPress={() => setModalVisible(true)}>
                  <Text style={styles.btnTextWhite}>⚡ + Recharge</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.withdrawBtn} onPress={() => setWithdrawModalVisible(true)}>
                  <Text style={styles.btnTextWhite}>↗ Withdraw</Text>
                </TouchableOpacity>
              </View>
            </View>

            {myActivePlans.length > 0 && (
              <View style={{ marginBottom: 12 }}>
                <Text style={styles.sectionHeading}>⚡ Running Investments ({myActivePlans.length})</Text>
                {myActivePlans.map((ap) => {
                  const isCollected = ap.lastCollected === todayStr;
                  return (
                    <View key={ap.id} style={styles.activePlanCard}>
                      <View>
                        <Text style={{ color: '#fff', fontWeight: 'bold' }}>{ap.name}</Text>
                        <Text style={{ color: '#94a3b8', fontSize: 11 }}>Daily: <Text style={{ color: '#22c55e', fontWeight: 'bold' }}>+₹{ap.daily}</Text></Text>
                      </View>
                      <TouchableOpacity 
                        style={[styles.claimBtn, { backgroundColor: isCollected ? '#334155' : '#16a34a' }]} 
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

            <View style={styles.filterRow}>
              {['All', 'Weekly', '15 Days', '30 Days'].map((t) => (
                <TouchableOpacity 
                  key={t} 
                  style={[styles.filterTab, activeTab === t && styles.filterTabActive]} 
                  onPress={() => setActiveTab(t)}
                >
                  <Text style={[styles.filterTabText, activeTab === t && styles.filterTabTextActive]}>{t}</Text>
                </TouchableOpacity>
              ))}
            </View>

            {filtered.map((p) => (
              <View key={p.id} style={styles.planCard}>
                <View style={styles.planHeader}>
                  <Text style={styles.planBadge}>{p.badge}</Text>
                  <Text style={styles.planDuration}>⏱ {p.duration}</Text>
                </View>
                <View style={styles.planBody}>
                  <View>
                    <Text style={styles.planName}>{p.name}</Text>
                    <Text style={styles.planDaily}>Daily: <Text style={{ color: '#22c55e', fontWeight: 'bold' }}>₹{p.daily}</Text></Text>
                  </View>
                  <TouchableOpacity style={styles.investBtn} onPress={() => handleInvest(p)}>
                    <Text style={styles.investBtnText}>Invest ₹{p.price}</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </>
        )}

        {bottomNav === 'History' && (
          <View style={styles.cardContainer}>
            <Text style={styles.sectionHeading}>Transaction History</Text>
            {history.map((h) => (
              <View key={h.id} style={styles.historyRow}>
                <View><Text style={{ color: '#fff', fontSize: 13 }}>{h.type}</Text><Text style={{ color: '#64748b', fontSize: 10 }}>{h.date}</Text></View>
                <Text style={{ fontSize: 13, fontWeight: 'bold', color: h.amount.includes('+') ? '#22c55e' : '#fff' }}>{h.amount}</Text>
              </View>
            ))}
          </View>
        )}

        {bottomNav === 'Invite' && (
          <View style={styles.cardContainer}>
            <Text style={{ color: '#f59e0b', fontSize: 12, fontWeight: 'bold' }}>🎉 30% BONUS</Text>
            <Text style={{ color: '#fff', fontSize: 15, fontWeight: 'bold', marginVertical: 6 }}>Invite Friends & Earn 30% Commission</Text>
            <View style={styles.refBox}>
              <Text style={{ color: '#22c55e', fontWeight: 'bold', fontSize: 12 }}>{refLink}</Text>
            </View>
            <TouchableOpacity style={styles.shareBtn} onPress={() => Share.share({ message: `☀️ Join Solar Invest: ${refLink}` })}>
              <Text style={styles.btnTextWhite}>🚀 Share Invite Link</Text>
            </TouchableOpacity>
          </View>
        )}

        {bottomNav === 'Profile' && (
          <View style={styles.cardContainer}>
            <Text style={styles.sectionHeading}>User Dashboard</Text>
            <Text style={{ color: '#e2e8f0', fontSize: 13, marginBottom: 6 }}>Total Balance: ₹{balance.toFixed(2)}</Text>
            <Text style={{ color: '#e2e8f0', fontSize: 13, marginBottom: 12 }}>Active Plans: {myActivePlans.length}</Text>
            
            <TouchableOpacity style={styles.adminEntryBtn} onPress={() => setAdminModalVisible(true)}>
              <Text style={{ color: '#000', fontWeight: 'bold' }}>👑 Owner Panel ({depositRequests.length + withdrawRequests.length})</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.supportBigBtn} onPress={openSupport}>
              <Text style={styles.btnTextWhite}>✈️ Official Support (@Guri7412)</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>

      <View style={styles.bottomNavContainer}>
        {[ { id: 'Invest', l: 'Invest', i: '⚡' }, { id: 'History', l: 'History', i: '📋' }, { id: 'Invite', l: 'Invite', i: '🎁' }, { id: 'Profile', l: 'Profile', i: '👤' } ].map((item) => (
          <TouchableOpacity key={item.id} style={styles.bottomTabItem} onPress={() => setBottomNav(item.id)}>
            <Text style={{ fontSize: 18, color: bottomNav === item.id ? '#f59e0b' : '#64748b' }}>{item.i}</Text>
            <Text style={[styles.bottomTabLabel, { color: bottomNav === item.id ? '#f59e0b' : '#94a3b8' }]}>{item.l}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <Modal visible={modalVisible} transparent={true} animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <Text style={styles.modalTitle}>Recharge & Scan QR</Text>
            <TextInput style={styles.inputField} placeholder="Amount (₹)" value={depositAmount} onChangeText={setDepositAmount} keyboardType="number-pad" />
            
            <View style={{ flexDirection: 'row', gap: 6, marginVertical: 4 }}>
              <TouchableOpacity style={[styles.upiSelectBtn, selectedUpi === 'deepsingh7412@ibl' && styles.upiSelected]} onPress={() => setSelectedUpi('deepsingh7412@ibl')}>
                <Text style={styles.upiSelectText}>1. deepsingh7412@ibl</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.upiSelectBtn, selectedUpi === 'mandeep7412@axl' && styles.upiSelected]} onPress={() => setSelectedUpi('mandeep7412@axl')}>
                <Text style={styles.upiSelectText}>2. mandeep7412@axl</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.qrContainer}>
              <Image source={{ uri: 'https://api.qrserver.com/v1/create-qr-code/?size=140x140&data=upi://pay?pa=' + selectedUpi + '%26pn=SolarInvest%26am=' + (depositAmount || '500') }} style={{ width: 130, height: 130, borderRadius: 6 }} />
              <Text style={{ fontSize: 11, color: '#0f172a', marginTop: 4, fontWeight: 'bold' }}>UPI: {selectedUpi}</Text>
            </View>

            <View style={{ flexDirection: 'row', gap: 6, marginBottom: 6 }}>
              <TouchableOpacity style={styles.phonepeBtn} onPress={() => openUpi('phonepe')}><Text style={styles.btnTextWhite}>🟣 PhonePe</Text></TouchableOpacity>
              <TouchableOpacity style={styles.paytmBtn} onPress={() => openUpi('paytm')}><Text style={styles.btnTextWhite}>🔵 Paytm</Text></TouchableOpacity>
            </View>

            <TextInput style={styles.inputField} placeholder="Enter 12-digit UTR No." value={transactionId} onChangeText={setTransactionId} keyboardType="number-pad" />
            <TouchableOpacity style={styles.submitBtn} onPress={handleDepositSubmit}><Text style={styles.btnTextWhite}>Submit Recharge</Text></TouchableOpacity>
            <TouchableOpacity style={{ alignItems: 'center', marginTop: 6 }} onPress={() => setModalVisible(false)}><Text style={{ color: '#ef4444', fontWeight: 'bold' }}>Cancel</Text></TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Modal visible={withdrawModalVisible} transparent={true} animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <Text style={styles.modalTitle}>Withdraw Balance</Text>
            <Text style={{ color: '#64748b', fontSize: 12, marginBottom: 6 }}>Available: ₹{balance.toFixed(2)}</Text>
            <TextInput style={styles.inputField} placeholder="Amount (Min ₹200)" value={withdrawAmount} onChangeText={setWithdrawAmount} keyboardType="number-pad" />
            <TextInput style={styles.inputField} placeholder="Your UPI ID" value={withdrawUpi} onChangeText={setWithdrawUpi} />
            <TouchableOpacity style={styles.submitBtn} onPress={handleWithdrawSubmit}><Text style={styles.btnTextWhite}>Submit Withdrawal</Text></TouchableOpacity>
            <TouchableOpacity style={{ alignItems: 'center', marginTop: 8 }} onPress={() => setWithdrawModalVisible(false)}><Text style={{ color: '#ef4444', fontWeight: 'bold' }}>Cancel</Text></TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Modal visible={adminModalVisible} transparent={true} animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.adminModalBox}>
            <Text style={styles.adminTitle}>👑 Owner Panel</Text>
            {!adminAuth ? (
              <View>
                <Text style={{ color: '#94a3b8', fontSize: 13, marginBottom: 6 }}>PIN (7412):</Text>
                <TextInput style={styles.adminInput} placeholder="PIN" placeholderTextColor="#64748b" secureTextEntry value={adminPin} onChangeText={setAdminPin} keyboardType="number-pad" />
                <TouchableOpacity style={styles.submitBtn} onPress={() => { if (adminPin === '7412') { setAdminAuth(true); setAdminPin(''); } else { Alert.alert('Wrong PIN', 'Galat PIN'); } }}><Text style={styles.btnTextWhite}>Login</Text></TouchableOpacity>
              </View>
            ) : (
              <ScrollView showsVerticalScrollIndicator={false}>
                <Text style={styles.adminSubheading}>⚡ Recharges ({depositRequests.length})</Text>
                {depositRequests.map(d => (
                  <View key={d.id} style={styles.reqCard}>
                    <Text style={{ color: '#22c55e', fontWeight: 'bold' }}>₹{d.amount} | UTR: {d.utr}</Text>
                    <View style={{ flexDirection: 'row', gap: 8, marginTop: 6 }}>
                      <TouchableOpacity style={[styles.actionBtn, { backgroundColor: '#16a34a' }]} onPress={() => { setBalance(b => b + d.amount); setDepositRequests(depositRequests.filter(x => x.id !== d.id)); Alert.alert('Approved', `₹${d.amount} added!`); }}><Text style={styles.btnTextWhite}>Approve</Text></TouchableOpacity>
                      <TouchableOpacity style={[styles.actionBtn, { backgroundColor: '#ef4444' }]} onPress={() => { setDepositRequests(depositRequests.filter(x => x.id !== d.id)); }}><Text style={styles.btnTextWhite}>Reject</Text></TouchableOpacity>
                    </View>
                  </View>
                ))}
              </ScrollView>
            )}
            <TouchableOpacity style={{ alignItems: 'center', marginTop: 12 }} onPress={() => { setAdminModalVisible(false); setAdminAuth(false); }}><Text style={{ color: '#94a3b8', fontWeight: 'bold' }}>Close</Text></TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0a101d' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, paddingTop: Platform.OS === 'android' ? 35 : 12, paddingBottom: 12, backgroundColor: '#0e1726', borderBottomWidth: 1, borderColor: '#1e293b' },
  logoText: { fontSize: 18, fontWeight: 'bold', color: '#fff' },
  supportBtn: { backgroundColor: '#0284c7', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 16 },
  supportBtnText: { color: '#fff', fontWeight: 'bold', fontSize: 12 },
  scrollArea: { padding: 14, paddingBottom: 90 },
  walletCard: { backgroundColor: '#1e293b', borderRadius: 14, padding: 16, marginBottom: 12, borderWidth: 1, borderColor: '#334155' },
  walletLabel: { color: '#94a3b8', fontSize: 11, fontWeight: '700' },
  walletBalance: { fontSize: 32, fontWeight: 'bold', color: '#fff', marginVertical: 8 },
  walletBtnRow: { flexDirection: 'row', gap: 10 },
  rechargeBtn: { flex: 1, backgroundColor: '#16a34a', borderRadius: 10, padding: 12, alignItems: 'center' },
  withdrawBtn: { flex: 1, backgroundColor: '#0284c7', borderRadius: 10, padding: 12, alignItems: 'center' },
  btnTextWhite: { color: '#fff', fontWeight: 'bo
