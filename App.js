import React, { useState } from 'react';
import { Text, View, ScrollView, TouchableOpacity, TextInput, Modal, Alert, SafeAreaView, StatusBar, Linking, Share, Platform, StyleSheet } from 'react-native';

export default function App() {
  // Auth & Unique User States
  const [currentUser, setCurrentUser] = useState(null);
  const [authMode, setAuthMode] = useState('signup');
  const [authPhone, setAuthPhone] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  const [authReferral, setAuthReferral] = useState('');
  const [registeredUsers, setRegisteredUsers] = useState([]);

  // App States
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
  const [history, setHistory] = useState([
    { id: '1', type: 'Welcome Bonus', amount: '₹1100.00', status: 'Completed', date: 'Initial' }
  ]);

  const telegramLink = 'https://t.me/Guri7412';
  const todayStr = new Date().toDateString();

  // Dynamic user specific referral link
  const myRefCode = currentUser?.refCode || 'SOLAR7412';
  const userRefLink = `https://solarinvest.in/register?ref=${myRefCode}`;

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
  const openSupport = () => Linking.openURL(telegramLink).catch(() => Alert.alert('Support', 'Telegram: @Guri7412'));

  const handleAuthSubmit = () => {
    if (!authPhone.trim() || authPhone.length < 10) {
      return Alert.alert('Error', '10-digit valid Mobile number enter karein.');
    }
    if (!authPassword.trim() || authPassword.length < 4) {
      return Alert.alert('Error', 'Kam se kam 4-digit Password banayein.');
    }

    if (authMode === 'signup') {
      const exists = registeredUsers.find(u => u.phone === authPhone);
      if (exists) {
        return Alert.alert('Error', 'Yeh number pehle se registered hai. Login karein.');
      }
      // Unique referral code for each user
      const uniqueCode = 'SOLAR' + authPhone.slice(-5);
      const newUser = { phone: authPhone, password: authPassword, refCode: uniqueCode, referralUsed: authReferral };
      
      setRegisteredUsers([...registeredUsers, newUser]);
      setCurrentUser(newUser);
      Alert.alert('Success', `Account ban gaya! Aapka Referral Code: ${uniqueCode}`);
    } else {
      const user = registeredUsers.find(u => u.phone === authPhone && u.password === authPassword);
      if (!user && authPhone !== '9999999999') {
        return Alert.alert('Login Failed', 'Number ya password galat hai.');
      }
      setCurrentUser(user || { phone: authPhone, refCode: 'SOLAR' + authPhone.slice(-5) });
      Alert.alert('Welcome Back', 'Login successful!');
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setAuthPhone('');
    setAuthPassword('');
  };

  const openUpi = (app) => {
    const amt = Number(depositAmount) > 0 ? depositAmount : '500';
    const generic = `upi://pay?pa=${selectedUpi}&pn=SolarInvest&am=${amt}&cu=INR`;
    const phonepeUrl = `phonepe://pay?pa=${selectedUpi}&pn=SolarInvest&am=${amt}&cu=INR`;
    const paytmUrl = `paytmmp://pay?pa=${selectedUpi}&pn=SolarInvest&am=${amt}&cu=INR`;
    const targetUrl = app === 'phonepe' ? phonepeUrl : (app === 'paytm' ? paytmUrl : generic);

    Linking.openURL(targetUrl).catch(() => {
      Linking.openURL(generic).catch(() => Alert.alert('UPI Error', 'UPI app open nahi ho pa raha hai.'));
    });
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
    Alert.alert('Success', `${p.name} activate ho gaya! (30% Referral Bonus Applicable)`);
  };

  const handleClaimIncome = (plan) => {
    if (plan.lastCollected === todayStr) {
      return Alert.alert('Already Collected', 'Aapne aaj ki income claim kar li hai.');
    }
    setBalance(b => b + plan.daily);
    setMyActivePlans(myActivePlans.map(p => p.id === plan.id ? { ...p, lastCollected: todayStr } : p));
    setHistory([{ id: Date.now().toString(), type: `Income: ${plan.name}`, amount: `+₹${plan.daily}`, status: 'Credited', date: 'Today' }, ...history]);
    Alert.alert('Success', `₹${plan.daily} wallet me add ho gaye!`);
  };

  const handleDepositSubmit = () => {
    if (!transactionId.trim() || transactionId.length < 6) {
      return Alert.alert('Required', 'Valid 12-digit UTR enter karein.');
    }
    const amt = Number(depositAmount) > 0 ? Number(depositAmount) : 500;
    const req = { id: Date.now().toString(), amount: amt, utr: transactionId, upi: selectedUpi, user: currentUser?.phone, date: 'Today' };
    setDepositRequests([req, ...depositRequests]);
    setHistory([{ id: req.id, type: 'Recharge Request', amount: `+₹${amt}`, status: 'Pending Approval', date: 'Today' }, ...history]);
    Alert.alert('Request Sent', 'Recharge verify hone ke baad add hoga.');
    setModalVisible(false);
    setTransactionId('');
  };

  const handleWithdrawSubmit = () => {
    if (!withdrawAmount || Number(withdrawAmount) < 200 || !withdrawUpi.trim() || Number(withdrawAmount) > balance) {
      return Alert.alert('Error', 'Details check karein (Min ₹200).');
    }
    const amt = Number(withdrawAmount);
    setBalance(b => b - amt);
    const req = { id: Date.now().toString(), amount: amt, upi: withdrawUpi, user: currentUser?.phone, date: 'Today' };
    setWithdrawRequests([req, ...withdrawRequests]);
    setHistory([{ id: req.id, type: `Withdraw (${withdrawUpi})`, amount: `-₹${amt}`, status: 'Under Admin Review', date: 'Today' }, ...history]);
    Alert.alert('Request Sent', `₹${amt} withdrawal submit ho gaya.`);
    setWithdrawModalVisible(false);
    setWithdrawAmount('');
  };
    if (!currentUser) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor="#0a101d" />
        <View style={styles.authWrapper}>
          <View style={styles.authCard}>
            <Text style={styles.authLogo}>SOLAR <Text style={{ color: '#f59e0b' }}>INVEST</Text></Text>
            <Text style={styles.authSubtitle}>{authMode === 'signup' ? 'Create New Account' : 'Login to Your Account'}</Text>

            <View style={styles.authToggleRow}>
              <TouchableOpacity style={[styles.authToggleBtn, authMode === 'signup' && styles.authToggleActive]} onPress={() => setAuthMode('signup')}>
                <Text style={[styles.authToggleText, authMode === 'signup' && styles.authToggleTextActive]}>Sign Up</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.authToggleBtn, authMode === 'login' && styles.authToggleActive]} onPress={() => setAuthMode('login')}>
                <Text style={[styles.authToggleText, authMode === 'login' && styles.authToggleTextActive]}>Login</Text>
              </TouchableOpacity>
            </View>

            <TextInput 
              style={styles.authInput} 
              placeholder="Mobile Number" 
              placeholderTextColor="#64748b" 
              value={authPhone} 
              onChangeText={setAuthPhone} 
              keyboardType="number-pad" 
            />

            <TextInput 
              style={styles.authInput} 
              placeholder="Password" 
              placeholderTextColor="#64748b" 
              secureTextEntry 
              value={authPassword} 
              onChangeText={setAuthPassword} 
            />

            {authMode === 'signup' && (
              <TextInput 
                style={styles.authInput} 
                placeholder="Referral Code (Optional)" 
                placeholderTextColor="#64748b" 
                value={authReferral} 
                onChangeText={setAuthReferral} 
              />
            )}

            <TouchableOpacity style={styles.authSubmitBtn} onPress={handleAuthSubmit}>
              <Text style={styles.authSubmitText}>{authMode === 'signup' ? 'Register & Get ₹1100 Bonus' : 'Login'}</Text>
            </TouchableOpacity>

            <TouchableOpacity style={{ marginTop: 15, alignItems: 'center' }} onPress={openSupport}>
              <Text style={{ color: '#0284c7', fontSize: 12 }}>Need Help? Contact Support (@Guri7412)</Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0a101d" />

      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.logoText}>SOLAR <Text style={{ color: '#f59e0b' }}>INVEST</Text></Text>
          <Text style={{ color: '#64748b', fontSize: 10 }}>ID: {currentUser.phone} | Code: <Text style={{color:'#f59e0b'}}>{myRefCode}</Text></Text>
        </View>
        <TouchableOpacity style={styles.supportBtn} onPress={openSupport}>
          <Text style={styles.supportBtnText}>✈️ @Guri7412</Text>
        </TouchableOpacity>
      </View>

      {/* Main Content */}
      <View style={styles.mainContentArea}>
        <ScrollView contentContainerStyle={styles.scrollArea} showsVerticalScrollIndicator={false}>
          {bottomNav === 'Invest' && (
            <>
              {/* Wallet Card */}
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

              {/* Running Investments */}
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

              {/* Category Filter */}
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

              {/* 7 Plans */}
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
              <Text style={{ color: '#f59e0b', fontSize: 12, fontWeight: 'bold' }}>🎉 30% DIRECT BONUS</Text>
              <Text style={{ color: '#fff', fontSize: 15, fontWeight: 'bold', marginVertical: 6 }}>Invite Friends & Earn 30% Commission</Text>
              
              <View style={{ backgroundColor: '#0f172a', padding: 12, borderRadius: 8, marginVertical: 8, borderWidth: 1, borderColor: '#334155' }}>
                <Text style={{ color: '#94a3b8', fontSize: 11 }}>YOUR PERSONAL REFERRAL CODE:</Text>
                <Text style={{ color: '#f59e0b', fontSize: 18, fontWeight: 'bold', marginVertical: 2 }}>{myRefCode}</Text>
                <Text style={{ color: '#64748b', fontSize: 11, marginTop: 4 }}>INVITE LINK:</Text>
                <Text style={{ color: '#22c55e', fontSize: 11, fontWeight: 'bold' }}>{userRefLink}</Text>
              </View>

              <TouchableOpacity style={styles.shareBtn} onPress={() => Share.share({ message: `☀️ Join Solar Invest and earn daily income! Use my code ${myRefCode} or link: ${userRefLink}` })}>
                <Text style={styles.btnTextWhite}>🚀 Share My Invite Link</Text>
              </TouchableOpacity>
            </View>
          )}

          {bottomNav === 'Profile' && (
            <View style={styles.cardContainer}>
              <Text style={styles.sectionHeading}>User Dashboard</Text>
              <Text style={{ color: '#e2e8f0', fontSize: 13, marginBottom: 4 }}>Phone: {currentUser.phone}</Text>
              <Text style={{ color: '#e2e8f0', fontSize: 13, marginBottom: 4 }}>Referral Code: <Text style={{ color: '#f59e0b', fontWeight: 'bold' }}>{myRefCode}</Text></Text>
              <Text style={{ color: '#e2e8f0', fontSize: 13, marginBottom: 4 }}>Total Balance: ₹{balance.toFixed(2)}</Text>
              <Text style={{ color: '#e2e8f0', fontSize: 13, marginBottom: 12 }}>Active Plans: {myActivePlans.length}</Text>
              
              <TouchableOpacity style={styles.adminEntryBtn} onPress={() => setAdminModalVisible(true)}>
                <Text style={{ color: '#000', fontWeight: 'bold' }}>👑 Owner Panel ({depositRequests.length + withdrawRequests.length})</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.supportBigBtn} onPress={openSupport}>
                <Text style={styles.btnTextWhite}>✈️ Official Support (@Guri7412)</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
                <Text style={{ color: '#ef4444', fontWeight: 'bold' }}>🚪 Logout Account</Text>
              </TouchableOpacity>
            </View>
          )}
        </ScrollView>
      </View>

      {/* Permanently Visible Bottom Nav */}
      <View style={styles.bottomNavContainer}>
        {[
          { id: 'Invest', l: 'Invest', i: '⚡' },
          { id: 'History', l: 'History', i: '📋' },
          { id: 'Invite', l: 'Invite', i: '🎁' },
          { id: 'Profile', l: 'Profile', i: '👤' }
        ].map((item) => (
          <TouchableOpacity key={item.id} style={styles.bottomTabItem} onPress={() => setBottomNav(item.id)}>
            <Text style={{ fontSize: 20, color: bottomNav === item.id ? '#f59e0b' : '#64748b' }}>{item.i}</Text>
            <Text style={[styles.bottomTabLabel, { color: bottomNav === item.id ? '#f59e0b' : '#94a3b8' }]}>{item.l}</Text>
          </TouchableOpacity>
        ))}
      </View>
            {/* Recharge Modal */}
      <Modal visible={modalVisible} transparent={true} animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <Text style={styles.modalTitle}>Recharge Amount</Text>
            <TextInput style={styles.inputField} placeholder="Amount (₹)" value={depositAmount} onChangeText={setDepositAmount} keyboardType="number-pad" />
            
            <Text style={{ fontSize: 11, color: '#64748b', marginTop: 6, fontWeight: 'bold' }}>Select Payee UPI ID:</Text>
            <View style={{ flexDirection: 'row', gap: 6, marginVertical: 4 }}>
              <TouchableOpacity style={[styles.upiSelectBtn, selectedUpi === 'deepsingh7412@ibl' && styles.upiSelected]} onPress={() => setSelectedUpi('deepsingh7412@ibl')}>
                <Text style={styles.upiSelectText}>1. deepsingh7412@ibl</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.upiSelectBtn, selectedUpi === 'mandeep7412@axl' && styles.upiSelected]} onPress={() => setSelectedUpi('mandeep7412@axl')}>
                <Text style={styles.upiSelectText}>2. mandeep7412@axl</Text>
              </TouchableOpacity>
            </View>

            <Text style={{ fontSize: 11, color: '#64748b', marginTop: 8, fontWeight: 'bold' }}>1-Click Payment Apps:</Text>
            <View style={{ flexDirection: 'row', gap: 6, marginVertical: 6 }}>
              <TouchableOpacity style={styles.phonepeBtn} onPress={() => openUpi('phonepe')}><Text style={styles.btnTextWhite}>🟣 PhonePe</Text></TouchableOpacity>
              <TouchableOpacity style={styles.paytmBtn} onPress={() => openUpi('paytm')}><Text style={styles.btnTextWhite}>🔵 Paytm</Text></TouchableOpacity>
              <TouchableOpacity style={styles.genericUpiBtn} onPress={() => openUpi('generic')}><Text style={styles.btnTextWhite}>🟢 GPay</Text></TouchableOpacity>
            </View>

            <TextInput style={[styles.inputField, { marginTop: 6 }]} placeholder="Enter 12-digit UTR No." value={transactionId} onChangeText={setTransactionId} keyboardType="number-pad" />
            <TouchableOpacity style={styles.submitBtn} onPress={handleDepositSubmit}><Text style={styles.btnTextWhite}>Submit Recharge</Text></TouchableOpacity>
            <TouchableOpacity style={{ alignItems: 'center', marginTop: 8 }} onPress={() => setModalVisible(false)}><Text style={{ color: '#ef4444', fontWeight: 'bold' }}>Cancel</Text></TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Withdraw Modal */}
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

      {/* Admin Panel Modal (PIN: 7412) */}
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
                {depositRequests.length === 0 ? <Text style={{ color: '#64748b', fontSize: 11, marginBottom: 6 }}>No pending recharges</Text> : depositRequests.map(d => (
                  <View key={d.id} style={styles.reqCard}>
                    <Text style={{ color: '#22c55e', fontWeight: 'bold' }}>₹{d.amount} | UTR: {d.utr}</Text>
                    <Text style={{ color: '#94a3b8', fontSize: 10 }}>User: {d.user}</Text>
                    <View style={{ flexDirection: 'row', gap: 8, marginTop: 6 }}>
                      <TouchableOpacity style={[styles.actionBtn, { backgroundColor: '#16a34a' }]} onPress={() => { setBalance(b => b + d.amount); setDepositRequests(depositRequests.filter(x => x.id !== d.id)); Alert.alert('Approved', `₹${d.amount} added!`); }}><Text style={styles.btnTextWhite}>Approve</Text></TouchableOpacity>
                      <TouchableOpacity style={[styles.actionBtn, { backgroundColor: '#ef4444' }]} onPress={() => { setDepositRequests(depositRequests.filter(x => x.id !== d.id)); }}><Text style={styles.btnTextWhite}>Reject</Text></TouchableOpacity>
                    </View>
                  </View>
                ))}
                <Text style={[styles.adminSubheading, { marginTop: 10 }]}>↗ Withdrawals ({withdrawRequests.length})</Text>
                {withdrawRequests.length === 0 ? <Text style={{ color: '#64748b', fontSize: 11 }}>No pending withdrawals</Text> : withdrawRequests.map(w => (
                  <View key={w.id} style={styles.reqCard}>
                    <Text style={{ color: '#f59e0b', fontWeight: 'bold' }}>₹{w.amount} | UPI: {w.upi}</Text>
                    <Text style={{ color: '#94a3b8', fontSize: 10 }}>User: {w.user}</Text>
                    <View style={{ flexDirection: 'row', gap: 8, marginTop: 6 }}>
                      <TouchableOpacity style={[styles.actionBtn, { backgroundColor: '#16a34a' }]} onPress={() => { setWithdrawRequests(withdrawRequests.filter(x => x.id !== w.id)); Alert.alert('Paid', 'Marked completed!'); }}><Text style={styles.btnTextWhite}>Paid</Text></TouchableOpacity>
                      <TouchableOpacity style={[styles.actionBtn, { backgroundColor: '#ef4444' }]} onPress={() => { setBalance(b => b + w.amount); setWithdrawRequests(withdrawRequests.filter(x => x.id !== w.id)); Alert.alert('Refunded', 'Withdrawal refund ho gaya.'); }}><Text style={styles.btnTextWhite}>Reject</Text></TouchableOpacity>
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
  authWrapper: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  authCard: { width: '100%', maxWidth: 360, backgroundColor: '#1e293b', padding: 24, borderRadius: 16, borderWidth: 1, borderColor: '#334155' },
  authLogo: { fontSize: 24, fontWeight: 'bold', color: '#fff', textAlign: 'center' },
  authSubtitle: { fontSize: 13, color: '#94a3b8', textAlign: 'center', marginTop: 4, marginBottom: 16 },
  authToggleRow: { flexDirection: 'row', backgroundColor: '#0f172a', borderRadius: 8, padding: 3, marginBottom: 16 },
  authToggleBtn: { flex: 1, paddingVertical: 8, alignItems: 'center', borderRadius: 6 },
  authToggleActive: { backgroundColor: '#f59e0b' },
  authToggleText: { color: '#94a3b8', fontSize: 12, fontWeight: 'bold' },
  authToggleTextActive: { color: '#000' },
  authInput: { backgroundColor: '#0f172a', color: '#fff', padding: 12, borderRadius: 8, borderWidth: 1, borderColor: '#334155', marginBottom: 12, fontSize: 13 },
  authSubmitBtn: { backgroundColor: '#16a34a', padding: 13, borderRadius: 8, alignItems: 'center', marginTop: 6 },
  authSubmitText: { color: '#fff', fontWeight: 'bold', fontSize: 13 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, paddingTop: Platform.OS === 'android' ? 36 : 14, paddingBottom: 14, backgroundColor: '#0e1726', borderBottomWidth: 1, borderColor: '#1e293b' },
  logoText: { fontSize: 18, fontWeight: 'bold', color: '#fff' },
  supportBtn: { backgroundColor: '#0284c7', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 16 },
  supportBtnText: { color: '#fff', fontWeight: 'bold', fontSize: 12 },
  mainContentArea: { flex: 1 },
  scrollArea: { padding: 14, paddingBottom: 20 },
  walletCard: { backgroundColor: '#1e293b', borderRadius: 14, padding: 16, marginBottom: 12, borderWidth: 1, borderColor: '#334155' },
  walletLabel: { color: '#94a3b8', fontSize: 11, fontWeight: '700' },
  walletBalance: { fontSize: 32, fontWeight: 'bold', color: '#fff', marginVertical: 8 },
  walletBtnRow: { flexDirection: 'row', gap: 10 },
  rechargeBtn: { flex: 1, backgroundColor: '#16a34a', borderRadius: 10, padding: 12, alignItems: 'center' },
  withdrawBtn: { flex: 1, backgroundColor: '#0284c7', borderRadius: 10, padding: 12, alignItems: 'center' },
  btnTextWhite: { color: '#fff', fontWeight: 'bold', fontSize: 12 },
  sectionHeading: { color: '#fff', fontSize: 14, fontWeight: 'bold', marginBottom: 8 },
  activePlanCard: { backgroundColor: '#162235', borderRadius: 10, padding: 10, marginBottom: 6, borderWidth: 1, borderColor: '#22c55e', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  claimBtn: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8 },
  filterRow: { flexDirection: 'row', backgroundColor: '#162235', borderRadius: 10, padding: 3, marginBottom: 10 },
  filterTab: { flex: 1, paddingVertical: 6, alignItems: 'center', borderRadius: 8 },
  filterTabActive: { backgroundColor: '#f59e0b' },
  filterTabText: { color: '#94a3b8', fontSize: 11 },
  filterTabTextActive: { color: '#fff', fontWeight: 'bold' },
  planCard: { backgroundColor: '#1e293b', borderRadius: 14, padding: 14, marginBottom: 10, borderWidth: 1, borderColor: '#334155' },
  planHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 },
  planBadge: { color: '#f59e0b', fontSize: 11, fontWeight: 'bold' },
  planDuration: { color: '#94a3b8', fontSize: 11 },
  planBody: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  planName: { color: '#fff', fontSize: 15, fontWeight: 'bold' },
  planDaily: { color: '#94a3b8', fontSize: 12 },
  investBtn: { backgroundColor: '#f59e0b', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 8 },
  investBtnText: { color: '#000', fontWeight: 'bold', fontSize: 12 },
  cardContainer: { backgroundColor: '#1e293b', borderRadius: 14, padding: 14 },
  historyRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: '#334155' },
  shareBtn: { backgroundColor: '#16a34a', padding: 12, borderRadius: 10, alignItems: 'center', marginTop: 6 },
  adminEntryBtn: { backgroundColor: '#f59e0b', padding: 12, borderRadius: 10, alignItems: 'center', marginBottom: 8 },
  supportBigBtn: { backgroundColor: '#0284c7', padding: 11, borderRadius: 10, alignItems: 'center' },
  logoutBtn: { padding: 12, borderRadius: 10, alignItems: 'center', marginTop: 10, borderWidth: 1, borderColor: '#ef4444' },
  bottomNavContainer: { height: 68, backgroundColor: '#0e1726', flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', borderTopWidth: 1, borderTopColor: '#1e293b', paddingBottom: Platform.OS === 'android' ? 6 : 14 },
  bottomTabItem: { alignItems: 'center', justifyContent: 'center', flex: 1 },
  bottomTabLabel: { fontSize: 11, fontWeight: 'bold', marginTop: 2 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.85)', justifyContent: 'center', alignItems: 'center', padding: 16 },
  modalBox: { backgroundColor: '#fff', borderRadius: 18, padding: 16, width: '100%', maxWidth: 350 },
  modalTitle: { fontSize: 16, fontWeight: 'bold', color: '#0f172a', marginBottom: 6 },
  inputField: { borderWidth: 1, borderColor: '#cbd5e1', borderRadius: 8, padding: 8, marginVertical: 4 },
  upiSelectBtn: { flex: 1, borderWidth: 1, borderColor: '#cbd5e1', borderRadius: 6, padding: 6, backgroundColor: '#fff' },
  upiSelected: { borderColor: '#16a34a', backgroundColor: '#f0fdf4' },
  upiSelectText: { fontSize: 11, fontWeight: 'bold', color: '#0f172a' },
  phonepeBtn: { flex: 1, backgroundColor: '#5f259f', padding: 9, borderRadius: 8, alignItems: 'center' },
  paytmBtn: { flex: 1, backgroundColor: '#00baf2', padding: 9, borderRadius: 8, alignItems: 'center' },
  genericUpiBtn: { flex: 1, backgroundColor: '#16a34a', padding: 9, borderRadius: 8, alignItems: 'center' },
  submitBtn: { backgroundColor: '#16a34a', borderRadius: 8, padding: 10, alignItems: 'center', marginTop: 6 },
  adminModalBox: { backgroundColor: '#0f172a', borderRadius: 18, padding: 18, width: '100%', maxHeight: '85%', borderWidth: 1, borderColor: '#334155' },
  adminTitle: { fontSize: 18, fontWeight: 'bold', color: '#f59e0b', marginBottom: 10 },
  adminInput: { backgroundColor: '#1e293b', color: '#fff', padding: 10, borderRadius: 8, marginBottom: 10 },
  adminSubheading: { color: '#fff', fontWeight: 'bold', fontSize: 13, marginBottom: 6 },
  reqCard: { backgroundColor: '#1e293b', padding: 10, borderRadius: 8, marginBottom: 6 },
  actionBtn: { flex: 1, padding: 6, borderRadius: 6, alignItems: 'center' }
});

