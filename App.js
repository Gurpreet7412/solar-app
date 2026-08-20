import React, { useState } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, TextInput, Modal, Alert, SafeAreaView, StatusBar, Linking, Image, ImageBackground, Share, Platform } from 'react-native';

export default function App() {
  const [balance, setBalance] = useState(1100.0);
  const [activeTab, setActiveTab] = useState('All');
  const [bottomNav, setBottomNav] = useState('Invest');
  const [modalVisible, setModalVisible] = useState(false);
  const [withdrawModalVisible, setWithdrawModalVisible] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [depositInputAmount, setDepositInputAmount] = useState('500');
  const [selectedUpi, setSelectedUpi] = useState('deepsingh7412@ibl');
  const [transactionId, setTransactionId] = useState('');
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [withdrawUpi, setWithdrawUpi] = useState('');
  const [myActivePlans, setMyActivePlans] = useState([]);
  const [history, setHistory] = useState([{ id: '1', type: 'Welcome Bonus', amount: '₹1100.00', status: 'Completed', date: 'Initial' }]);

  const referralLink = 'https://solarinvest.in/register?ref=Guri7412';

  const plans = [
    { id: 1, badge: '⚡ Fast', duration: '7 Days', daysCount: 7, name: 'Solar Starter 7D', price: 150, daily: 30, category: 'Weekly' },
    { id: 2, badge: '⚡ Quick', duration: '7 Days', daysCount: 7, name: 'Solar Express 7D', price: 300, daily: 65, category: 'Weekly' },
    { id: 3, badge: '🔥 Hot', duration: '15 Days', daysCount: 15, name: 'Solar Micro 15D', price: 200, daily: 25, category: '15 Days' },
    { id: 4, badge: '⭐ Popular', duration: '15 Days', daysCount: 15, name: 'Solar Mini 15D', price: 400, daily: 55, category: '15 Days' },
    { id: 5, badge: '🚀 High Return', duration: '15 Days', daysCount: 15, name: 'Solar Boost 15D', price: 800, daily: 120, category: '15 Days' },
    { id: 6, badge: '🌱 Stable', duration: '30 Days', daysCount: 30, name: 'Solar Plant 30D', price: 1500, daily: 240, category: '30 Days' },
    { id: 7, badge: '👑 Mega', duration: '30 Days', daysCount: 30, name: 'Solar Farm Max', price: 3000, daily: 520, category: '30 Days' }
  ];

  const filteredPlans = activeTab === 'All' ? plans : plans.filter(p => p.category === activeTab);
  const openTelegram = () => Linking.openURL('https://t.me/Guri7412').catch(() => Alert.alert('Support', '@Guri7412'));

  // Open Direct UPI Apps (PhonePe / Paytm / Any UPI)
  const openUpiPayment = (app) => {
    const amt = Number(depositInputAmount) > 0 ? depositInputAmount : '500';
    const genericUpi = `upi://pay?pa=${selectedUpi}&pn=SolarInvest&am=${amt}&cu=INR`;
    let url = genericUpi;

    if (app === 'phonepe') {
      url = `phonepe://pay?pa=${selectedUpi}&pn=SolarInvest&am=${amt}&cu=INR`;
    } else if (app === 'paytm') {
      url = `paytmmp://pay?pa=${selectedUpi}&pn=SolarInvest&am=${amt}&cu=INR`;
    }

    Linking.openURL(url).catch(() => {
      Linking.openURL(genericUpi).catch(() => {
        Alert.alert('UPI App Error', 'App open nahi ho pa rahi hai. Kripya UPI ID copy karke manual payment karein.');
      });
    });
  };

  const handleShare = async () => {
    try {
      await Share.share({ message: `🔥 Solar Invest website par join karein aur 30% Bonus payen!\nRegistration Link: ${referralLink}` });
    } catch (e) { Alert.alert('Error', 'Share failed'); }
  };

  const handleInvest = (plan) => {
    if (balance < plan.price) {
      Alert.alert('Low Balance', `₹${plan.price} recharge karein.`, [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Recharge', onPress: () => { setSelectedPlan(plan); setDepositInputAmount(plan.price.toString()); setModalVisible(true); } }
      ]);
      return;
    }
    setBalance(prev => prev - plan.price);
    setMyActivePlans([{ id: Date.now().toString(), name: plan.name, price: plan.price, daily: plan.daily, daysLeft: plan.daysCount, startDate: new Date().toLocaleDateString('en-GB') }, ...myActivePlans]);
    setHistory([{ id: Date.now().toString(), type: `Invest: ${plan.name}`, amount: `-₹${plan.price}`, status: 'Running', date: new Date().toLocaleDateString('en-GB') }, ...history]);
    Alert.alert('Success', `${plan.name} activate ho gaya! Earning start ho chuki hai.`);
  };

  const handleDeposit = () => {
    if (!transactionId.trim() || transactionId.length < 6) return Alert.alert('Required', 'Valid 12-digit UTR No. enter karein.');
    const amt = Number(depositInputAmount) > 0 ? Number(depositInputAmount) : 500;
    
    setBalance(prev => prev + amt);
    setHistory([{ id: Date.now().toString(), type: 'Recharge (UPI)', amount: `+₹${amt}`, status: 'Success (Credited)', date: new Date().toLocaleDateString('en-GB') }, ...history]);
    
    Alert.alert('Recharge Successful', `₹${amt} aapke wallet balance me add kar diye gaye hain!`);
    setModalVisible(false);
    setTransactionId('');
  };

  const handleClaimDailyProfit = (plan) => {
    setBalance(prev => prev + plan.daily);
    setHistory([{ id: Date.now().toString(), type: `Daily Income: ${plan.name}`, amount: `+₹${plan.daily}`, status: 'Credited', date: new Date().toLocaleDateString('en-GB') }, ...history]);
    Alert.alert('Profit Collected', `₹${plan.daily} aapke wallet balance me add ho gaye hain!`);
  };

  const handleWithdraw = () => {
    if (!withdrawAmount || Number(withdrawAmount) < 200) return Alert.alert('Invalid', 'Min withdrawal limit ₹200 hai.');
    if (!withdrawUpi.trim()) return Alert.alert('Required', 'UPI ID enter karein');
    if (Number(withdrawAmount) > balance) return Alert.alert('Error', 'Insufficient wallet balance');
    setBalance(prev => prev - Number(withdrawAmount));
    setHistory([{ id: Date.now().toString(), type: `Withdraw (${withdrawUpi})`, amount: `-₹${withdrawAmount}`, status: 'Processing', date: new Date().toLocaleDateString('en-GB') }, ...history]);
    Alert.alert('Success', `₹${withdrawAmount} withdrawal request submit ho gayi.`);
    setWithdrawModalVisible(false);
    setWithdrawAmount('');
    setWithdrawUpi('');
  };

  return (
    <SafeAreaView style={s.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0a101d" />
      <ImageBackground source={{ uri: 'https://images.unsplash.com/photo-1509391365360-2e959784a276?q=80&w=1080&auto=format&fit=crop' }} style={s.bg} resizeMode="cover">
        <View style={s.overlay}>
          
          <View style={s.header}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Image source={require('./icon.png')} style={{ width: 34, height: 34, borderRadius: 8, marginRight: 8 }} />
              <View>
                <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#fff' }}>SOLAR <Text style={{ color: '#f59e0b' }}>INVEST</Text></Text>
                <Text style={{ fontSize: 10, color: '#94a3b8' }}>Clean Energy Growth</Text>
              </View>
            </View>
            <TouchableOpacity style={s.helpBtn} onPress={openTelegram}>
              <Text style={s.btnTxt}>✈️ @Guri7412</Text>
            </TouchableOpacity>
          </View>

          <ScrollView contentContainerStyle={s.scroll} showsVerticalScrollIndicator={false}>
            {bottomNav === 'Invest' && (
              <>
                <View style={s.card}>
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                    <Text style={{ color: '#94a3b8', fontSize: 11, fontWeight: '700' }}>TOTAL WALLET BALANCE</Text>
                    <Text style={{ color: '#22c55e', fontSize: 12, fontWeight: 'bold' }}>● Active</Text>
                  </View>
                  <Text style={{ fontSize: 32, fontWeight: 'bold', color: '#fff', marginVertical: 8 }}>₹{balance.toFixed(2)}</Text>
                  <View style={{ flexDirection: 'row', gap: 10 }}>
                    <TouchableOpacity style={[s.btn, { backgroundColor: '#16a34a' }]} onPress={() => { setSelectedPlan(null); setDepositInputAmount('500'); setModalVisible(true); }}>
                      <Text style={s.btnTxt}>⚡ + Recharge</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[s.btn, { backgroundColor: '#2e3d5b' }]} onPress={() => setWithdrawModalVisible(true)}>
                      <Text style={s.btnTxt}>↗ Withdraw</Text>
                    </TouchableOpacity>
                  </View>
                </View>

                {myActivePlans.length > 0 && (
                  <View style={{ marginBottom: 12 }}>
                    <Text style={s.secTitle}>⚡ Running Investments ({myActivePlans.length})</Text>
                    {myActivePlans.map((ap) => (
                      <View key={ap.id} style={s.activeCard}>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                          <View>
                            <Text style={{ color: '#fff', fontWeight: 'bold' }}>{ap.name}</Text>
                            <Text style={{ color: '#94a3b8', fontSize: 11, marginTop: 2 }}>Daily: <Text style={{ color: '#22c55e', fontWeight: 'bold' }}>+₹{ap.daily}</Text> | Left: {ap.daysLeft} Days</Text>
                          </View>
                          <TouchableOpacity style={s.claimBtn} onPress={() => handleClaimDailyProfit(ap)}>
                            <Text style={{ color: '#fff', fontSize: 11, fontWeight: 'bold' }}>💰 Collect</Text>
                          </TouchableOpacity>
                        </View>
                      </View>
                    ))}
                  </View>
                )}

                <View style={s.tabsRow}>
                  {['All', 'Weekly', '15 Days', '30 Days'].map((t) => (
                    <TouchableOpacity key={t} style={[s.tab, activeTab === t && s.tabActive]} onPress={() => setActiveTab(t)}>
                      <Text style={[s.tabTxt, activeTab === t && { color: '#fff', fontWeight: 'bold' }]}>{t}</Text>
                    </TouchableOpacity>
                  ))}
                </View>

                {filteredPlans.map((p) => (
                  <View key={p.id} style={s.planCard}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 }}>
                      <View style={s.badge}><Text style={{ color: '#f59e0b', fontSize: 11, fontWeight: 'bold' }}>{p.badge}</Text></View>
                      <Text style={{ color: '#94a3b8', fontSize: 11 }}>⏱ {p.duration}</Text>
                    </View>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                      <View>
                        <Text style={{ color: '#fff', fontSize: 15, fontWeight: 'bold' }}>{p.name}</Text>
                        <Text style={{ color: '#94a3b8', fontSize: 12 }}>Daily: <Text style={{ color: '#22c55e', fontWeight: 'bold' }}>₹{p.daily}</Text></Text>
                      </View>
                      <TouchableOpacity style={s.invBtn} onPress={() => handleInvest(p)}>
                        <Text style={{ color: '#000', fontWeight: 'bold', fontSize: 12 }}>Invest ₹{p.price}</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                ))}
              </>
            )}

            {bottomNav === 'History' && (
              <View style={s.card}>
                <Text style={s.secTitle}>Transaction & Plan History</Text>
                {history.map((h) => (
                  <View key={h.id} style={s.histRow}>
                    <View><Text style={{ color: '#fff', fontSize: 13 }}>{h.type}</Text><Text style={{ color: '#64748b', fontSize: 10 }}>{h.date}</Text></View>
                    <View style={{ alignItems: 'flex-end' }}>
                      <Text style={{ fontSize: 13, fontWeight: 'bold', color: h.amount.includes('+') ? '#22c55e' : '#fff' }}>{h.amount}</Text>
                      <Text style={{ color: '#94a3b8', fontSize: 10 }}>{h.status}</Text>
                    </View>
                  </View>
                ))}
              </View>
            )}

            {bottomNav === 'Invite' && (
              <View style={s.card}>
                <View style={s.badge}><Text style={{ color: '#f59e0b', fontSize: 11, fontWeight: 'bold' }}>🎉 30% BONUS</Text></View>
                <Text style={[s.secTitle, { marginTop: 8 }]}>Invite & Earn 30%</Text>
                <Text style={{ color: '#94a3b8', fontSize: 12, marginBottom: 10 }}>Solar Invest link share karein aur flat 30% direct bonus payen.</Text>
                <View style={s.linkBox}>
                  <Text style={{ color: '#94a3b8', fontSize: 10 }}>Official Invite Link:</Text>
                  <Text style={{ color: '#22c55e', fontWeight: 'bold', fontSize: 12 }} numberOfLines={1}>{referralLink}</Text>
                </View>
                <TouchableOpacity style={[s.btn, { backgroundColor: '#16a34a', marginVertical: 6, width: '100%' }]} onPress={handleShare}>
                  <Text style={s.btnTxt}>🚀 Share Invite Link (30% Bonus)</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[s.btn, { backgroundColor: '#0284c7', width: '100%' }]} onPress={openTelegram}>
                  <Text style={s.btnTxt}>✈️ Support (@Guri7412)</Text>
                </TouchableOpacity>
              </View>
            )}

            {bottomNav === 'Profile' && (
              <View style={s.card}>
                <Text style={s.secTitle}>User Dashboard</Text>
                <Text style={s.profTxt}>Total Balance: ₹{balance.toFixed(2)}</Text>
                <Text style={s.profTxt}>Running Plans: {myActivePlans.length}</Text>
                <TouchableOpacity style={[s.btn, { backgroundColor: '#0284c7', marginTop: 10, width: '100%' }]} onPress={openTelegram}>
                  <Text style={s.btnTxt}>✈️ 24/7 Support (@Guri7412)</Text>
                </TouchableOpacity>
              </View>
            )}
          </ScrollView>

          <View style={s.bottomNav}>
            {[
              { id: 'Invest', label: 'Invest', icon: '⚡' },
              { id: 'History', label: 'History', icon: '📋' },
              { id: 'Invite', label: 'Invite', icon: '🎁' },
              { id: 'Profile', label: 'Profile', icon: '👤' }
            ].map((item) => (
              <TouchableOpacity key={item.id} style={s.navItem} onPress={() => setBottomNav(item.id)}>
                <Text style={{ fontSize: 20, color: bottomNav === item.id ? '#f59e0b' : '#64748b', marginBottom: 2 }}>{item.icon}</Text>
                <Text style={{ fontSize: 11, color: bottomNav === item.id ? '#f59e0b' : '#94a3b8', fontWeight: 'bold' }}>{item.label}</Text>
              </TouchableOpacity>
            ))}
          </View>

        </View>
      </ImageBackground>

      {/* Recharge Modal with Direct PhonePe / Paytm Buttons */}
      <Modal visible={modalVisible} transparent={true} animationType="fade">
        <View style={s.modalOverlay}>
          <View style={s.modalBox}>
            <Text style={s.modalTitle}>Recharge & Payment</Text>
            
            <Text style={{ fontSize: 11, fontWeight: 'bold', color: '#334155', marginTop: 4 }}>Deposit Amount (₹):</Text>
            <TextInput style={s.input} placeholder="Amount" placeholderTextColor="#94a3b8" value={depositInputAmount} onChangeText={setDepositInputAmount} keyboardType="number-pad" />

            <Text style={{ fontSize: 11, fontWeight: 'bold', color: '#334155', marginTop: 4, marginBottom: 2 }}>Select UPI ID:</Text>
            <TouchableOpacity style={[s.upiOpt, selectedUpi === 'deepsingh7412@ibl' && s.upiActive]} onPress={() => setSelectedUpi('deepsingh7412@ibl')}>
              <Text style={{ fontSize: 12, fontWeight: 'bold', color: '#0f172a' }}>1. deepsingh7412@ibl</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[s.upiOpt, selectedUpi === 'mandeep7412@axl' && s.upiActive]} onPress={() => setSelectedUpi('mandeep7412@axl')}>
              <Text style={{ fontSize: 12, fontWeight: 'bold', color: '#0f172a' }}>2. mandeep7412@axl</Text>
            </TouchableOpacity>
            
            {/* 1-Click Redirect UPI Buttons */}
            <Text style={{ fontSize: 11, fontWeight: 'bold', color: '#334155', marginTop: 6, marginBottom: 4 }}>Fast Pay via App:</Text>
            <View style={{ flexDirection: 'row', gap: 8, marginBottom: 6 }}>
              <TouchableOpacity style={s.phonepeBtn} onPress={() => openUpiPayment('phonepe')}>
                <Text style={s.btnTxt}>🟣 PhonePe</Text>
              </TouchableOpacity>
              <TouchableOpacity style={s.paytmBtn} onPress={() => openUpiPayment('paytm')}>
                <Text style={s.btnTxt}>🔵 Paytm</Text>
              </TouchableOpacity>
            </View>

            <TextInput style={s.input} placeholder="Enter 12-digit UTR / Ref No." placeholderTextColor="#94a3b8" value={transactionId} onChangeText={setTransactionId} keyboardType="number-pad" />
            
            <TouchableOpacity style={[s.btn, { backgroundColor: '#16a34a', marginTop: 8, width: '100%', paddingVertical: 11 }]} onPress={handleDeposit}>
              <Text style={s.btnTxt}>Submit & Add Balance</Text>
            </TouchableOpacity>
            <TouchableOpacity style={{ alignItems: 'center', marginTop: 8 }} onPress={() => setModalVisible(false)}>
              <Text style={{ color: '#ef4444', fontSize: 12, fontWeight: 'bold' }}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Withdraw Modal */}
      <Modal visible={withdrawModalVisible} transparent={true} animationType="fade">
        <View style={s.modalOverlay}>
          <View style={s.modalBox}>
            <Text style={s.modalTitle}>Withdraw Balance</Text>
            <Text style={{ color: '#64748b', fontSize: 12, marginBottom: 8 }}>Available: <Text style={{ color: '#16a34a', fontWeight: 'bold' }}>₹{balance.toFixed(2)}</Text></Text>
            <TextInput style={s.input} placeholder="Amount (Min ₹200)" placeholderTextColor="#94a3b8" value={withdrawAmount} onChangeText={setWithdrawAmount} keyboardType="number-pad" />
            <TextInput style={s.input} placeholder="Your UPI ID" placeholderTextColor="#94a3b8" value={withdrawUpi} onChangeText={setWithdrawUpi} />
            <TouchableOpacity style={[s.btn, { backgroundColor: '#16a34a', marginTop: 8, width: '100%', paddingVertical: 11 }]} onPress={handleWithdraw}>
              <Text style={s.btnTxt}>Confirm Withdrawal</Text>
            </TouchableOpacity>
            <TouchableOpacity style={{ alignItems: 'center', marginTop: 8 }} onPress={() => setWithdrawModalVisible(false)}>
              <Text style={{ color: '#ef4444', fontSize: 12, fontWeight: 'bold' }}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0a101d' },
  bg: { flex: 1, width: '100%', height: '100%' },
  overlay: { flex: 1, backgroundColor: 'rgba(10, 16, 29, 0.88)' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 14, paddingTop: Platform.OS === 'android' ? 14 : 10, paddingBottom: 14, backgroundColor: 'rgba(14, 23, 38, 0.85)' },
  helpBtn: { backgroundColor: '#0284c7', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 16 },
  scroll: { paddingHorizontal: 14, paddingTop: 12, paddingBottom: 110 },
  card: { backgroundColor: 'rgba(27, 38, 59, 0.92)', borderRadius: 16, padding: 14, marginBottom: 12, borderWidth: 1, borderColor: '#2e3d5b' },
  btn: { borderRadius: 10, paddingVertical: 10, alignItems: 'center', justifyContent: 'center' },
  btnTxt: { color: '#fff', fontWeight: 'bold', fontSize: 12 },
  secTitle: { color: '#fff', fontSize: 14, fontWeight: 'bold', marginBottom: 6 },
  activeCard: { backgroundColor: 'rgba(22, 34, 53, 0.95)', borderRadius: 10, padding: 10, marginBottom
