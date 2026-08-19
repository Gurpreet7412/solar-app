import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Modal,
  Alert,
  SafeAreaView,
  StatusBar,
  Linking,
  Image
} from 'react-native';

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
    {
      id: 1,
      badge: '🔥 Hot',
      duration: '15 Days',
      daysCount: 15,
      name: 'Solar Micro 15D',
      price: 200,
      daily: 25,
      category: '15 Days'
    },
    {
      id: 2,
      badge: '⭐ Popular',
      duration: '15 Days',
      daysCount: 15,
      name: 'Solar Mini 15D',
      price: 400,
      daily: 55,
      category: '15 Days'
    },
    {
      id: 3,
      badge: '🚀 High Return',
      duration: '15 Days',
      daysCount: 15,
      name: 'Solar Boost 15D',
      price: 800,
      daily: 120,
      category: '15 Days'
    },
    {
      id: 4,
      badge: '🌱 Stable',
      duration: '30 Days',
      daysCount: 30,
      name: 'Solar Plant 30D',
      price: 1500,
      daily: 240,
      category: '30 Days'
    },
    {
      id: 5,
      badge: '👑 Mega Yield',
      duration: '30 Days',
      daysCount: 30,
      name: 'Solar Farm Max',
      price: 3000,
      daily: 520,
      category: '30 Days'
    }
  ];

  const filteredPlans = activeTab === 'All' 
    ? plans 
    : plans.filter(p => p.category === activeTab);

  const openWhatsAppSupport = () => {
    const url = 'https://wa.me/917412881011?text=Hello%20Solar%20Invest%20Support,%20I%20need%20assistance.';
    Linking.openURL(url).catch(() => {
      Alert.alert('Customer Support', 'Contact WhatsApp: +91 7412881011');
    });
  };

  const handleInvestPress = (plan) => {
    setSelectedPlan(plan);
    setModalVisible(true);
  };

  const handleDepositSubmit = () => {
    if (!transactionId.trim()) {
      Alert.alert('Required', 'Kripya apna 12-digit UTR / Ref No. enter karein.');
      return;
    }
    Alert.alert(
      'Deposit Received',
      `Payment request for ₹${selectedPlan ? selectedPlan.price : 'Recharge'} submitted successfully. Admin verification under process.`
    );
    setModalVisible(false);
    setTransactionId('');
  };

  const handleWithdrawSubmit = () => {
    if (!withdrawAmount || Number(withdrawAmount) < 200) {
      Alert.alert('Invalid Amount', 'Minimum withdrawal limit ₹200 hai.');
      return;
    }
    if (!withdrawUpi.trim()) {
      Alert.alert('Required', 'Apna UPI ID enter karein.');
      return;
    }
    if (Number(withdrawAmount) > balance) {
      Alert.alert('Insufficient Balance', 'Aapke wallet me paryapt balance nahi hai.');
      return;
    }
    setBalance(prev => prev - Number(withdrawAmount));
    Alert.alert('Success', `₹${withdrawAmount} withdrawal request received. 24 hours me credit ho jayega.`);
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
          <Image 
            source={require('./adaptive-icon.png')} 
            style={styles.headerLogo} 
            defaultSource={require('./icon.png')}
          />
          <View>
            <Text style={styles.logoTitle}>
              SOLAR <Text style={styles.logoTitleHighlight}>INVEST</Text>
            </Text>
            <Text style={styles.logoSubtitle}>Clean Energy Growth</Text>
          </View>
        </View>

        <TouchableOpacity style={styles.helpBtn} onPress={openWhatsAppSupport}>
          <Text style={styles.helpBtnText}>🎧 Help</Text>
        </TouchableOpacity>
      </View>

      {/* Main Content Area */}
      <ScrollView 
        contentContainerStyle={styles.scrollContainer} 
        showsVerticalScrollIndicator={false}
      >
        {bottomNav === 'Invest' && (
          <>
            {/* Wallet Balance Card */}
            <View style={styles.walletCard}>
              <View style={styles.walletTopRow}>
                <Text style={styles.walletLabel}>TOTAL WALLET BALANCE</Text>
                <View style={styles.activeTag}>
                  <View style={styles.greenDot} />
                  <Text style={styles.activeTagText}>Active</Text>
                </View>
              </View>

              <Text style={styles.walletAmount}>₹{balance.toFixed(2)}</Text>

              <View style={styles.walletActionsRow}>
                <TouchableOpacity 
                  style={styles.rechargeBtn}
                  onPress={() => {
                    setSelectedPlan({ name: 'Wallet Recharge', price: 500 });
                    setModalVisible(true);
                  }}
                >
                  <Text style={styles.rechargeBtnText}>⚡ + Recharge</Text>
                </TouchableOpacity>

                <TouchableOpacity 
                  style={styles.withdrawBtn}
                  onPress={() => setWithdrawModalVisible(true)}
                >
                  <Text style={styles.withdrawBtnText}>↗ Withdraw</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Filter Tabs */}
            <View style={styles.tabsRow}>
              {['All', '15 Days', '30 Days'].map((tab) => (
                <TouchableOpacity
                  key={tab}
                  style={[
                    styles.tabItem,
                    activeTab === tab && styles.tabItemActive
                  ]}
                  onPress={() => setActiveTab(tab)}
                >
                  <Text
                    style={[
                      styles.tabText,
                      activeTab === tab && styles.tabTextActive
                    ]}
                  >
                    {tab === 'All' ? 'All Plans' : tab}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Plans List */}
            {filteredPlans.map((plan) => (
              <View key={plan.id} style={styles.planCard}>
                <View style={styles.planCardHeader}>
                  <View style={styles.badgeWrapper}>
                    <Text style={styles.badgeText}>{plan.badge}</Text>
                  </View>
                  <Text style={styles.durationText}>⏱ {plan.duration}</Text>
                </View>

                <View style={styles.planContentRow}>
                  <View>
                    <Text style={styles.planName}>{plan.name}</Text>
                    <Text style={styles.dailyText}>
                      Daily Earning: <Text style={styles.dailyHighlight}>₹{plan.daily}</Text>
                    </Text>
                  </View>

                  <TouchableOpacity
                    style={styles.investActionBtn}
                    onPress={() => handleInvestPress(plan)}
                  >
                    <Text style={styles.investActionBtnText}>Invest ₹{plan.price}</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </>
        )}

        {bottomNav === 'Invite' && (
          <View style={styles.sectionCard}>
            <Text style={styles.sectionHeading}>Invite Friends & Earn</Text>
            <Text style={styles.sectionSub}>Get 10% direct commission when your friends invest.</Text>
            <TouchableOpacity 
              style={styles.whatsappBtn}
              onPress={() => Alert.alert('Share Link', 'Share referral link via WhatsApp')}
            >
              <Text style={styles.whatsappBtnText}>🎁 Share Referral Code</Text>
            </TouchableOpacity>
          </View>
        )}

        {bottomNav === 'Help' && (
          <View style={styles.sectionCard}>
            <Text style={styles.sectionHeading}>Customer Support</Text>
            <Text style={styles.sectionSub}>24/7 dedicated support team available for deposit & withdrawal inquiries.</Text>
            <TouchableOpacity style={styles.whatsappBtn} onPress={openWhatsAppSupport}>
              <Text style={styles.whatsappBtnText}>💬 Chat on WhatsApp (+91 7412881011)</Text>
            </TouchableOpacity>
          </View>
        )}

        {bottomNav === 'Profile' && (
          <View style={styles.sectionCard}>
            <Text style={styles.sectionHeading}>User Profile</Text>
            <Text style={styles.sectionSub}>Wallet Balance: ₹{balance.toFixed(2)}</Text>
            <Text style={styles.sectionSub}>Status: Verified Active Investor</Text>
            <TouchableOpacity style={styles.whatsappBtn} onPress={openWhatsAppSupport}>
              <Text style={styles.whatsappBtnText}>Need Help with Account?</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>

      {/* Bottom Navigation Bar */}
      <View style={styles.bottomNav}>
        {[
          { id: 'Invest', label: 'Invest', icon: '⚡' },
          { id: 'Invite', label: 'Invite', icon: '🎁' },
          { id: 'Help', label: 'Help', icon: '🎧' },
          { id: 'Profile', label: 'Profile', icon: '👤' }
        ].map((item) => (
          <TouchableOpacity
            key={item.id}
            style={styles.navItem}
            onPress={() => {
              if (item.id === 'Help') {
                openWhatsAppSupport();
              } else {
                setBottomNav(item.id);
              }
            }}
          >
            <Text style={[styles.navIcon, bottomNav === item.id && styles.navTextActive]}>
              {item.icon}
            </Text>
            <Text style={[styles.navLabel, bottomNav === item.id && styles.navTextActive]}>
              {item.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Recharge/Deposit Modal */}
      <Modal visible={modalVisible} transparent={true} animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Recharge & Invest</Text>
            {selectedPlan && (
              <Text style={styles.modalPlanInfo}>
                {selectedPlan.name} | Amount: <Text style={{ color: '#16a34a', fontWeight: 'bold' }}>₹{selectedPlan.price}</Text>
              </Text>
            )}

            <Text style={styles.upiSelectLabel}>Select Official UPI ID:</Text>
            
            <TouchableOpacity
              style={[styles.upiOption, selectedUpi === 'deepsingh7412@ibl' && styles.upiOptionActive]}
              onPress={() => setSelectedUpi('deepsingh7412@ibl')}
            >
              <Text style={styles.upiOptionText}>1. deepsingh7412@ibl</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.upiOption, selectedUpi === 'mandeep7412@axl' && styles.upiOptionActive]}
              onPress={() => setSelectedUpi('mandeep7412@axl')}
            >
              <Text style={styles.upiOptionText}>2. mandeep7412@axl</Text>
            </TouchableOpacity>

            <View style={styles.selectedUpiCard}>
              <Text style={styles.selectedUpiHeading}>Transfer to:</Text>
              <Text style={styles.selectedUpiValue}>{selectedUpi}</Text>
            </View>

            <TextInput
              style={styles.textInput}
              placeholder="Enter 12-digit UTR / Ref No."
              placeholderTextColor="#94a3b8"
              value={transactionId}
              onChangeText={setTransactionId}
              keyboardType="number-pad"
            />

            <TouchableOpacity style={styles.submitBtn} onPress={handleDepositSubmit}>
              <Text style={styles.submitBtnText}>Submit Deposit Details</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.cancelBtn} onPress={() => setModalVisible(false)}>
              <Text style={styles.cancelBtnText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Withdrawal Modal */}
      <Modal visible={withdrawModalVisible} transparent={true} animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Withdraw Balance</Text>
            <Text style={styles.modalPlanInfo}>Available Balance: ₹{balance.toFixed(2)}</Text>

            <TextInput
              style={styles.textInput}
              placeholder="Enter Amount (Min ₹200)"
              placeholderTextColor="#94a3b8"
              value={withdrawAmount}
              onChangeText={setWithdrawAmount}
              keyboardType="number-pad"
            />

            <TextInput
              style={styles.textInput}
              placeholder="Enter Your UPI ID"
              placeholderTextColor="#94a3b8"
              value={withdrawUpi}
              onChangeText={setWithdrawUpi}
            />

            <TouchableOpacity style={styles.submitBtn} onPress={handleWithdrawSubmit}>
              <Text style={styles.submitBtnText}>Confirm Withdrawal</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.cancelBtn} onPress={() => setWithdrawModalVisible(false)}>
              <Text style={styles.cancelBtnText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0e1726',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 16,
    backgroundColor: '#0e1726',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerLogo: {
    width: 38,
    height: 38,
    borderRadius: 8,
    marginRight: 10,
  },
  logoTitle: {
    fontSize: 20,
    fontWeight: '900',
    color: '#ffffff',
    letterSpacing: 0.5,
  },
  logoTitleHighlight: {
    color: '#f59e0b',
  },
  logoSubtitle: {
    fontSize: 11,
    color: '#94a3b8',
    marginTop: 1,
  },
  helpBtn: {
    backgroundColor: '#0284c7',
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 20,
  },
  helpBtnText: {
    color: '#ffffff',
    fontWeight: 'bold',
    fontSize: 13,
  },
  scrollContainer: {
    paddingHorizontal: 16,
    paddingBottom: 85,
  },
  walletCard: {
    backgroundColor: '#1b263b',
    borderRadius: 22,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#2e3d5b',
  },
  walletTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  walletLabel: {
    color: '#94a3b8',
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  activeTag: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  greenDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: '#22c55e',
    marginRight: 5,
  },
  activeTagText: {
    color: '#22c55e',
    fontSize: 12,
    fontWeight: '600',
  },
  walletAmount: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#ffffff',
    marginVertical: 14,
  },
  walletActionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  rechargeBtn: {
    flex: 1,
    backgroundColor: '#16a34a',
    borderRadius: 14,
    paddingVertical: 13,
    alignItems: 'center',
  },
  rechargeBtnText: {
    color: '#ffffff',
    fontWeight: 'bold',
    fontSize: 15,
  },
  withdrawBtn: {
    flex: 1,
    backgroundColor: '#2e3d5b',
    borderRadius: 14,
    paddingVertical: 13,
    alignItems: 'center',
  },
  withdrawBtnText: {
    color: '#ffffff',
    fontWeight: 'bold',
    fontSize: 15,
  },
  tabsRow: {
    flexDirection: 'row',
    backgroundColor: '#162235',
    borderRadius: 14,
    padding: 4,
    marginBottom: 16,
  },
  tabItem: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 10,
  },
  tabItemActive: {
    backgroundColor: '#2563eb',
  },
  tabText: {
    color: '#94a3b8',
    fontSize: 13,
    fontWeight: '600',
  },
  tabTextActive: {
    color: '#ffffff',
    fontWeight: 'bold',
  },
  planCard: {
    backgroundColor: '#1b263b',
    borderRadius: 18,
    padding: 16,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#2e3d5b',
  },
  planCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  badgeWrapper: {
    backgroundColor: '#2e3d5b',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#fbbf24',
  },
  durationText: {
    fontSize: 12,
    color: '#94a3b8',
  },
  planContentRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  planName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 4,
  },
  dailyText: {
    fontSize: 13,
    color: '#94a3b8',
  },
  dailyHighlight: {
    color: '#22c55e',
    fontWeight: 'bold',
  },
  investActionBtn: {
    backgroundColor: '#2563eb',
    paddingHorizontal: 18,
    paddingVertical: 11,
    borderRadius: 12,
  },
  investActionBtnText: {
    color: '#ffffff',
    fontWeight: 'bold',
    fontSize: 14,
  },
  sectionCard: {
    backgroundColor: '#1b263b',
    borderRadius: 18,
    padding: 20,
    marginTop: 20,
    borderWidth: 1,
    borderColor: '#2e3d5b',
    alignItems: 'center',
  },
  sectionHeading: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 6,
  },
  sectionSub: {
    fontSize: 13,
    color: '#94a3b8',
    textAlign: 'center',
    marginBottom: 16,
  },
  whatsappBtn: {
    backgroundColor: '#25d366',
    paddingVertical: 13,
    paddingHorizontal: 20,
    borderRadius: 12,
    width: '100%',
    alignItems: 'center',
  },
  whatsappBtnText: {
    color: '#ffffff',
    fontWeight: 'bold',
    fontSize: 14,
  },
  bottomNav: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 65,
    backgroundColor: '#0a101d',
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: '#1e293b',
  },
  navItem: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  navIcon: {
    fontSize: 18,
    color: '#64748b',
  },
  navLabel: {
    fontSize: 11,
    color: '#64748b',
    marginTop: 2,
    fontWeight: '600',
  },
  navTextActive: {
    color: '#38bdf8',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 22,
    width: '100%',
    maxWidth: 360,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#0f172a',
    textAlign: 'center',
  },
  modalPlanInfo: {
    fontSize: 13,
    color: '#64748b',
    textAlign: 'center',
    marginVertical: 10,
  },
  upiSelectLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#475569',
    marginBottom: 8,
  },
  upiOption: {
    padding: 10,
    borderWidth: 1,
    borderColor: '#cbd5e1',
    borderRadius: 10,
    marginBottom: 8,
  },
  upiOptionActive: {
    borderColor: '#16a34a',
    backgroundColor: '#f0fdf4',
  },
  upiOptionText: {
    fontSize: 13,
    color: '#0f172a',
    fontWeight: '600',
  },
  selectedUpiCard: {
    backgroundCol
