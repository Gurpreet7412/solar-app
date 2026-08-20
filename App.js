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
  ImageBackground,
  Share
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

  // Referral Link
  const referralLink = 'https://t.me/Guri7412?start=invite30bonus';

  // All Plans: Weekly, 15 Days, and Monthly
  const plans = [
    { id: 1, badge: '⚡ Fast Return', duration: '7 Days', daysCount: 7, name: 'Solar Starter 7D', price: 150, daily: 30, category: 'Weekly' },
    { id: 2, badge: '⚡ Quick Gain', duration: '7 Days', daysCount: 7, name: 'Solar Express 7D', price: 300, daily: 65, category: 'Weekly' },
    { id: 3, badge: '🔥 Hot', duration: '15 Days', daysCount: 15, name: 'Solar Micro 15D', price: 200, daily: 25, category: '15 Days' },
    { id: 4, badge: '⭐ Popular', duration: '15 Days', daysCount: 15, name: 'Solar Mini 15D', price: 400, daily: 55, category: '15 Days' },
    { id: 5, badge: '🚀 High Return', duration: '15 Days', daysCount: 15, name: 'Solar Boost 15D', price: 800, daily: 120, category: '15 Days' },
    { id: 6, badge: '🌱 Stable', duration: '30 Days', daysCount: 30, name: 'Solar Plant 30D', price: 1500, daily: 240, category: '30 Days' },
    { id: 7, badge: '👑 Mega Yield', duration: '30 Days', daysCount: 30, name: 'Solar Farm Max', price: 3000, daily: 520, category: '30 Days' }
  ];

  const filteredPlans = activeTab === 'All' ? plans : plans.filter(p => p.category === activeTab);

  const openTelegramSupport = () => {
    const telegramUrl = 'https://t.me/Guri7412';
    Linking.openURL(telegramUrl).catch(() => {
      Alert.alert('Telegram Support', 'Telegram open nahi ho paya. Direct search karein: @Guri7412');
    });
  };

  const handleShareLink = async () => {
    try {
      await Share.share({
        message: `🔥 Solar Invest me join karein aur har friend ke recharge par payen flat 30% Direct Bonus! 💰\n\nAbhi join karein: ${referralLink}`
      });
    } catch (error) {
      Alert.alert('Share Error', 'Link share karne me samasya aayi.');
    }
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

          {/* Main Content */}
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

                {/* Running Investments */}
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

                {/* Category Filter Tabs */}
                <View style={styles.tabsRow}>
                  {['All', 'Weekly', '15 Days', '30 Days'].map((tab) => (
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
                <View style={styles.bonusBanner}>
                  <Text style={styles.bonusBannerText}>🎉 30% INSTANT BONUS</Text>
                </View>
                <Text style={styles.sectionHeaderTitle}>Invite & Earn 30% Bonus</Text>
                <Text style={styles.contentSubtitle}>
                  Apne doston ko invite karein aur unke har ek plan investment par payen flat 30% direct bonus reward.
                </Text>

                <View style={styles.referralLinkBox}>
                  <Text style={styles.referralLabel}>Aapka Personal Invite Link:</Text>
                  <Text style={styles.referralLinkText} numberOfLines={1}>{referralLink}</Text>
                </View>

                <TouchableOpacity style={styles.shareActionBtn} onPress={handleShareLink}>
                  <Text style={styles.shareBtnText}>🚀 Share Invite Link (Earn 30%)</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.telegramActionBtn} onPress={openTelegramSupport}>
                  <Text style={styles.btnTextWhite}>✈️ Team Support (@Guri7412)</Text>
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
  greenDot: { width: 7, height: 7,

                
            
