import React, { useState } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, TextInput, Modal, Alert, SafeAreaView, StatusBar, Linking, Image, ImageBackground, Share } from 'react-native';

export default function App() {
  const [balance, setBalance] = useState(1100.0);
  const [activeTab, setActiveTab] = useState('All');
  const [bottomNav, setBottomNav] = useState('Invest');
  const [modalVisible, setModalVisible] = useState(false);
  const [withdrawModalVisible, setWithdrawModalVisible] = useState(false);
  const [depositAmount, setDepositAmount] = useState('500');
  const [selectedUpi, setSelectedUpi] = useState('deepsingh7412@ibl');
  const [transactionId, setTransactionId] = useState('');
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [withdrawUpi, setWithdrawUpi] = useState('');
  const [myActivePlans, setMyActivePlans] = useState([]);
  const [history, setHistory] = useState([{ id: '1', type: 'Welcome Bonus', amount: '₹1100.00', status: 'Completed', date: 'Initial' }]);

  const refLink = 'https://solarinvest.in/register?ref=Guri7412';

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
    const url = app === 'phonepe' ? `phonepe://pay?pa=${selectedUpi}&pn=SolarInvest&am=${amt}&cu=INR` : (app === 'paytm' ? `paytmmp://pay?pa=${selectedUpi}&pn=SolarInvest&am=${amt}&cu=INR` : generic);
    Linking.openURL(url).catch(() => Linking.openURL(generic).catch(() => Alert.alert('UPI Error', 'UPI app open nahi ho paya.')));
  };

  const handleShare = async () => {
    try { await Share.share({ message: `🔥 Solar Invest website par join karein aur flat 30% Bonus payen!\nRegistration: ${refLink}` }); } catch (e) {}
  };

  const handleInvest = (p) => {
    if (balance < p.price) {
      return Alert.alert('Low Balance', `₹${p.price} recharge karein.`, [
        { text: 'Cancel' },
        { text: 'Recharge', onPress: () => { setDepositAmount(p.price.toString()); setModalVisible(true); } }
      ]);
    }
    setBalance(prev => prev - p.price);
    setMyActivePlans([{ id: Date.now().toString(), name: p.name, price: p.price, daily: p.daily, daysLeft: p.daysCount, date: new Date().toLocaleDateString('en-GB') }, ...myActivePlans]);
    setHistory([{ id: Date.now().toString(), type: `Invest: ${p.name}`, amount: `-₹${p.price}`, status: 'Running', date: new Date().toLocaleDateString('en-GB') }, ...history]);
    Alert.alert('Success', `${p.name} activate ho gaya!`);
  };

  const handleDeposit = () => {
    if (!transactionId.trim() || transactionId.length < 6) return Alert.alert('Required', 'Valid 12-digit UTR enter karein.');
    const amt = Number(depositAmount) > 0 ? Number(depositAmount) : 500;
    setBalance(prev => prev + amt);
    setHistory([{ id: Date.now().toString(), type: 'Recharge (UPI)', amount: `+₹${amt}`, status: 'Success', date: new Date().toLocaleDateString('en-GB') }, ...history]);
    Alert.alert('Success', `₹${amt} wallet me add ho gaye!`);
    setModalVisible(false);
    setTransactionId('');
  };

  const handleClaim = (p) => {
    setBalance(prev => prev + p.daily);
    setHistory([{ id: Date.now().toString(), type: `Income: ${p.name}`, amount: `+₹${p.daily}`, status: 'Credited', date: new Date().toLocaleDateString('en-GB') }, ...history]);
    Alert.alert('Profit Added', `₹${p.daily} wallet me add ho gaye!`);
  };

  const handleWithdraw = () => {
    if (!withdrawAmount || Number(withdrawAmount) < 200) return Alert.alert('Invalid', 'Min withdrawal ₹200');
    if (!withdrawUpi.trim()) return Alert.alert('Required', 'UPI ID enter karein');
    if (Number(withdrawAmount) > balance) return Alert.alert('Error', 'Insufficient balance');
    setBalance(prev => prev - Number(withdrawAmount));
    setHistory([{ id: Date.now().toString(), type: `Withdraw (${withdrawUpi})`, amount: `-₹${withdrawAmount}`, status: 'Processing', date: new Date().toLocaleDateString('en-GB') }, ...history]);
    Alert.alert('Success', `₹${withdrawAmount} withdrawal request submit ho gayi.`);
    setWithdrawModalVisible(false);
    setWithdrawAmount('');
    setWithdrawUpi('');
  };

  return (
    <SafeAreaView style={s.c}>
      <StatusBar barStyle="light-content" backgroundColor="#0a101d" />
      <ImageBackground source={{ uri: 'https://images.unsplash.com/photo-1509391365360-2e959784a276?q=80&w=1080&auto=format&fit=crop' }} style={s.bg} resizeMode="cover">
        <View style={s.ov}>
          
          <View style={s.hdr}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Image source={require('./icon.png')} style={{ width: 34, height: 34, borderRadius: 8, marginRight: 8 }} />
              <View>
                <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#fff' }}>SOLAR <Text style={{ color: '#f59e0b' }}>INVEST</Text></Text>
                <Text style={{ fontSize: 10, color: '#94a3b8' }}>Clean Energy Growth</Text>
              </View>
            </View>
            <TouchableOpacity style={s.supBtn} onPress={openSupport}>
              <Text style={s.bTxt}>✈️ @Guri7412</Text>
            </TouchableOpacity>
          </View>

          <ScrollView contentContainerStyle={{ padding: 14, paddingBottom: 110 }} showsVerticalScrollIndicator={false}>
            {bottomNav === 'Invest' && (
              <>
                <View style={s.card}>
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                    <Text style={{ color: '#94a3b8', fontSize: 11, fontWeight: '700' }}>TOTAL WALLET BALANCE</Text>
                    <Text style={{ color: '#22c55e', fontSize: 12, fontWeight: 'bold' }}>● Active</Text>
                  </View>
                  <Text style={{ fontSize: 32, fontWeight: 'bold', color: '#fff', marginVertical: 8 }}>₹{balance.toFixed(2)}</Text>
                  <View style={{ flexDirection: 'row', gap: 10 }}>
                    <TouchableOpacity style={[s.btn, { backgroundColor: '#16a34a' }]} onPress={() => { setDepositAmount('500'); setModalVisible(true); }}>
                      <Text style={s.bTxt}>⚡ + Recharge</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[s.btn, { backgroundColor: '#2e3d5b' }]} onPress={() => setWithdrawModalVisible(true)}>
                      <Text style={s.bTxt}>↗ Withdraw</Text>
                    </TouchableOpacity>
                  </View>
                </View>

                {myActivePlans.length > 0 && (
                  <View style={{ marginBottom: 12 }}>
                    <Text style={s.tit}>⚡ Running Investments ({myActivePlans.length})</Text>
                    {myActivePlans.map((ap) => (
                      <View key={ap.id} style={s.actCard}>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                          <View>
                            <Text style={{ color: '#fff', fontWeight: 'bold' }}>{ap.name}</Text>
                            <Text style={{ color: '#94a3b8', fontSize: 11 }}>Daily: <Text style={{ color: '#22c55e', fontWeight: 'bold' }}>+₹{ap.daily}</Text> | Left: {ap.daysLeft} Days</Text>
                          </View>
                          <TouchableOpacity style={s.clmBtn} onPress={() => handleClaim(ap)}>
                            <Text style={{ color: '#fff', fontSize: 11, fontWeight: 'bold' }}>💰 Collect</Text>
                          </TouchableOpacity>
                        </View>
                      </View>
                    ))}
                  </View>
                )}

                <View style={s.tRow}>
                  {['All', 'Weekly', '15 Days', '30 Days'].map((t) => (
                    <TouchableOpacity key={t} style={[s.tab, activeTab === t && s.tabAct]} onPress={() => setActiveTab(t)}>
                      <Text style={[s.tTxt, activeTab === t && { color: '#fff', fontWeight: 'bold' }]}>{t}</Text>
                    </TouchableOpacity>
                  ))}
                </View>

                {filtered.map((p) => (
                  <View key={p.id} style={s.card}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 }}>
                      <View style={s.bdg}><Text style={{ color: '#f59e0b', fontSize: 11, fontWeight: 'bold' }}>{p.badge}</Text></View>
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
                <Text style={s.tit}>Transaction History</Text>
                {history.map((h) => (
                  <View key={h.id} style={s.hRow}>
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
                <View style={s.bdg}><Text style={{ color: '#f59e0b', fontSize: 11, fontWeight: 'bold' }}>🎉 30% BONUS</Text></View>
                <Text style={[s.tit, { marginTop: 8 }]}>Invite & Earn 30% Bonus</Text>
                <Text style={{ color: '#94a3b8', fontSize: 12, marginBottom: 10 }}>Solar Invest official link share karein aur 30% direct bonus payen.</Text>
                <View style={s.lBox}>
                  <Text style={{ color: '#94a3b8', fontSize: 10 }}>Website Invite Link:</Text>
                  <Text style={{ color: '#22c55e', fontWeight: 'bold', fontSize: 12 }} numberOfLines={1}>{refLink}</Text>
                </View>
                <TouchableOpacity style={[s.btn, { backgroundColor: '#16a34a', marginVertical: 6 }]} onPress={handleShare}>
                  <Text style={s.bTxt}>🚀 Share Invite Link (30% Bonus)</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[s.btn, { backgroundColor: '#0284c7' }]} onPress={openSupport}>
                  <Text style={s.bTxt}>✈️ Support (@Guri7412)</Text>
                </TouchableOpacity>
              </View>
            )}

            {bottomNav === 'Profile' && (
              <View style={s.card}>
                <Text style={s.tit}>User Dashboard</Text>
                <Text style={s.pTxt}>Total Balance: ₹{balance.toFixed(2)}</Text>
                <Text style={s.pTxt}>Running Plans: {myActivePlans.length}</Text>
                <TouchableOpacity style={[s.btn, { backgroundColor: '#0284c7', marginTop: 10 }]} onPress={openSupport}>
                  <Text style={s.bTxt}>✈️ 24/7 Support (@Guri7412)</Text>
                </TouchableOpacity>
              </View>
            )}
          </ScrollView>

          <View style={s.bNav}>
            {[
              { id: 'Invest', l: 'Invest', i: '⚡' },
              { id: 'History', l: 'History', i: '📋' },
              { id: 'Invite', l: 'Invite', i: '🎁' },
              { id: 'Profile', l: 'Profile', i: '👤' }
            ].map((item) => (
              <TouchableOpacity key={item.id} style={{ alignItems: 'center', flex: 1 }} onPress={() => setBottomNav(item.id)}>
                <Text style={{ fontSize: 20, color: bottomNav === item.id ? '#f59e0b' : '#64748b' }}>{item.i}</Text>
                <Text style={{ fontSize: 11, color: bottomNav === item.id ? '#f59e0b' : '#94a3b8', fontWeight: 'bold' }}>{item.l}</Text>
              </TouchableOpacity>
            ))}
          </View>

        </View>
      </ImageBackground>

      {/* Recharge Modal */}
      <Modal visible={modalVisible} transparent={true} animationType="fade">
        <View style={s.mOv}>
          <View style={s.mBox}>
            <Text style={s.mTit}>Recharge & Payment</Text>
            <Text style={{ fontSize: 11, fontWeight: 'bold', color: '#334155' }}>Amount (₹):</Text>
            <TextInput style={s.inp} placeholder="Amount" value={depositAmount} onChangeText={setDepositAmount} keyboardType="number-pad" />
            <Text style={{ fontSize: 11, fontWeight: 'bold', color: '#334155', marginTop: 4 }}>Select UPI ID:</Text>
            <TouchableOpacity style={[s.uOpt, selectedUpi === 'deepsingh7412@ibl' && s.uAct]} onPress={() => setSelectedUpi('deepsingh7412@ibl')}>
              <Text style={{ fontSize: 12, fontWeight: 'bold', color: '#0f172a' }}>1. deepsingh7412@ibl</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[s.uOpt, selectedUpi === 'mandeep7412@axl' && s.uAct]} onPress={() => setSelectedUpi('mandeep7412@axl')}>
              <Text style={{ fontSize: 12, fontWeight: 'bold', color: '#0f172a' }}>2. mandeep7412@axl</Text>
            </TouchableOpacity>
            <Text style={{ fontSize: 11, fontWeight: 'bold', color: '#334155', marginTop: 4 }}>Fast Pay via App:</Text>
            <View style={{ flexDirection: 'row', gap: 8, marginVertical: 4 }}>
              <TouchableOpacity style={s.phBtn} onPress={() => openUpi('phonepe')}><Text style={s.bTxt}>🟣 PhonePe</Text></TouchableOpacity>
              <TouchableOpacity style={s.ptBtn} onPress={() => openUpi('paytm')}><Text style={s.bTxt}>🔵 Paytm</Text></TouchableOpacity>
            </View>
            <TextInput style={s.inp} placeholder="Enter 12-digit UTR No." value={transactionId} onChangeText={setTransactionId} keyboardType="number-pad" />
            <TouchableOpacity style={[s.btn, { backgroundColor: '#16a34a', marginTop: 8, paddingVertical: 11 }]} onPress={handleDeposit}>
              <Text style={s.bTxt}>Submit & Add Balance</Text>
            </TouchableOpacity>
            <TouchableOpacity style={{ alignItems: 'center', marginTop: 8 }} onPress={() => setModalVisible(false)}>
              <Text style={{ color: '#ef4444', fontSize: 12, fontWeight: 'bold' }}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Withdraw Modal */}
      <Modal visible={withdrawModalVisible} transparent={true} animationType="fade">
        <View style={s.mOv}>
          <View style={s.mBox}>
            <Text style={s.mTit}>Withdraw Balance</Text>
            <Text style={{ color: '#64748b', fontSize: 12, marginBottom: 8 }}>Available: <Text style={{ color: '#16a34a', fontWeight: 'bold' }}>₹{balance.toFixed(2)}</Text></Text>
            <TextInput style={s.inp} placeholder="Amount (Min ₹200)" value={withdrawAmount} onChangeText={setWithdrawAmount} keyboardType="number-pad" />
            <TextInput style={s.inp} placeholder="Your UPI ID" value={withdrawUpi} onChangeText={setWithdrawUpi} />
            <TouchableOpacity style={[s.btn, { backgroundColor: '#16a34a', marginTop: 8, paddingVertical: 11 }]} onPress={handleWithdraw}>
              <Text style={s.bTxt}>Confirm Withdrawal</Text>
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
  c: { flex: 1, backgroundColor: '#0a101d' },
  bg: { flex: 1, width: '100%', height: '100%' },
  ov: { flex: 1, backgroundColor: 'rgba(10, 16, 29, 0.88)' },
  hdr: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 14, paddingTop: 12, paddingBottom: 12, backgroundColor: 'rgba(14, 23, 38, 0.85)' },
  supBtn: { backgroundColor: '#0284c7', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 16 },
  card: { backgroundColor: 'rgba(27, 38, 59, 0.92)', borderRadius: 14, padding: 14, marginBottom: 10, borderWidth: 1, borderColor: '#2e3d5b' },
  btn: { borderRadius: 10, paddingVertical: 10, alignItems: 'center', justifyContent: 'center', flex: 1 },
  bTxt: { color: '#fff', fontWeight: 'bold', fontSize: 12 },
  tit: { color: '#fff', fontSize: 14, fontWeight: 'bold', marginBottom: 6 },
  actCard: { backgroundColor: 'rgba(22, 34, 53, 0.95)', borderRadius: 10, padding: 10, marginBottom: 6, borderWidth: 1, borderColor: '#22c55e' },
  clmBtn: { backgroundColor: '#16a34a', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 8 },
  tRow: { flexDirection: 'row', backgroundColor: 'rgba(22, 34, 53, 0.85)', borderRadius: 10, padding: 3, marginBottom: 10 },
  tab: { flex: 1, paddingVertical: 6, alignItems: 'center', borderRadius: 8 },
  tabAct: { backgroundColor: '#f59e0b' },
  tTxt: { color: '#94a3b8', fontSize: 11 },
  bdg: { backgroundColor: '#1e293b', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 6, alignSelf: 'flex-start' },
  invBtn: { backgroundColor: '#f59e0b', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 8 },
  hRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: '#334155' },
  lBox: { backgroundColor: '#0f172a', padding: 8, borderRadius: 8, marginBottom: 8 },
  pTxt: { color: '#e2e8f0', fontSize: 12, marginBottom: 6 },
  phBtn: { flex: 1, backgroundColor: '#5f259f', paddingVertical: 8, borderRadius: 8, alignItems: 'center' },
  ptBtn: { flex: 1, backgroundColor: '#00baf2', paddingVertical: 8, borderRadius: 8, alignItems: 'center' },
  bNav: { position: 'absolute', bottom: 0, left: 0, right: 0, height: 70, paddingBottom: 14, paddingTop: 8, backgroundColor: '#0c1322', flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', borderTopWidth: 1, borderTopColor: '#1e293b' },
  mOv: { fl
