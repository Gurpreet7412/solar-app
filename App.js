import React, { useState, useEffect } from 'react';
import { Text, View, ScrollView, TouchableOpacity, TextInput, Modal, Alert, SafeAreaView, StatusBar, Linking, Share, Platform, StyleSheet } from 'react-native';

const ADMIN_PHONE_NUMBER = '7412881011';

export default function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [authMode, setAuthMode] = useState('signup');
  const [authPhone, setAuthPhone] = useState('');
  const [authNickname, setAuthNickname] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  const [authReferral, setAuthReferral] = useState('');
  
  const [otpSent, setOtpSent] = useState(false);
  const [generatedOtp, setGeneratedOtp] = useState('');
  const [userOtpInput, setUserOtpInput] = useState('');
  const [registeredUsers, setRegisteredUsers] = useState([]);

  // Balances
  const [rechargeBal, setRechargeBal] = useState(0.0);
  const [productIncome, setProductIncome] = useState(0.0);
  const [withdrawBal, setWithdrawBal] = useState(0.0);
  const [myActivePlans, setMyActivePlans] = useState([]);
  
  // Navigation & Modals
  const [bottomNav, setBottomNav] = useState('Home');
  const [investTab, setInvestTab] = useState('Stable');
  const [modalVisible, setModalVisible] = useState(false);
  const [withdrawModalVisible, setWithdrawModalVisible] = useState(false);
  const [adminModalVisible, setAdminModalVisible] = useState(false);
  const [adminAuth, setAdminAuth] = useState(false);
  const [adminPin, setAdminPin] = useState('');
  
  const [depositAmount, setDepositAmount] = useState('260');
  const [selectedUpi, setSelectedUpi] = useState('deepsingh7412@ibl');
  const [transactionId, setTransactionId] = useState('');
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [withdrawUpi, setWithdrawUpi] = useState('');
  
  const [depositRequests, setDepositRequests] = useState([]);
  const [withdrawRequests, setWithdrawRequests] = useState([]);

  const telegramLink = 'https://t.me/Guri7412';
  const myRefCode = currentUser?.refCode || '9668F';
  const userInviteLink = `https://www.energytransition.ru/?invitation_code=${myRefCode}`;
  const isOwner = currentUser?.phone === ADMIN_PHONE_NUMBER;

  const plans = [
    { id: 1, name: 'Buy and Upgrade to VIP1', price: 260.0, daily: 215.8, days: 48, total: 10358.4, copies: 100, category: 'Stable', vip: 'VIP0' },
    { id: 2, name: 'Energy Solar Plant Pro', price: 580.0, daily: 490.0, days: 45, total: 22050.0, copies: 50, category: 'Stable', vip: 'VIP1' },
    { id: 3, name: 'Welfare Express Plan', price: 150.0, daily: 50.0, days: 7, total: 350.0, copies: 10, category: 'Welfare', vip: 'VIP0' },
    { id: 4, name: 'Flash Activity Boost', price: 800.0, daily: 300.0, days: 15, total: 4500.0, copies: 20, category: 'Activity', vip: 'VIP1' }
  ];

  const filteredPlans = plans.filter(p => p.category === investTab);

  const handleSendOtp = () => {
    if (!authPhone.trim() || authPhone.length !== 10) {
      return Alert.alert('Error', 'Valid 10-digit mobile number daalein.');
    }
    const randomOtp = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedOtp(randomOtp);
    setOtpSent(true);
    Alert.alert('Verification Code (OTP)', `Aapka OTP code: ${randomOtp}`);
  };

  const handleAuthSubmit = () => {
    if (!authPhone.trim() || authPhone.length !== 10) return Alert.alert('Error', '10-digit number enter karein.');
    if (!authPassword.trim() || authPassword.length < 4) return Alert.alert('Error', 'Password min 4 characters ka ho.');

    if (authMode === 'signup') {
      if (!otpSent || userOtpInput.trim() !== generatedOtp) return Alert.alert('Invalid OTP', 'Sahi OTP code daalein.');
      const uniqueCode = Math.floor(10000 + Math.random() * 90000).toString();
      const newUser = { phone: authPhone, nickname: authNickname || 'User', refCode: uniqueCode };
      setCurrentUser(newUser);
      Alert.alert('Registered', 'Account create ho gaya!');
    } else {
      setCurrentUser({ phone: authPhone, nickname: authNickname || 'Guri', refCode: '9668F' });
      Alert.alert('Success', 'Login successful!');
    }
  };

  const handleInvest = (p) => {
    if (rechargeBal < p.price) {
      return Alert.alert('Low Balance', `₹${p.price} recharge karein.`, [
        { text: 'Cancel' },
        { text: 'Recharge', onPress: () => { setDepositAmount(p.price.toString()); setModalVisible(true); } }
      ]);
    }
    setRechargeBal(b => b - p.price);
    setMyActivePlans([p, ...myActivePlans]);
    Alert.alert('Purchased', `${p.name} activated successfully!`);
  };

  const openUpi = (app) => {
    const amt = depositAmount || '260';
    const generic = `upi://pay?pa=${selectedUpi}&pn=EnergyTransition&am=${amt}&cu=INR`;
    const targetUrl = app === 'phonepe' ? `phonepe://pay?pa=${selectedUpi}&pn=EnergyTransition&am=${amt}&cu=INR` : app === 'paytm' ? `paytmmp://pay?pa=${selectedUpi}&pn=EnergyTransition&am=${amt}&cu=INR` : generic;
    Linking.openURL(targetUrl).catch(() => Linking.openURL(generic));
  };
  if (!currentUser) {
    return (
      <SafeAreaView style={styles.authContainer}>
        <StatusBar barStyle="dark-content" backgroundColor="#f97316" />
        <View style={styles.authHeaderBox}>
          <Text style={styles.authBrand}>eni</Text>
          <Text style={styles.authModeTitle}>{authMode === 'signup' ? 'Register' : 'Login'}</Text>
        </View>

        <ScrollView contentContainerStyle={styles.authFormCard}>
          <Text style={styles.inputLabel}>Mobile Number</Text>
          <View style={styles.phoneInputRow}>
            <View style={styles.countryCode}><Text style={{ color: '#333', fontWeight: 'bold' }}>+91</Text></View>
            <TextInput style={styles.phoneInput} placeholder="Mobile Number" value={authPhone} onChangeText={setAuthPhone} keyboardType="number-pad" maxLength={10} />
          </View>

          {authMode === 'signup' && (
            <>
              <Text style={styles.inputLabel}>Nickname</Text>
              <TextInput style={styles.formInput} placeholder="Nickname" value={authNickname} onChangeText={setAuthNickname} />
            </>
          )}

          <Text style={styles.inputLabel}>Password</Text>
          <TextInput style={styles.formInput} placeholder="Password" secureTextEntry value={authPassword} onChangeText={setAuthPassword} />

          {authMode === 'signup' && (
            <>
              <Text style={styles.inputLabel}>Invitation Code</Text>
              <TextInput style={styles.formInput} placeholder="Invitation Code" value={authReferral} onChangeText={setAuthReferral} />

              <Text style={styles.inputLabel}>Verification Code (OTP)</Text>
              <View style={styles.otpInputRow}>
                <TextInput style={[styles.formInput, { flex: 1, marginBottom: 0 }]} placeholder="OTP Code" value={userOtpInput} onChangeText={setUserOtpInput} keyboardType="number-pad" maxLength={6} />
                <TouchableOpacity style={styles.sendOtpBtn} onPress={handleSendOtp}>
                  <Text style={{ color: '#fff', fontSize: 12, fontWeight: 'bold' }}>{otpSent ? 'Resend' : 'Send OTP'}</Text>
                </TouchableOpacity>
              </View>
            </>
          )}

          <TouchableOpacity style={styles.primaryAuthBtn} onPress={handleAuthSubmit}>
            <Text style={styles.primaryAuthBtnText}>{authMode === 'signup' ? 'Register Now' : 'Login Now'}</Text>
          </TouchableOpacity>

          <TouchableOpacity style={{ marginTop: 15, alignItems: 'center' }} onPress={() => { setAuthMode(authMode === 'signup' ? 'login' : 'signup'); setOtpSent(false); }}>
            <Text style={{ color: '#666' }}>{authMode === 'signup' ? 'Already have an account? ' : "Don't have an account? "}
              <Text style={{ color: '#f97316', fontWeight: 'bold' }}>{authMode === 'signup' ? 'Login Now' : 'Register'}</Text>
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#f97316" />

      {/* Floating Side Support */}
      <TouchableOpacity style={styles.floatingTelegram} onPress={() => Linking.openURL(telegramLink)}>
        <Text style={{ fontSize: 20 }}>✈️</Text>
      </TouchableOpacity>

      <View style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={{ paddingBottom: 90 }} showsVerticalScrollIndicator={false}>
          
          {/* HOME TAB */}
          {bottomNav === 'Home' && (
            <>
              <View style={styles.heroBanner}>
                <Text style={styles.heroBannerTitle}>We devote all our energy to you</Text>
              </View>

              {/* 3 Balances Orange Card */}
              <View style={styles.orangeBalanceCard}>
                <View style={styles.balanceGrid}>
                  <View style={styles.balanceCol}>
                    <Text style={styles.balAmt}>₹{rechargeBal.toFixed(2)}</Text>
                    <Text style={styles.balLbl}>Recharge Balance</Text>
                  </View>
                  <View style={styles.balanceCol}>
                    <Text style={styles.balAmt}>₹{productIncome.toFixed(2)}</Text>
                    <Text style={styles.balLbl}>Product Income</Text>
                  </View>
                  <View style={styles.balanceCol}>
                    <Text style={styles.balAmt}>₹{withdrawBal.toFixed(2)}</Text>
                    <Text style={styles.balLbl}>Withdraw Balance</Text>
                  </View>
                </View>

                {/* 4 Circular Action Buttons */}
                <View style={styles.circleActionRow}>
                  <TouchableOpacity style={styles.circleActionItem} onPress={() => setModalVisible(true)}>
                    <View style={styles.circleIconBg}><Text style={{ fontSize: 18 }}>💳</Text></View>
                    <Text style={styles.circleActionLabel}>Recharge</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.circleActionItem} onPress={() => setWithdrawModalVisible(true)}>
                    <View style={styles.circleIconBg}><Text style={{ fontSize: 18 }}>👛</Text></View>
                    <Text style={styles.circleActionLabel}>Withdraw</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.circleActionItem} onPress={() => setBottomNav('Account')}>
                    <View style={styles.circleIconBg}><Text style={{ fontSize: 18 }}>👥</Text></View>
                    <Text style={styles.circleActionLabel}>Team</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.circleActionItem} onPress={() => Linking.openURL(telegramLink)}>
                    <View style={styles.circleIconBg}><Text style={{ fontSize: 18 }}>💬</Text></View>
                    <Text style={styles.circleActionLabel}>Telegram</Text>
                  </TouchableOpacity>
                </View>
              </View>

              {/* My Team Invite Card */}
              <View style={styles.teamCard}>
                <Text style={styles.cardHeaderTitle}>My Team</Text>
                <Text style={styles.inviteLinkTxt}>{userInviteLink}</Text>
                <View style={styles.teamBtnRow}>
                  <TouchableOpacity style={styles.copyBtn} onPress={() => Share.share({ message: userInviteLink })}>
                    <Text style={{ color: '#fff', fontWeight: 'bold' }}>Copy</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.goToBtn} onPress={() => Share.share({ message: userInviteLink })}>
                    <Text style={{ color: '#fff', fontWeight: 'bold' }}>Go To →</Text>
                  </TouchableOpacity>
                </View>
              </View>

              {/* Daily Sign In Reward Card */}
              <View style={styles.signInRewardCard}>
                <Text style={styles.cardHeaderTitle}>Sign in to receive rewards</Text>
                <Text style={{ color: '#666', fontSize: 12, marginVertical: 4 }}>Daily check-in can receive ₹ 0.00.</Text>
                <TouchableOpacity style={styles.signInBtn} onPress={() => Alert.alert('Signed In', 'Today check-in bonus credited!')}>
                  <Text style={{ color: '#fff', fontWeight: 'bold' }}>Sign in now</Text>
                </TouchableOpacity>
              </View>
            </>
          )}

          {/* INVEST TAB */}
          {bottomNav === 'Invest' && (
            <View style={{ padding: 12 }}>
              <View style={styles.investTabsBar}>
                {['Stable', 'Welfare', 'Activity'].map(tab => (
                  <TouchableOpacity key={tab} style={[styles.invTabBtn, investTab === tab && styles.invTabBtnActive]} onPress={() => setInvestTab(tab)}>
                    <Text style={[styles.invTabTxt, investTab === tab && styles.invTabTxtActive]}>{tab}</Text>
                  </TouchableOpacity>
                ))}
              </View>

              {filteredPlans.map(p => (
                <View key={p.id} style={styles.productCard}>
                  <View style={styles.productImgMock}><Text style={{ color: '#fff', fontWeight: 'bold' }}>⚡ {p.name}</Text></View>
                  <View style={styles.productDetails}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                      <Text style={{ fontWeight: 'bold', fontSize: 16 }}>{p.name}</Text>
                      <View style={styles.vipTag}><Text style={{ color: '#fff', fontSize: 10, fontWeight: 'bold' }}>{p.vip}</Text></View>
                    </View>
                    <View style={styles.metricsGrid}>
                      <View><Text style={styles.metricVal}>₹ {p.price.toFixed(2)}</Text><Text style={styles.metricLbl}>Each Price</Text></View>
                      <View><Text style={styles.metricVal}>₹{p.daily.toFixed(1)}</Text><Text style={styles.metricLbl}>Daily Earnings</Text></View>
                      <View><Text style={styles.metricVal}>{p.days} Days</Text><Text style={styles.metricLbl}>Revenue</Text></View>
                    </View>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 12 }}>
                      <View><Text style={{ fontWeight: 'bold', fontSize: 14 }}>₹ {p.total.toFixed(1)}</Text><Text style={styles.metricLbl}>Total Revenue</Text></View>
                      <TouchableOpacity style={styles.buyBtn} onPress={() => handleInvest(p)}><Text style={{ color: '#fff', fontWeight: 'bold' }}>Buy</Text></TouchableOpacity>
                    </View>
                  </View>
                </View>
              ))}
            </View>
          )}

          {/* ACCOUNT TAB */}
          {bottomNav === 'Account' && (
            <View style={{ padding: 12 }}>
              <View style={styles.accountTopInfo}>
                <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#333' }}>{currentUser.nickname} <Text style={{ fontSize: 12, color: '#f97316' }}>VIP0</Text></Text>
                <Text style={{ color: '#666', fontSize: 12 }}>ID: {currentUser.phone.slice(0, 2)}******{currentUser.phone.slice(-2)}</Text>
              </View>

              {/* VIP Progress Card */}
              <View style={styles.vipOrangeBanner}>
                <Text style={{ color: '#fff', fontWeight: 'bold' }}>⭐ VIP Level (VIP 0)</Text>
                <Text style={{ color: '#fff', fontSize: 11, marginTop: 4 }}>Upgrade to VIP1 requires 260 more</Text>
              </View>

              {/* Account Quick Grid */}
              <View style={styles.accountGridCard}>
                <TouchableOpacity style={styles.accountGridItem} onPress={() => setModalVisible(true)}><Text style={{ fontSize: 20 }}>💳</Text><Text style={styles.gridLbl}>Recharge</Text></TouchableOpacity>
                <TouchableOpacity style={styles.accountGridItem} onPress={() => setWithdrawModalVisible(true)}><Text style={{ fontSize: 20 }}>👛</Text><Text style={styles.gridLbl}>Withdraw</Text></TouchableOpacity>
                <TouchableOpacity style={styles.accountGridItem} onPress={() => Alert.alert('Orders', `Active: ${myActivePlans.length}`)}><Text style={{ fontSize: 20 }}>📄</Text><Text style={styles.gridLbl}>My Orders</Text></TouchableOpacity>
                <TouchableOpacity style={styles.accountGridItem} onPress={() => Alert.alert('Bank', 'Add bank card')}><Text style={{ fontSize: 20 }}>🏦</Text><Text style={styles.gridLbl}>Bank Card</Text></TouchableOpacity>
              </View>

              {isOwner && (
                <TouchableOpacity style={styles.ownerEntryBtn} onPress={() => setAdminModalVisible(true)}>
                  <Text style={{ color: '#fff', fontWeight: 'bold' }}>👑 Owner Control Panel</Text>
                </TouchableOpacity>
              )}
            </View>
          )}
        </ScrollView>
      </View>
        {/* 5 Bottom Tabs with Center Floating Bell */}
      <View style={styles.bottomTabBar}>
        <TouchableOpacity style={styles.tabItem} onPress={() => setBottomNav('Home')}>
          <Text style={{ fontSize: 18, color: bottomNav === 'Home' ? '#f97316' : '#999' }}>🏠</Text>
          <Text style={[styles.tabLabel, bottomNav === 'Home' && { color: '#f97316' }]}>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.tabItem} onPress={() => setBottomNav('Invest')}>
          <Text style={{ fontSize: 18, color: bottomNav === 'Invest' ? '#f97316' : '#999' }}>📈</Text>
          <Text style={[styles.tabLabel, bottomNav === 'Invest' && { color: '#f97316' }]}>Invest</Text>
        </TouchableOpacity>
        
        {/* Floating Bell Center Button */}
        <TouchableOpacity style={styles.floatingCenterBell} onPress={() => Alert.alert('Notice', 'Welcome to Energy Transition Official System!')}>
          <Text style={{ fontSize: 24 }}>🔔</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.tabItem} onPress={() => Alert.alert('Blog', 'Latest company blogs & notices')}>
          <Text style={{ fontSize: 18, color: '#999' }}>💬</Text>
          <Text style={styles.tabLabel}>Blog</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.tabItem} onPress={() => setBottomNav('Account')}>
          <Text style={{ fontSize: 18, color: bottomNav === 'Account' ? '#f97316' : '#999' }}>👤</Text>
          <Text style={[styles.tabLabel, bottomNav === 'Account' && { color: '#f97316' }]}>Account</Text>
        </TouchableOpacity>
      </View>

      {/* Recharge Modal */}
      <Modal visible={modalVisible} transparent={true} animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalHeader}>Recharge Balance</Text>
            <TextInput style={styles.modalInput} value={depositAmount} onChangeText={setDepositAmount} keyboardType="number-pad" placeholder="Amount (₹)" />
            <View style={{ flexDirection: 'row', gap: 6, marginVertical: 8 }}>
              <TouchableOpacity style={styles.phonepeBtn} onPress={() => openUpi('phonepe')}><Text style={{ color: '#fff', fontWeight: 'bold' }}>PhonePe</Text></TouchableOpacity>
              <TouchableOpacity style={styles.paytmBtn} onPress={() => openUpi('paytm')}><Text style={{ color: '#fff', fontWeight: 'bold' }}>Paytm</Text></TouchableOpacity>
            </View>
            <TextInput style={styles.modalInput} value={transactionId} onChangeText={setTransactionId} placeholder="Enter 12-digit UTR" keyboardType="number-pad" />
            <TouchableOpacity style={styles.submitModalBtn} onPress={() => { setRechargeBal(b => b + Number(depositAmount || 0)); setModalVisible(false); Alert.alert('Success', 'Recharge requested!'); }}><Text style={{ color: '#fff', fontWeight: 'bold' }}>Submit</Text></TouchableOpacity>
            <TouchableOpacity onPress={() => setModalVisible(false)} style={{ marginTop: 10, alignItems: 'center' }}><Text style={{ color: 'red' }}>Cancel</Text></TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Withdraw Modal */}
      <Modal visible={withdrawModalVisible} transparent={true} animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalHeader}>Withdraw Balance</Text>
            <TextInput style={styles.modalInput} value={withdrawAmount} onChangeText={setWithdrawAmount} placeholder="Amount (Min ₹200)" keyboardType="number-pad" />
            <TextInput style={styles.modalInput} value={withdrawUpi} onChangeText={setWithdrawUpi} placeholder="Your UPI ID" />
            <TouchableOpacity style={styles.submitModalBtn} onPress={() => { setWithdrawModalVisible(false); Alert.alert('Requested', 'Withdrawal under review'); }}><Text style={{ color: '#fff', fontWeight: 'bold' }}>Submit</Text></TouchableOpacity>
            <TouchableOpacity onPress={() => setWithdrawModalVisible(false)} style={{ marginTop: 10, alignItems: 'center' }}><Text style={{ color: 'red' }}>Cancel</Text></TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Admin Panel Modal */}
      <Modal visible={adminModalVisible} transparent={true} animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: '#1e293b' }]}>
            <Text style={{ color: '#f97316', fontSize: 18, fontWeight: 'bold', marginBottom: 10 }}>👑 Owner Panel</Text>
            {!adminAuth ? (
              <View>
                <TextInput style={[styles.modalInput, { color: '#fff', backgroundColor: '#0f172a' }]} placeholder="Security PIN" placeholderTextColor="#666" secureTextEntry value={adminPin} onChangeText={setAdminPin} keyboardType="number-pad" />
                <TouchableOpacity style={styles.submitModalBtn} onPress={() => { if (adminPin === '881011') { setAdminAuth(true); setAdminPin(''); } else { Alert.alert('Error', 'Galat PIN'); } }}><Text style={{ color: '#fff', fontWeight: 'bold' }}>Login</Text></TouchableOpacity>
              </View>
            ) : (
              <View>
                <Text style={{ color: '#fff', marginBottom: 10 }}>Total Registered Users: {registeredUsers.length}</Text>
                <Text style={{ color: '#22c55e' }}>System Running Live (VIP Engine Active)</Text>
              </View>
            )}
            <TouchableOpacity onPress={() => { setAdminModalVisible(false); setAdminAuth(false); }} style={{ marginTop: 15, alignItems: 'center' }}><Text style={{ color: '#999' }}>Close</Text></TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc' },
  authContainer: { flex: 1, backgroundColor: '#f97316' },
  authHeaderBox: { padding: 24, paddingTop: 40 },
  authBrand: { fontSize: 36, fontWeight: 'bold', color: '#fff' },
  authModeTitle: { fontSize: 22, fontWeight: 'bold', color: '#fff', marginTop: 10 },
  authFormCard: { backgroundColor: '#fff', borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 20, flexGrow: 1 },
  inputLabel: { fontSize: 12, fontWeight: 'bold', color: '#666', marginTop: 10, marginBottom: 4 },
  phoneInputRow: { flexDirection: 'row', gap: 6 },
  countryCode: { backgroundColor: '#f1f5f9', paddingHorizontal: 14, justifyContent: 'center', borderRadius: 8 },
  phoneInput: { flex: 1, backgroundColor: '#f1f5f9', padding: 12, borderRadius: 8 },
  formInput: { backgroundColor: '#f1f5f9', padding: 12, borderRadius: 8, marginBottom: 4 },
  otpInputRow: { flexDirection: 'row', gap: 6 },
  sendOtpBtn: { backgroundColor: '#f97316', justifyContent: 'center', paddingHorizontal: 12, borderRadius: 8 },
  primaryAuthBtn: { backgroundColor: '#f97316', padding: 14, borderRadius: 25, alignItems: 'center', marginTop: 16 },
  primaryAuthBtnText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  floatingTelegram: { position: 'absolute', right: 12, top: 220, zIndex: 99, backgroundColor: '#f97316', width: 44, height: 44, borderRadius: 22, justifyContent: 'center', alignItems: 'center', elevation: 5 },
  heroBanner: { height: 160, backgroundColor: '#0f172a', justifyContent: 'center', alignItems: 'center', padding: 16 },
  heroBannerTitle: { color: '#f97316', fontSize: 20, fontWeight: 'bold', textAlign: 'center' },
  orangeBalanceCard: { backgroundColor: '#f97316', margin: 12, borderRadius: 16, padding: 16, marginTop: -20, elevation: 4 },
  balanceGrid: { flexDirection: 'row', justifyContent: 'space-between', borderBottomWidth: 1, borderColor: '#fdba74', paddingBottom: 12 },
  balanceCol: { alignItems: 'center', flex: 1 },
  balAmt: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  balLbl: { color: '#fed7aa', fontSize: 10, marginTop: 2 },
  circleActionRow: { flexDirection: 'row', justifyContent: 'space-around', marginTop: 14 },
  circleActionItem: { alignItems: 'center' },
  circleIconBg: { width: 46, height: 46, borderRadius: 23, backgroundColor: 'rgba(255,255,255,0.2)', justifyContent: 'center', alignItems: 'center' },
  circleActionLabel: { color: '#fff', fontSize: 11, marginTop: 4 },
  teamCard: { backgroundColor: '#e0f2fe', marginHorizontal: 12, borderRadius: 12, padding: 14, marginBottom: 12 },
  cardHeaderTitle: { fontSize: 16, fontWeight: 'bold', color: '#0f172a' },
  inviteLinkTxt: { color: '#64748b', fontSize: 11, marginVertical: 6 },
  teamBtnRow: { flexDirection: 'row', gap: 10, marginTop: 6 },
  copyBtn: { flex: 1, backgroundColor: '#f97316', padding: 8, borderRadius: 20, alignItems: 'center' },
  goToBtn: { flex: 1, backgroundColor: '#ea580c', padding: 8, borderRadius: 20, alignItems: 'center' },
  signInRewardCard: { backgroundColor: '#dcfce7', marginHorizontal: 12, borderRadius: 12, padding: 14 },
  signInBtn: { backgroundColor: '#f97316', padding: 10, borderRadius: 20, alignItems: 'center', width: 140, marginTop: 6 },
  investTabsBar: { flexDirection: 'row', backgroundColor: '#fff', borderRadius: 10, padding: 4, marginBottom: 12 },
  invTabBtn: { flex: 1, paddingVertical: 8, alignItems: 'center', borderRadius: 8 },
  invTabBtnActive: { backgroundColor: '#f97316' },
  invTabTxt: { color: '#666', fontWeight: 'bold', fontSize: 12 },
  invTabTxtActive: { color: '#fff' },
  productCard: { backgroundColor: '#fff', borderRadius: 12, marginBottom: 12, overflow: 'hidden', elevation: 2 },
  productImgMock: { height: 120, backgroundColor: '#334155', justifyContent: 'center', alignItems: 'center' },
  productDetails: { padding: 12 },
  vipTag: { backgroundColor: '#cbd5e1', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4 },
  metricsGrid: { flexDirection: 'row', justifyContent: 'space-between', marginVertical: 8 },
  metricVal: { fontSize: 14, fontWeight: 'bold', color: '#0f172a' },
  metricLbl: { fontSize: 10, color: '#64748b' },
  buyBtn: { backgroundColor: '#f97316', paddingHorizontal: 24, paddingVertical: 8, borderRadius: 20 },
  accountTopInfo: { backgroundColor: '#fff', padding: 14, borderRadius: 12, marginBottom: 10 },
  vipOrangeBanner: { backgroundColor: '#f97316', padding: 14, borderRadius: 12, marginBottom: 10 },
  accountGridCard: { flexDirection: 'row', flexWrap: 'wrap', backgroundColor: '#fff', borderRadius: 12, padding: 12 },
  accountGridItem: { width: '25%', alignItems: 'center', marginVertical: 6 },
  gridLbl: { fontSize: 11, color: '#475569', marginTop: 4 },
  ownerEntryBtn: { backgroundColor: '#ea580c', padding: 12, borderRadius: 10, alignItems: 'center', marginTop: 12 },
  bottomTabBar: { height: 65, backgroundColor: '#fff', flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', borderTopWidth: 1, borderColor: '#e2e8f0', position: 'absolute', bottom: 0, width: '100%' },
  tabItem: { alignItems: 'center', flex: 1 },
  tabLabel: { fontSize: 10, color: '#999', marginTop: 2 },
  floatingCenterBell: { width: 50, height: 50, borderRadius: 25, backgroundColor: '#f97316', justifyContent: 'center', alignItems: 'center', marginTop: -25, elevation: 6 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'center', padding: 20 },
  modalContent: { backgroundColor: '#fff', padding: 20, borderRadius: 16 },
  modalHeader: { fontSize: 16, fontWeight: 'bold', marginBottom: 10 },
  modalInput: { borderWidth: 1, borderColor: '#cbd5e1', borderRadius: 8, padding: 10, marginBottom: 8 },
  phonepeBtn: { flex: 1, backgroundColor: '#5f259f', padding: 10, borderRadius: 8, alignItems: 'center' },
  paytmBtn: { flex: 1, backgroundColor: '#00baf2', padding: 10, borderRadius: 8, alignItems: 'center' },
  submitModalBtn: { backgroundColor: '#f97316', padding: 12, borderRadius: 8, alignItems: 'center', marginTop: 6 }
});
                
