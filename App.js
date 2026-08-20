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
  Image,
  ImageBackground
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

  // Active User Plans State
  const [myActivePlans, setMyActivePlans] = useState([]);

  // Transaction History State
  const [history, setHistory] = useState([
    { id: '1', type: 'Welcome Bonus', amount: '₹1100.00', status: 'Completed', date: 'Initial Credit' }
  ]);

  const plans = [
    { id: 1, badge: '🔥 Hot', duration: '15 Days', daysCount: 15, name: 'Solar Micro 15D', price: 200, daily: 25, category: '15 Days' },
    { id: 2, badge: '⭐ Popular', duration: '15 Days', daysCount: 15, name: 'Solar Mini 15D', price: 400, daily: 55, category: '15 Days' },
    { id: 3, badge: '🚀 High Return', duration: '15 Days', daysCount: 15, name: 'Solar Boost 15D', price: 800, daily: 120, category: '15 Days' },
    { id: 4, badge: '🌱 Stable', duration: '30 Days', daysCount: 30, name: 'Solar Plant 30D', price: 1500, daily: 240, category: '30 Days' },
    { id: 5, badge: '👑 Mega Yield', duration: '30 Days', daysCount: 30, name: 'Solar Farm Max', price: 3000, daily: 520, category: '30 Days' }
  ];

  const filteredPlans = activeTab === 'All' ? plans : plans.filter(p => p.category === activeTab);

  // Telegram Support Handler (@Guri7412 integrated)
  const openTelegramSupport = () => {
    const telegramUrl = 'https://t.me/Guri7412';
    Linking.openURL(telegramUrl).catch(() => {
      Alert.alert('Telegram Support', 'Telegram open nahi ho paya. Direct search karein: @Guri7412');
    });
  };

  const handleInvestPress = (plan) => {
    if (balance < plan.price) {
      Alert.alert(
        'Low Balance', 
        `Aapke paas paryapt balance nahi hai. Kripya pehle ₹${plan.price} recharge karein.`,
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Recharge Now', onPress: () => { setSelectedPlan(plan); setModalVisible(true); } }
        ]
      );
      return;
    }

    // Deduct Balance & Activate Plan
    setBalance(prev => prev - plan.price);
    const newPlan = {
      id: Date.now().toString(),
      name: plan.name,
      price: plan.price,
      daily: plan.daily,
      daysLeft: plan.daysCount,
      startDate: new Date().toLocaleDateString('en-GB')
    };

    setMyActivePlans([newPlan, ...myActivePlans]);

    // Add to History
    setHistory([
      { 
        id: Date.now().toString(), 
        type: `Invested: ${plan.name}`, 
        amount: `-₹${plan.price}`, 
        status: 'Active (Running)', 
        date: new Date().toLocaleDateString('en-GB') 
      },
      ...history
    ]);

    Alert.alert('Success', `${plan.name} successfully activate ho gaya hai! Earning running status me add ho chuki hai.`);
  };

  const handleDepositSubmit = () => {
    if (!transactionId.trim()) {
      Alert.alert('Required', 'Kripya apna 12-digit UTR / Ref No. enter karein.');
      return;
    }

    const depositAmount = selectedPlan ? selectedPlan.price : 500;
    
    // Add to History
    setHistory([
      { 
        id: Date.now().toString(), 
        type: 'Recharge / Deposit', 
        amount: `+₹${depositAmount}`, 
        status: 'Pending Verification', 
        date: new Date().toLocaleDateString('en-GB') 
      },
      ...history
    ]);

    Alert.alert('Payment Submitted', `UTR ${transactionId} submit ho gaya hai. Verification ke baad balance me add ho jayega.`);
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
      Alert.alert('Insufficient Balance', 'Aapke wallet me itna balance nahi hai.');
      return;
    }

    setBalance(prev => prev - Number(withdrawAmount));

    // Add to History
    setHistory([
      { 
        id: Date.now().toString(), 
        type: `Withdrawal (${withdrawUpi})`, 
        amount: `-₹${withdrawAmount}`, 
        status: 'Processing', 
        date: new Date().toLocaleDateString('en-GB') 
      },
      ...history
    ]);

    Alert.alert('Success', `₹${withdrawAmount} withdrawal request submit ho gayi hai.`);
    setWithdrawModalVisible(false);
    setWithdrawAmount('');
    setWithdrawUpi('');
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0a101d" />

      {/* Background Image Wrapper */}
      <ImageBackground
        source={{ uri: 'https://images.unsplash.com/photo-1509391365360-2e959784a276?q=80&w=1080&auto=format&fit=crop' }}
        style={styles.backgroundImage}
        resizeMode="cover"
      >
        <View style={styles.overlayLayer}>
          
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.headerLeft}>
              <Image source={require('./icon.png')} style={styles.headerLogo} />
              <View>
                <Text style={styles.logoTitle}>SOLAR <Text style={{ color: '#f59e0b' }}>INVEST</Text></Text>
                <Text style={styles.logoSubtitle}>Clean Energy Growth</Text>
              </View>
            </View>

            <TouchableOpacity style={styles.helpBtn} onPress={openTelegramSupport}>
              <Text style={styles.helpBtnText}>✈️ @Guri7412</Text>
            </TouchableOpacity>
          </View>

          {/* Main Content Area */}
          <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
            
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
                      onPress={() => { setSelectedPlan({ name: 'Recharge', price: 500 }); setModalVisible(true); }}
                    >
                      <Text style={styles.btnTextWhite}>⚡ + Recharge</Text>
                    </TouchableOpacity>

                    <TouchableOpacity 
                      style={styles.withdrawBtn}
                      onPress={() => setWithdrawModalVisible(true)}
                    >
                      <Text style={styles.btnTextWhite}>↗ Withdraw</Text>
                    </TouchableOpacity>
                  </View>
                </View>

                {/* Active Running Plans Display */}
                {myActivePlans.length > 0 && (
                  <View style={styles.activeSection}>
                    <Text style={styles.sectionHeaderTitle}>⚡ Running Investments ({myActivePlans.length})</Text>
                    {myActivePlans.map((ap) => (
                      <View key={ap.id} style={styles.runningPlanCard}>
                        <View style={styles.runningPlanHeader}>
                          <Text style={styles.runningPlanTitle}>{ap.name}</Text>
                          <Text style={styles.runningStatus}>● Earning Active</Text>
                        </View>
                        <Text style={styles.runningSub}>Daily Profit: <Text style={{ color: '#22c55e', fontWeight: 'bold' }}>+₹{ap.daily}</Text> | Validity Left: {ap.daysLeft} Days</Text>
                      </View>
                    ))}
                  </View>
                )}

                {/* Filter Tabs */}
                <View style={styles.tabsRow}>
                  {['All', '15 Days', '30 Days'].map((tab) => (
                    <TouchableOpacity
                      key={tab}
                      style={[styles.tabItem, activeTab === tab && styles.tabItemActive]}
                      onPress={() => setActiveTab(tab)}
                    >
                      <Text style={[styles.tabText, activeTab === tab && styles.tabTextActive]}>
                        {tab === 'All' ? 'All Plans' : tab}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>

                {/* Investment Plans List */}
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

                      <TouchableOpacity style={styles.investActionBtn} onPress={() => handleInvestPress(plan)}>
                        <Text style={styles.investActionBtnText}>Invest ₹{plan.price}</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                ))}
              </>
            )}

            {/* History Tab */}
            {bottomNav === 'History' && (
              <View style={styles.contentBox}>
                <Text style={styles.sectionHeaderTitle}>Transaction & Plan History</Text>
                {history.map((item) => (
                  <View key={item.id} style={styles.historyCard}>
                    <View>
                      <Text style={styles.historyType}>{item.type}</Text>
                      <Text style={styles.historyDate}>{item.date}</Text>
                    </View>
                    <View style={{ alignItems: 'flex-end' }}>
                      <Text style={[styles.historyAmount, item.amount.includes('+') ? { color: '#22c55e' } : { color: '#ffffff' }]}>
                        {item.amount}
                      </Text>
                      <Text style={styles.historyStatus}>{item.status}</Text>
                    </View>
                  </View>
                ))}
              </View>
            )}

            {/* Invite Tab */}
            {bottomNav === 'Invite' && (
              <View style={styles.contentBox}>
                <Text style={styles.sectionHeaderTitle}>Invite & Earn 30%</Text>
                <Text style={styles.contentSubtitle}>Share your link and earn direct rewards on team investments.</Text>
                <TouchableOpacity style={styles.telegramActionBtn} onPress={openTelegramSupport}>
                  <Text style={styles.btnTextWhite}>✈️ Connect with @Guri7412</Text>
                </TouchableOpacity>
              </View>
            )}

            {/* Profile Tab */}
            {bottomNav === 'Profile' && (
              <View style={styles.contentBox}>
                <Text style={styles.sectionHeaderTitle}>User Dashboard</Text>
                <Text style={styles.profileDetail}>Total Balance: ₹{balance.toFixed(2)}</Text>
                <Text style={styles.profileDetail}>Running Plans: {myActivePlans.length}</Text>
                <TouchableOpacity style={styles.telegramActionBtn} onPress={openTelegramSupport}>
                  <Text style={styles.btnTextWhite}>✈️ 24/7 Support (@Guri7412)</Text>
                </TouchableOpacity>
              </View>
            )}

          </ScrollView>

          {/* Bottom Navigation */}
          <View style={styles.bottomNav}>
            {[
              { id: 'Invest', label: 'Invest', icon: '⚡' },
              { id: 'History', label: 'History', icon: '📋' },
              { id: 'Invite', label: 'Invite', icon: '🎁' },
              { id: 'Profile', label: 'Profile', icon: '👤' }
            ].map((item) => (
              <TouchableOpacity
                key={item.id}
                style={styles.navItem}
                onPress={() => setBottomNav(item.id)}
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

        </View>
      </ImageBackground>

      {/* Deposit Modal */}
      <Modal visible={modalVisible} transparent={true} animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Recharge & Payment</Text>
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

            <View style={styles.selectedUpiBox}>
              <Text style={{ fontSize: 11, color: '#64748b' }}>Transfer to:</Text>
              <Text style={{ fontSize: 14, fontWeight: 'bold', color: '#0f172a' }}>{selectedUpi}</Text>
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
              <Text style={styles.btnTextWhite}>Submit Deposit</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.cancelBtn} onPress={() => setModalVisible(false)}>
              <Text style={styles.cancelBtnText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Withdraw Modal */}
      <Modal visible={withdrawModalVisible} transparent={true} animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Withdraw Balance</Text>
            <Text style={styles.modalPlanInfo}>Available: ₹{balance.toFixed(2)}</Text>

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
              <Text style={styles.btnTextWhite}>Confirm Withdrawal</Text>
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
  container: { flex: 1, backgroundColor: '#0a101d' },
  backgroundImage: { flex: 1, width: '100%', height: '100%' },
  overlayLayer: { flex: 1, backgroundColor: 'rgba(10, 16, 29, 0.88)' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 16,
    backgroundColor: 'rgba(14, 23, 38, 0.75)',
  },
  headerLeft: { flexDirection: 'row', alignItems: 'center' },
  headerLogo: { width: 36, height: 36, borderRadius: 8, marginRight: 10 },
  logoTitle: { fontSize: 20, fontWeight: 'bold', color: '#ffffff' },
  logoSubtitle: { fontSize: 11, color: '#94a3b8' },
  helpBtn: { backgroundColor: '#0284c7', paddingHorizontal: 14, paddingVertical: 7, borderRadius: 20 },
  helpBtnText: { color: '#ffffff', fontWeight: 'bold', fontSize: 13 },
  scrollContainer: { paddingHorizontal: 16, paddingTop: 14, paddingBottom: 85 },
  walletCard: { backgroundColor: 'rgba(27, 38, 59, 0.92)', borderRadius: 22, padding: 20, marginBottom: 16, borderWidth: 1, borderColor: '#2e3d5b' },
  walletTopRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  walletLabel: { color: '#94a3b8', fontSize: 12, fontWeight: '700' },
  activeTag: { flexDirection: 'row', alignItems: 'center' },
  greenDot: { width: 7, height: 7, borderRadius: 4, backgroundColor: '#22c55e', marginRight: 5 },
  activeTagText: { color: '#22c55e', fontSize: 12, fontWeight: '600' },
  walletAmount: { fontSize: 36, fontWeight: 'bold', color: '#ffffff', marginVertical: 12 },
  walletActionsRow: { flexDirection: 'row', justifyContent: 'space-between', gap: 10 },
  rechargeBtn: { flex: 1, backgroundColor: '#16a34a', borderRadius: 14, paddingVertical: 12, alignItems: 'center' },
  withdrawBtn: { flex: 1, backgroundColor: '#2e3d5b', borderRadius: 14, paddingVertical: 12, alignItems: 'center' },
  btnTextWhite: { color: '#ffffff', fontWeight: 'bold', fontSize: 14 },
  activeSection: { marginBottom: 16 },
  runningPlanCard: { backgroundColor: 'rgba(22, 34, 53, 0.95)', borderRadius: 14, padding: 12, marginBottom: 8, borderWidth: 1, borderColor: '#22c55e' },
  runningPlanHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 },
  runningPlanTitle: { color: '#ffffff', fontWeight: 'bold', fontSize: 14 },
  runningStatus: { color: '#22c55e', fontSize: 12, fontWeight: 'bold' },
  runningSub: { color: '#94a3b8', fontSize: 12 },
  tabsRow: { flexDirection: 'row', backgroundColor: 'rgba(22, 34, 53, 0.85)', borderRadius: 14, padding: 4, marginBottom: 14 },
  tabItem: { flex: 1, paddingVertical: 8, alignIt
