import React, { useState } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, TextInput, Modal, Alert, SafeAreaView, StatusBar, Linking, Image } from 'react-native';

export default function App() {
  const [balance, setBalance] = useState(1100.00);
  const [activeTab, setActiveTab] = useState('All');
  const [bottomNav, setBottomNav] = useState('Invest');
  const [modalVisible, setModalVisible] = useState(false);
  const [withdrawModalVisible, setWithdrawModalVisible] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [selectedUpi, setSelectedUpi] = useState('deepsingh7412@ibl');
  const [transactionId, setTransactionId] = useState('');
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [withdrawUpi, setWithdrawUpi] = useState('');

  const plans = [
    { id: 1, badge: '🔥 Hot', duration: '15 Days', name: 'Solar Micro 15D', price: 200, daily: 25, category: '15 Days' },
    { id: 2, badge: '⭐ Popular', duration: '15 Days', name: 'Solar Mini 15D', price: 400, daily: 55, category: '15 Days' },
    { id: 3, badge: '🚀 High Return', duration: '15 Days', name: 'Solar Boost 15D', price: 800, daily: 120, category: '15 Days' },
    { id: 4, badge: '🌱 Stable', duration: '30 Days', name: 'Solar Plant 30D', price: 1500, daily: 240, category: '30 Days' },
    { id: 5, badge: '👑 Mega Yield', duration: '30 Days', name: 'Solar Farm Max', price: 3000, daily: 520, category: '30 Days' }
  ];

  const filteredPlans = activeTab === 'All' ? plans : plans.filter(p => p.category === activeTab);

  const openWhatsApp = () => {
    Linking.openURL('https://wa.me/917412881011?text=Hello%20Solar%20Invest%20Support').catch(() => {
      Alert.alert('Customer Support', 'Contact WhatsApp: +91 7412881011');
    });
  };

  const handleDeposit = () => {
    if (!transactionId.trim()) {
      Alert.alert('Required', 'Kripya 12-digit UTR / Ref No. dalein');
      return;
    }
    Alert.alert('Submitted', 'Payment receive ho gaya hai. Verification ke baad add ho jayega.');
    setModalVisible(false);
    setTransactionId('');
  };

  const handleWithdraw = () => {
    if (!withdrawAmount || Number(withdrawAmount) < 200) {
      Alert.alert('Invalid', 'Minimum withdrawal ₹200 hai.');
      return;
    }
    if (!withdrawUpi.trim()) {
      Alert.alert('Required', 'Apna UPI ID dalein.');
      return;
    }
    if (Number(withdrawAmount) > balance) {
      Alert.alert('Error', 'Insufficient Balance');
      return;
    }
    setBalance(b => b - Number(withdrawAmount));
    Alert.alert('Success', `₹${withdrawAmount} withdrawal request submit ho gayi hai.`);
    setWithdrawModalVisible(false);
    setWithdrawAmount('');
    setWithdrawUpi('');
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0e1726" />
      
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Image source={require('./icon.png')} style={styles.logo} />
          <View>
            <Text style={styles.title}>SOLAR <Text style={{ color: '#f59e0b' }}>INVEST</Text></Text>
            <Text style={styles.subtitle}>Clean Energy Growth</Text>
          </View>
        </View>
        <TouchableOpacity style={styles.helpBtn} onPress={openWhatsApp}>
          <Text style={styles.helpBtnText}>🎧 Help</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scroll}>
        {bottomNav === 'Invest' && (
          <>
            {/* Wallet Box */}
            <View style={styles.walletCard}>
              <View style={styles.walletTop}>
                <Text style={styles.walletLabel}>TOTAL WALLET BALANCE</Text>
                <Text style={styles.activeTag}>● Active</Text>
              </View>
              <Text style={styles.walletAmount}>₹{balance.toFixed(2)}</Text>
              <View style={styles.btnRow}>
                <TouchableOpacity style={styles.rechargeBtn} onPress={() => { setSelectedPlan({ name: 'Recharge', price: 500 }); setModalVisible(true); }}>
                  <Text style={styles.btnTxtWhite}>⚡ + Recharge</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.withdrawBtn} onPress={() => setWithdrawModalVisible(true)}>
                  <Text style={styles.btnTxtWhite}>↗ Withdraw</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Filter Tabs */}
            <View style={styles.tabRow}>
              {['All', '15 Days', '30 Days'].map(t => (
                <TouchableOpacity key={t} style={[styles.tab, activeTab === t && styles.tabActive]} onPress={() => setActiveTab(t)}>
                  <Text style={[styles.tabTxt, activeTab === t && styles.tabTxtActive]}>{t === 'All' ? 'All Plans' : t}</Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Plans */}
            {filteredPlans.map(p => (
              <View key={p.id} style={styles.planCard}>
                <View style={styles.planHeader}>
                  <Text style={styles.badge}>{p.badge}</Text>
                  <Text style={styles.duration}>⏱ {p.duration}</Text>
                </View>
                <View style={styles.planRow}>
                  <View>
                    <Text style={styles.planName}>{p.name}</Text>
                    <Text style={styles.planDaily}>Daily Earning: <Text style={{ color: '#22c55e', fontWeight: 'bold' }}>₹{p.daily}</Text></Text>
                  </View>
                  <TouchableOpacity style={styles.investBtn} onPress={() => { setSelectedPlan(p); setModalVisible(true); }}>
                    <Text style={styles.investBtnText}>Invest ₹{p.price}</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </>
        )}

        {bottomNav === 'Invite' && (
          <View style={styles.centerBox}>
            <Text style={styles.centerHeading}>Invite & Earn 10%</Text>
            <TouchableOpacity style={styles.whatsappBtn} onPress={openWhatsApp}>
              <Text style={styles.btnTxtWhite}>🎁 Share Referral Code</Text>
            </TouchableOpacity>
          </View>
        )}

        {bottomNav === 'Help' && (
          <View style={styles.centerBox}>
            <Text style={styles.centerHeading}>24/7 Official Support</Text>
            <TouchableOpacity style={styles.whatsappBtn} onPress={openWhatsApp}>
              <Text style={styles.btnTxtWhite}>💬 WhatsApp: +91 7412881011</Text>
            </TouchableOpacity>
          </View>
        )}

        {bottomNav === 'Profile' && (
          <View style={styles.centerBox}>
            <Text style={styles.centerHeading}>My Account</Text>
            <Text style={styles.profileText}>Balance: ₹{balance.toFixed(2)}</Text>
            <Text style={styles.profileText}>Status: Verified Investor</Text>
          </View>
        )}
      </ScrollView>

      {/* Bottom Nav */}
      <View style={styles.bottomNav}>
        {[
          { id: 'Invest', label: 'Invest', icon: '⚡' },
          { id: 'Invite', label: 'Invite', icon: '🎁' },
          { id: 'Help', label: 'Help', icon: '🎧' },
          { id: 'Profile', label: 'Profile', icon: '👤' }
        ].map(n => (
          <TouchableOpacity key={n.id} style={styles.navItem} onPress={() => n.id === 'Help' ? openWhatsApp() : setBottomNav(n.id)}>
            <Text style={[styles.navIcon, bottomNav === n.id && styles.activeNav]}>{n.icon}</Text>
            <Text style={[styles.navLabel, bottomNav === n.id && styles.activeNav]}>{n.label}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Deposit Modal */}
      <Modal visible={modalVisible} transparent={true} animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modal}>
            <Text style={styles.modalTitle}>Deposit / Recharge</Text>
            {selectedPlan && <Text style={styles.modalSub}>{selectedPlan.name} - ₹{selectedPlan.price}</Text>}

            <Text style={styles.label}>Select UPI ID:</Text>
            <TouchableOpacity style={[styles.upiChoice, selectedUpi === 'deepsingh7412@ibl' && styles.upiChoiceActive]} onPress={() => setSelectedUpi('deepsingh7412@ibl')}>
              <Text style={styles.upiTxt}>1. deepsingh7412@ibl</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.upiChoice, selectedUpi === 'mandeep7412@axl' && styles.upiChoiceActive]} onPress={() => setSelectedUpi('mandeep7412@axl')}>
              <Text style={styles.upiTxt}>2. mandeep7412@axl</Text>
            </TouchableOpacity>

            <TextInput style={styles.input} placeholder="Enter 12-digit UTR / Ref No." placeholderTextColor="#94a3b8" value={transactionId} onChangeText={setTransactionId} keyboardType="number-pad" />
            <TouchableOpacity style={styles.submitBtn} onPress={handleDeposit}><Text style={styles.btnTxtWhite}>Submit Payment</Text></TouchableOpacity>
            <TouchableOpacity style={styles.cancelBtn} onPress={() => setModalVisible(false)}><Text style={styles.cancelTxt}>Cancel</Text></TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Withdraw Modal */}
      <Modal visible={withdrawModalVisible} transparent={true} animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modal}>
            <Text style={styles.modalTitle}>Withdraw Balance</Text>
            <Text style={styles.modalSub}>Available: ₹{balance.toFixed(2)}</Text>
            <TextInput style={styles.input} placeholder="Amount (Min ₹200)" placeholderTextColor="#94a3b8" value={withdrawAmount} onChangeText={setWithdrawAmount} keyboardType="number-pad" />
            <TextInput style={styles.input} placeholder="Enter UPI ID" placeholderTextColor="#94a3b8" value={withdrawUpi} onChangeText={setWithdrawUpi} />
            <TouchableOpacity style={styles.submitBtn} onPress={handleWithdraw}><Text style={styles.btnTxtWhite}>Confirm Withdrawal</Text></TouchableOpacity>
            <TouchableOpacity style={styles.cancelBtn} onPress={() => setWithdrawModalVisible(false)}><Text style={styles.cancelTxt}>Cancel</Text></TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0e1726' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16, backgroundColor: '#0e1726' },
  headerLeft: { flexDirection: 'row', alignItems: 'center' },
  logo: { width: 36, height: 36, borderRadius: 8, marginRight: 10 },
  title: { fontSize: 20, fontWeight: 'bold', color: '#fff' },
  subtitle: { fontSize: 11, color: '#94a3b8' },
  helpBtn: { backgroundColor: '#0284c7', paddingHorizontal: 14, paddingVertical: 6, borderRadius: 20 },
  helpBtnText: { color: '#fff', fontWeight: 'bold', fontSize: 13 },
  scroll: { padding: 16, paddingBottom: 85 },
  walletCard: { backgroundColor: '#1b263b', borderRadius: 20, padding: 18, marginBottom: 16, borderWidth: 1, borderColor: '#2e3d5b' },
  walletTop: { flexDirection: 'row', justifyContent: 'space-between' },
  walletLabel: { color: '#94a3b8', fontSize: 12, fontWeight: 'bold' },
  activeTag: { color: '#22c55e', fontSize: 12, fontWeight: 'bold' },
  walletAmount: { fontSize: 34, fontWeight: 'bold', color: '#fff', marginVertical: 12 },
  btnRow: { flexDirection: 'row', gap: 10 },
  rechargeBtn: { flex: 1, backgroundColor: '#16a34a', padding: 12, borderRadius: 12, alignItems: 'center' },
  withdrawBtn: { flex: 1, backgroundColor: '#2e3d5b', padding: 12, borderRadius: 12, alignItems: 'center' },
  btnTxtWhite: { color: '#fff', fontWeight: 'bold', fontSize: 14 },
  tabRow: { flexDirection: 'row', backgroundColor: '#162235', borderRadius: 12, padding: 4, marginBottom: 14 },
  tab: { flex: 1, paddingVertical: 8, alignItems: 'center', borderRadius: 8 },
  tabActive: { backgroundColor: '#2563eb' },
  tabTxt: { color: '#94a3b8', fontSize: 13, fontWeight: '600' },
  tabTxtActive: { color: '#fff', fontWeight: 'bold' },
  planCard: { backgroundColor: '#1b263b', borderRadius: 16, padding: 14, marginBottom: 12, borderWidth: 1, borderColor: '#2e3d5b' },
  planHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  badge: { color: '#fbbf24', fontSize: 11, fontWeight: 'bold' },
  duration: { color: '#94a3b8', fontSize: 12 },
  planRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  planName: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  planDaily: { color: '#94a3b8', fontSize: 12, marginTop: 2 },
  investBtn: { backgroundColor: '#2563eb', paddingHorizontal: 16, paddingVertical: 10, borderRadius: 10 },
  investBtnText: { color: '#fff', fontWeight: 'bold', fontSize: 13 },
  centerBox: { backgroundColor: '#1b263b', borderRadius: 16, padding: 24, alignItems: 'center', marginTop: 20 },
  centerHeading: { color: '#fff', fontSize: 18, fontWeight: 'bold', marginBottom: 10 },
  profileText: { color: '#cbd5e1', fontSize: 14, marginBottom: 6 },
  whatsappBtn: { backgroundColor: '#25d366', padding: 12, borderRadius: 10, width: '100%', alignItems: 'center', marginTop: 10 },
  bottomNav: { position: 'absolute', bottom: 0, left: 0, right: 0, height: 60, backgroundColor: '#0a101d', flexDirection: 'row', borderTopWidth: 1, borderColor: '#1e293b' },
  navItem: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  navIcon: { fontSize: 18, color: '#64748b' },
  navLabel: { fontSize: 10, color: '#64748b', marginTop: 2 },
  activeNav: { color: '#38bdf8' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.7)', justifyContent: 'center', alignItems: 'center', padding: 20 },
  modal: { backgroundColor: '#fff', borderRadius: 16, padding: 20, width: '100%', maxWidth: 340 },
  modalTitle: { fontSize: 18, fontWeight: 'bold', color: '#0f172a', textAlign: 'center' },
  modalSub: { fontSize: 13, color: '#64748b', textAlign: 'center', marginVertical: 8 },
  label: { fontSize: 12, fontWeight: 'bold', color: '#475569', marginBottom: 6 },
  upiChoice: { padding: 10, borderWidth: 1, borderColor: '#cbd5e1', borderRadius: 8, marginBottom: 8 },
  upiChoiceActive: { borderColor: '#16a34a', backgroundColor: '#f0fdf4' },
  upiTxt: { fontSize: 13, color: '#0f172a', fontWeight: '600' },
  input: { backgroundColor: '#f8fafc', borderWidth: 1, borderColor: '#cbd5e1', borderRadius: 8, padding: 10, fontSize: 14, marginVertical: 8, color: '#0f172a' },
  submitBtn: { backgroundColor: '#16a34a', padding: 12, borderRadius: 10, alignItems: 'center', marginTop: 6 },
  cancelBtn: { marginTop: 8, alignItems: 'center', padding: 6 },
  cancelTxt: { color: '#64748b', fontWeight: '600' },
});
    
