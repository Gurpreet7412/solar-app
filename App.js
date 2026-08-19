import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  StatusBar,
  Modal,
  TextInput,
  Alert,
  Linking,
  Image
} from 'react-native';

export default function App() {
  const [balance, setBalance] = useState(1300);
  const [activeTab, setActiveTab] = useState('all');
  const [activeNav, setActiveNav] = useState('home');

  // Modals state
  const [rechargeModal, setRechargeModal] = useState(false);
  const [withdrawModal, setWithdrawModal] = useState(false);
  const [supportModal, setSupportModal] = useState(false);

  // Recharge Form State
  const [rechargeAmount, setRechargeAmount] = useState('');
  const [utrNumber, setUtrNumber] = useState('');

  // Withdraw Form State
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [upiId, setUpiId] = useState('');

  const upiAddress = "payment@upi"; // Yahan apni UPI ID badal sakte hain
  const telegramSupportUrl = "https://t.me/your_support_handle"; // Yahan Telegram link badal sakte hain

  const plans = [
    { id: 1, name: 'Solar Micro 15D', daily: '₹25', days: '15 Days', price: 200, type: '15days', tag: '🔥 Hot' },
    { id: 2, name: 'Solar Mini 15D', daily: '₹55', days: '15 Days', price: 400, type: '15days', tag: '⭐ Popular' },
    { id: 3, name: 'Solar Boost 15D', daily: '₹120', days: '15 Days', price: 800, type: '15days', tag: '🚀 High Return' },
    { id: 4, name: 'Solar Starter 30D', daily: '₹20', days: '30 Days', price: 300, type: 'monthly', tag: '🌱 Stable' },
    { id: 5, name: 'Solar Standard 30D', daily: '₹40', days: '30 Days', price: 500, type: 'monthly', tag: '💎 Best Value' },
    { id: 6, name: 'Solar Pro 30D', daily: '₹90', days: '30 Days', price: 1000, type: 'monthly', tag: '👑 VIP' },
  ];

  const filteredPlans = plans.filter((plan) => {
    if (activeTab === 'all') return true;
    return plan.type === activeTab;
  });

  const handleInvest = (price, name) => {
    if (balance >= price) {
      setBalance(balance - price);
      Alert.alert('Success', `Successfully invested in ${name}!`);
    } else {
      Alert.alert('Insufficient Balance', 'Please recharge your wallet first.');
    }
  };

  const handleRechargeSubmit = () => {
    if (!rechargeAmount || !utrNumber) {
      Alert.alert('Error', 'Please enter Amount and 12-digit UTR Number');
      return;
    }
    Alert.alert(
      'Recharge Submitted',
      `Payment of ₹${rechargeAmount} with UTR: ${utrNumber} submitted for verification. Balance will update shortly.`,
      [{ text: 'OK', onPress: () => { setRechargeModal(false); setRechargeAmount(''); setUtrNumber(''); } }]
    );
  };

  const handleWithdrawSubmit = () => {
    const amt = parseFloat(withdrawAmount);
    if (!amt || amt <= 0) {
      Alert.alert('Error', 'Please enter a valid amount');
      return;
    }
    if (amt > balance) {
      Alert.alert('Error', 'Withdrawal amount exceeds balance');
      return;
    }
    if (!upiId) {
      Alert.alert('Error', 'Please enter your UPI ID');
      return;
    }

    setBalance(balance - amt);
    Alert.alert('Success', `Withdrawal request for ₹${amt} submitted!`);
    setWithdrawModal(false);
    setWithdrawAmount('');
    setUpiId('');
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0f172a" />

      {/* Header with App Logo */}
      <View style={styles.header}>
        <View style={styles.logoBadge}>
          <Image
            source={{ uri: 'https://api.dicebear.com/7.x/shapes/png?seed=SolarInvest&backgroundColor=0f172a&shape1Color=facc15&shape2Color=2563eb&size=200' }}
            style={styles.logoImg}
          />
          <View>
            <Text style={styles.logoTitle}>SOLAR <Text style={styles.logoAccent}>INVEST</Text></Text>
            <Text style={styles.logoSubtitle}>Clean Energy Growth</Text>
          </View>
        </View>

        <TouchableOpacity
          style={styles.supportButton}
          onPress={() => setSupportModal(true)}
        >
          <Text style={styles.supportButtonText}>🎧 Help</Text>
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Wallet Balance Hero Card */}
        <View style={styles.walletCard}>
          <View style={styles.walletGlow} />
          <View style={styles.walletHeader}>
            <Text style={styles.walletLabel}>TOTAL WALLET BALANCE</Text>
            <Text style={styles.walletTag}>● Active</Text>
          </View>
          <Text style={styles.walletAmount}>₹{balance.toFixed(2)}</Text>
          
          <View style={styles.walletActionRow}>
            <TouchableOpacity
              style={[styles.walletBtn, styles.rechargeBtn]}
              onPress={() => setRechargeModal(true)}
            >
              <Text style={styles.walletBtnText}>⚡ + Recharge</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.walletBtn, styles.withdrawBtn]}
              onPress={() => setWithdrawModal(true)}
            >
              <Text style={styles.walletBtnText}>↗ Withdraw</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Tab Filters */}
        <View style={styles.tabContainer}>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'all' && styles.activeTab]}
            onPress={() => setActiveTab('all')}
          >
            <Text style={[styles.tabText, activeTab === 'all' && styles.activeTabText]}>All Plans</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, activeTab === '15days' && styles.activeTab]}
            onPress={() => setActiveTab('15days')}
          >
            <Text style={[styles.tabText, activeTab === '15days' && styles.activeTabText]}>15 Days</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'monthly' && styles.activeTab]}
            onPress={() => setActiveTab('monthly')}
          >
            <Text style={[styles.tabText, activeTab === 'monthly' && styles.activeTabText]}>30 Days</Text>
          </TouchableOpacity>
        </View>

        {/* Plans List */}
        {filteredPlans.map((plan) => (
          <View key={plan.id} style={styles.planCard}>
            <View style={styles.planHeaderRow}>
              <Text style={styles.planBadge}>{plan.tag}</Text>
              <Text style={styles.planDays}>⏱ {plan.days}</Text>
            </View>
            <View style={styles.planBody}>
              <View style={styles.planInfo}>
                <Text style={styles.planTitle}>{plan.name}</Text>
                <Text style={styles.planDaily}>Daily Earning: <Text style={styles.dailyHighlight}>{plan.daily}</Text></Text>
              </View>
              <TouchableOpacity
                style={styles.investBtn}
                onPress={() => handleInvest(plan.price, plan.name)}
              >
                <Text style={styles.investBtnText}>Invest ₹{plan.price}</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </ScrollView>

      {/* Recharge Modal with UPI QR */}
      <Modal visible={rechargeModal} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Deposit / Recharge</Text>
            
            <View style={styles.qrContainer}>
              <Image
                source={{ uri: `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=upi://pay?pa=${upiAddress}&pn=SolarInvest` }}
                style={styles.qrImage}
              />
              <Text style={styles.qrInstruction}>Scan QR via PhonePe / GPay / Paytm</Text>
            </View>

            <View style={styles.upiInfoBox}>
              <Text style={styles.upiLabel}>UPI ID: </Text>
              <Text style={styles.upiText}>{upiAddress}</Text>
            </View>

            <TextInput
              style={styles.input}
              placeholder="Enter Recharge Amount (₹)"
              placeholderTextColor="#94a3b8"
              keyboardType="numeric"
              value={rechargeAmount}
              onChangeText={setRechargeAmount}
            />

            <TextInput
              style={styles.input}
              placeholder="Enter 12-Digit UTR / Transaction No."
              placeholderTextColor="#94a3b8"
              keyboardType="numeric"
              value={utrNumber}
              onChangeText={setUtrNumber}
            />

            <TouchableOpacity style={styles.submitModalBtn} onPress={handleRechargeSubmit}>
              <Text style={styles.submitModalBtnText}>Submit Payment Details</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.closeModalBtn} onPress={() => setRechargeModal(false)}>
              <Text style={styles.closeModalBtnText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Withdraw Modal */}
      <Modal visible={withdrawModal} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Withdraw Funds</Text>

            <TextInput
              style={styles.input}
              placeholder="Enter Withdrawal Amount (₹)"
              placeholderTextColor="#94a3b8"
              keyboardType="numeric"
              value={withdrawAmount}
              onChangeText={setWithdrawAmount}
            />

            <TextInput
              style={styles.input}
              placeholder="Enter your UPI ID (e.g. yourname@upi)"
              placeholderTextColor="#94a3b8"
              value={upiId}
              onChangeText={setUpiId}
              autoCapitalize="none"
            />

            <TouchableOpacity style={[styles.submitModalBtn, { backgroundColor: '#dc2626' }]} onPress={handleWithdrawSubmit}>
              <Text style={styles.submitModalBtnText}>Confirm Withdrawal</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.closeModalBtn} onPress={() => setWithdrawModal(false)}>
              <Text style={styles.closeModalBtnText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Customer Support Modal */}
      <Modal visible={supportModal} animationType="fade" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Official Support</Text>
            <Text style={{ textAlign: 'center', color: '#64748b', marginBottom: 16 }}>
              Facing any issue with deposit or recharge? Connect with our 24/7 help desk.
            </Text>

            <TouchableOpacity
              style={[styles.submitModalBtn, { backgroundColor: '#0284c7', marginBottom: 10 }]}
              onPress={() => Linking.openURL(telegramSupportUrl)}
            >
              <Text style={styles.submitModalBtnText}>✈️ Telegram Support</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.submitModalBtn, { backgroundColor: '#16a34a' }]}
              onPress={() => Linking.openURL("https://wa.me/910000000000")}
            >
              <Text style={styles.submitModalBtnText}>💬 WhatsApp Support</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.closeModalBtn} onPress={() => setSupportModal(false)}>
              <Text style={styles.closeModalBtnText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navItem} onPress={() => setActiveNav('home')}>
          <Text style={styles.navIcon}>⚡</Text>
          <Text style={[styles.navText, activeNav === 'home' && styles.activeNavText]}>Invest</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={() => setActiveNav('invite')}>
          <Text style={styles.navIcon}>🎁</Text>
          <Text style={[styles.navText, activeNav === 'invite' && styles.activeNavText]}>Invite</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={() => setSupportModal(true)}>
          <Text style={styles.navIcon}>🎧</Text>
          <Text style={styles.navText}>Help</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={() => setActiveNav('profile')}>
          <Text style={styles.navIcon}>👤</Text>
          <Text style={[styles.navText, activeNav === 'profile' && styles.activeNavText]}>Profile</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0f172a' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#1e293b',
    borderBottomWidth: 1,
    borderBottomColor: '#334155',
  },
  logoBadge: { flexDirection: 'row', alignItems: 'center' },
  logoImg: { width: 38, height: 38, borderRadius: 19, marginRight: 10, borderWidth: 1, borderColor: '#facc15' },
  logoTitle: { fontSize: 17, fontWeight: '900', color: '#ffffff', letterSpacing: 0.5 },
  logoAccent: { color: '#facc15' },
  logoSubtitle: { fontSize: 10, color: '#94a3b8', fontWeight: '600' },
  supportButton: {
    backgroundColor: '#0284c7',
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 20,
  },
  supportButtonText: { color: '#ffffff', fontWeight: 'bold', fontSize: 12 },
  scrollContent: { padding: 16, paddingBottom: 85 },
  walletCard: {
    backgroundColor: '#1e293b',
    borderRadius: 20,
    padding: 22,
    marginBottom: 18,
    borderWidth: 1,
    borderColor: '#334155',
  },
  walletGlow: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 80,
    height: 80,
    backgroundColor: '#f59e0b10',
    borderTopRightRadius: 20,
    borderBottomLeftRadius: 40,
  },
  walletHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  walletLabel: { color: '#94a3b8', fontSize: 11, fontWeight: '700', letterSpacing: 1 },
  walletTag: { color: '#22c55e', fontSize: 11, fontWeight: 'bold' },
  walletAmount: { color: '#ffffff', fontSize: 34, fontWeight: '900', marginVertical: 10 },
  walletActionRow: { flexDirection: 'row', gap: 12, marginTop: 4 },
  walletBtn: { flex: 1, paddingVertical: 13, borderRadius: 12, alignItems: 'center' },
  rechargeBtn: { backgroundColor: '#16a34a' },
  withdrawBtn: { backgroundColor: '#334155' },
  walletBtnText: { color: '#ffffff', fontWeight: 'bold', fontSize: 14 },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#1e293b',
    borderRadius: 12,
    padding: 4,
    marginBottom: 16,
  },
  tab: { flex: 1, paddingVertical: 9, alignItems: 'center', borderRadius: 10 },
  activeTab: { backgroundColor: '#2563eb' },
  tabText: { fontWeight: '600', color: '#94a3b8', fontSize: 13 },
  activeTabText: { color: '#ffffff', fontWeight: 'bold' },
  planCard: {
    backgroundColor: '#1e293b',
    borderRadius: 16,
    padding: 16,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#334155',
  },
  planHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
  planBadge: {
    backgroundColor: '#f59e0b20',
    color: '#fbbf24',
    fontSize: 11,
    fontWeight: 'bold',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  planDays: { color: '#94a3b8', fontSize: 12, fontWeight: '600' },
  planBody: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  planInfo: { flex: 1 },
  planTitle: { fontSize: 16, fontWeight: 'bold', color: '#ffffff', marginBottom: 4 },
  planDaily: { fontSize: 13, color: '#94a3b8' },
  dailyHighlight: { color: '#22c55e', fontWeight: 'bold' },
  investBtn: {
    backgroundColor: '#2563eb',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 10,
  },
  investBtnText: { color: '#ffffff', fontWeight: 'bold', fontSize: 13 },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.75)',
    justifyContent: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: '#ffffff',
    borderRadius: 24,
    padding: 22,
  },
  modalTitle: { fontSize: 19, fontWeight: 'bold', textAlign: 'center', marginBottom: 14, color: '#0f172a' },
  qrContainer: { alignItems: 'center', marginBottom: 14 },
  qrImage: { width: 180, height: 180, borderRadius: 12 },
  qrInstruction: { fontSize: 12, color: '#64748b', marginTop: 8, fontWeight: '500' },
  upiInfoBox: {
    backgroundColor: '#f1f5f9',
    padding: 10,
    borderRadius: 10,
    marginBottom: 14,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  upiLabel: { color: '#64748b', fontWeight: '600' },
  upiText: { color: '#0f172a', fontWeight: 'bold' },
  input: {
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: '#cbd5e1',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 11,
    fontSize: 14,
    marginBottom: 12,
    color: '#0f172a',
  },
  submitModalBtn: {
    backgroundColor: '#16a34a',
    paddingVertical: 13,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 4,
  },
  submitModalBtnText: { color: '#ffffff', fontWeight: 'bold', fontSize: 15 },
  closeModalBtn: { marginTop: 10, alignItems: 'center', padding: 8 },
  closeModalBtnText: { color: '#64748b', fontWeight: '600' },
  bottomNav: {
    flexDirection: 'row',
    backgroundColor: '#1e293b',
    borderTopWidth: 1,
    borderTopColor: '#334155',
    paddingVertical: 10,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  navItem: { flex: 1, alignItems: 'center' },
  navIcon: { fontSize: 18 },
  navText: { fontSize: 11, color: '#64748b', marginTop: 2 },
  activeNavText: { color: '#38bdf8', fontWeight: 'bold' },
});
                        
