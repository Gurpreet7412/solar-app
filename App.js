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
  Linking
} from 'react-native';

export default function App() {
  const [balance, setBalance] = useState(0);
  const [dailyEarnings, setDailyEarnings] = useState(0);
  const [totalInvested, setTotalInvested] = useState(0);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [selectedUpi, setSelectedUpi] = useState('deepsingh7412@ibl');
  const [transactionId, setTransactionId] = useState('');

  const plans = [
    { id: 1, name: 'Solar Starter', price: 1000, daily: 50, days: 30, total: 1500 },
    { id: 2, name: 'Solar Pro', price: 3000, daily: 165, days: 30, total: 4950 },
    { id: 3, name: 'Solar Max', price: 5000, daily: 300, days: 30, total: 9000 },
    { id: 4, name: 'Mega Solar Plant', price: 10000, daily: 650, days: 30, total: 19500 },
  ];

  const handleInvestPress = (plan) => {
    setSelectedPlan(plan);
    setModalVisible(true);
  };

  const handlePaymentSubmit = () => {
    if (!transactionId.trim()) {
      Alert.alert('Error', 'Kripya apna 12-digit UTR / Transaction ID enter karein.');
      return;
    }
    Alert.alert(
      'Payment Submitted', 
      `Aapki request ${selectedPlan?.name} ke liye receive ho gayi hai. Admin verification ke baad balance update ho jayega.`
    );
    setModalVisible(false);
    setTransactionId('');
  };

  const openWhatsAppSupport = () => {
    const url = 'https://wa.me/917412881011?text=Hello%20Solar%20Invest%20Support,%20I%20need%20help%20with%20my%20account.';
    Linking.openURL(url).catch(() => {
      Alert.alert('Error', 'WhatsApp open nahi ho paya. Number: +91 7412881011');
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0f172a" />
      
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Solar Invest</Text>
          <Text style={styles.headerSubtitle}>Earn Green, Live Clean</Text>
        </View>
        <TouchableOpacity style={styles.supportBadge} onPress={openWhatsAppSupport}>
          <Text style={styles.supportBadgeText}>💬 Support</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        {/* Dashboard Balance Card */}
        <View style={styles.card}>
          <Text style={styles.cardLabel}>Available Balance</Text>
          <Text style={styles.cardBalance}>₹{balance.toLocaleString()}</Text>
          <View style={styles.cardRow}>
            <View>
              <Text style={styles.subTextLabel}>Daily Earnings</Text>
              <Text style={styles.subTextValue}>₹{dailyEarnings}</Text>
            </View>
            <View>
              <Text style={styles.subTextLabel}>Total Invested</Text>
              <Text style={styles.subTextValue}>₹{totalInvested}</Text>
            </View>
          </View>
        </View>

        {/* Investment Plans */}
        <Text style={styles.sectionTitle}>Investment Plans</Text>
        {plans.map((plan) => (
          <View key={plan.id} style={styles.planCard}>
            <View style={styles.planHeader}>
              <Text style={styles.planName}>{plan.name}</Text>
              <Text style={styles.planPrice}>₹{plan.price.toLocaleString()}</Text>
            </View>
            <View style={styles.planDetails}>
              <Text style={styles.planDetailText}>⚡ Daily Income: ₹{plan.daily}</Text>
              <Text style={styles.planDetailText}>📅 Validity: {plan.days} Days</Text>
              <Text style={styles.planDetailText}>💰 Total Return: ₹{plan.total.toLocaleString()}</Text>
            </View>
            <TouchableOpacity style={styles.investBtn} onPress={() => handleInvestPress(plan)}>
              <Text style={styles.investBtnText}>Invest Now</Text>
            </TouchableOpacity>
          </View>
        ))}

        {/* Customer Support Banner */}
        <View style={styles.supportCard}>
          <Text style={styles.supportCardTitle}>Need Help or Fast Deposit Approval?</Text>
          <Text style={styles.supportCardSub}>24/7 Official Customer Support available on WhatsApp</Text>
          <TouchableOpacity style={styles.whatsappBtn} onPress={openWhatsAppSupport}>
            <Text style={styles.whatsappBtnText}>Chat on WhatsApp (+91 7412881011)</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Deposit & Payment Modal */}
      <Modal visible={modalVisible} transparent={true} animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Deposit & Invest</Text>
            {selectedPlan && (
              <Text style={styles.modalPlanInfo}>
                Plan: <Text style={{fontWeight: 'bold', color: '#0f172a'}}>{selectedPlan.name}</Text> | Amount: <Text style={{fontWeight: 'bold', color: '#16a34a'}}>₹{selectedPlan.price}</Text>
              </Text>
            )}

            <Text style={styles.selectUpiLabel}>Select UPI ID for Payment:</Text>
            
            {/* UPI Option 1 */}
            <TouchableOpacity 
              style={[styles.upiChoice, selectedUpi === 'deepsingh7412@ibl' && styles.upiChoiceActive]}
              onPress={() => setSelectedUpi('deepsingh7412@ibl')}
            >
              <Text style={styles.upiChoiceText}>1. deepsingh7412@ibl</Text>
            </TouchableOpacity>

            {/* UPI Option 2 */}
            <TouchableOpacity 
              style={[styles.upiChoice, selectedUpi === 'mandeep7412@axl' && styles.upiChoiceActive]}
              onPress={() => setSelectedUpi('mandeep7412@axl')}
            >
              <Text style={styles.upiChoiceText}>2. mandeep7412@axl</Text>
            </TouchableOpacity>

            <View style={styles.activeUpiBox}>
              <Text style={styles.activeUpiSub}>Pay on selected ID:</Text>
              <Text style={styles.activeUpiVal}>{selectedUpi}</Text>
            </View>

            <TextInput
              style={styles.input}
              placeholder="Enter 12-digit UTR / Ref No."
              placeholderTextColor="#94a3b8"
              value={transactionId}
              onChangeText={setTransactionId}
              keyboardType="number-pad"
            />

            <TouchableOpacity style={styles.submitModalBtn} onPress={handlePaymentSubmit}>
              <Text style={styles.submitModalBtnText}>Submit Deposit Details</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.closeModalBtn} onPress={() => setModalVisible(false)}>
              <Text style={styles.closeModalBtnText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0f172a' },
  header: { 
    paddingHorizontal: 20, 
    paddingVertical: 16, 
    backgroundColor: '#1e293b', 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center' 
  },
  headerTitle: { fontSize: 22, fontWeight: 'bold', color: '#f59e0b' },
  headerSubtitle: { fontSize: 13, color: '#94a3b8', marginTop: 2 },
  supportBadge: { backgroundColor: '#10b981', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20 },
  supportBadgeText: { color: '#ffffff', fontWeight: 'bold', fontSize: 12 },
  scrollContainer: { padding: 16, paddingBottom: 40 },
  card: { backgroundColor: '#1e293b', borderRadius: 16, padding: 20, marginBottom: 20, borderWidth: 1, borderColor: '#334155' },
  cardLabel: { fontSize: 14, color: '#94a3b8' },
  cardBalance: { fontSize: 32, fontWeight: 'bold', color: '#ffffff', marginVertical: 8 },
  cardRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 12, borderTopWidth: 1, borderTopColor: '#334155', paddingTop: 12 },
  subTextLabel: { fontSize: 12, color: '#94a3b8' },
  subTextValue: { fontSize: 16, fontWeight: '600', color: '#10b981', marginTop: 2 },
  sectionTitle: { fontSize: 20, fontWeight: 'bold', color: '#ffffff', marginBottom: 12 },
  planCard: { backgroundColor: '#1e293b', borderRadius: 16, padding: 16, marginBottom: 14, borderWidth: 1, borderColor: '#334155' },
  planHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  planName: { fontSize: 18, fontWeight: 'bold', color: '#ffffff' },
  planPrice: { fontSize: 18, fontWeight: 'bold', color: '#f59e0b' },
  planDetails: { marginBottom: 14 },
  planDetailText: { fontSize: 13, color: '#cbd5e1', marginBottom: 4 },
  investBtn: { backgroundColor: '#f59e0b', borderRadius: 10, paddingVertical: 12, alignItems: 'center' },
  investBtnText: { color: '#0f172a', fontWeight: 'bold', fontSize: 16 },
  supportCard: { backgroundColor: '#1e293b', borderRadius: 16, padding: 16, marginTop: 10, borderWidth: 1, borderColor: '#334155', alignItems: 'center' },
  supportCardTitle: { fontSize: 16, fontWeight: 'bold', color: '#ffffff', textAlign: 'center' },
  supportCardSub: { fontSize: 12, color: '#94a3b8', textAlign: 'center', marginTop: 4, marginBottom: 12 },
  whatsappBtn: { backgroundColor: '#25d366', paddingVertical: 12, paddingHorizontal: 20, borderRadius: 10, width: '100%', alignItems: 'center' },
  whatsappBtnText: { color: '#ffffff', fontWeight: 'bold', fontSize: 14 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.65)', justifyContent: 'center', alignItems: 'center', padding: 20 },
  modalContent: { backgroundColor: '#ffffff', borderRadius: 16, padding: 20, width: '100%', maxWidth: 360 },
  modalTitle: { fontSize: 20, fontWeight: 'bold', color: '#0f172a', marginBottom: 6, textAlign: 'center' },
  modalPlanInfo: { fontSize: 13, color: '#64748b', textAlign: 'center', marginBottom: 14 },
  selectUpiLabel: { fontSize: 12, fontWeight: '600', color: '#475569', marginBottom: 6 },
  upiChoice: { padding: 10, borderWidth: 1, borderColor: '#cbd5e1', borderRadius: 8, marginBottom: 6 },
  upiChoiceActive: { borderColor: '#16a34a', backgroundColor: '#f0fdf4' },
  upiChoiceText: { fontSize: 13, color: '#0f172a', fontWeight: '500' },
  activeUpiBox: { backgroundColor: '#f8fafc', padding: 10, borderRadius: 8, marginVertical: 10, alignItems: 'center', borderWidth: 1, borderColor: '#e2e8f0' },
  activeUpiSub: { fontSize: 11, color: '#64748b' },
  activeUpiVal: { fontSize: 15, fontWeight: 'bold', color: '#0f172a', marginTop: 2 },
  input: { backgroundColor: '#f8fafc', borderWidth: 1, borderColor: '#cbd5e1', borderRadius: 10, paddingHorizontal: 14, paddingVertical: 10, fontSize: 14, marginBottom: 12, color: '#0f172a' },
  submitModalBtn: { backgroundColor: '#16a34a', paddingVertical: 12, borderRadius: 10, alignItems: 'center' },
  submitModalBtnText: { color: '#ffffff', fontWeight: 'bold', fontSize: 15 },
  closeModalBtn: { marginTop: 10, alignItems: 'center', paddingVertical: 6 },
  closeModalBtnText: { color: '#64748b', fontWeight: '600' },
});
    
