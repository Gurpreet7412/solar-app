import React, { useState } from 'react';
import { Text, View, ScrollView, TouchableOpacity, TextInput, Modal, Alert, SafeAreaView, StatusBar, Linking, Image, Share, Platform } from 'react-native';

export default function App() {
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
  const [history, setHistory] = useState([{ id: '1', type: 'Welcome Bonus', amount: '₹1100.00', status: 'Completed', date: 'Initial' }]);

  const refLink = 'https://solarinvest.in/register?ref=Guri7412';
  const todayStr = new Date().toDateString();

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
    const generic = 'upi://pay?pa=' + selectedUpi + '&pn=SolarInvest&am=' + amt + '&cu=INR';
    const u = app === 'phonepe' ? 'phonepe://pay?pa=' + selectedUpi + '&pn=SolarInvest&am=' + amt + '&cu=INR' : (app === 'paytm' ? 'paytmmp://pay?pa=' + selectedUpi + '&pn=SolarInvest&am=' + amt + '&cu=INR' : generic);
    Linking.openURL(u).catch(() => Linking.openURL(generic).catch(() => Alert.alert('Error', 'Manual payment karein.')));
  };
    const handleInvest = (p) => {
    if (balance < p.price) return Alert.alert('Low Balance', '₹' + p.price + ' recharge karein.');
    setBalance(b => b - p.price);
    setMyActivePlans([{ id: Date.now().toString(), name: p.name, price: p.price, daily: p.daily, daysLeft: p.daysCount, lastCollected: '' }, ...myActivePlans]);
    setHistory([{ id: Date.now().toString(), type: 'Invest: ' + p.name, amount: '-₹' + p.price, status: 'Running', date: 'Today' }, ...history]);
    Alert.alert('Success', p.name + ' activate ho gaya!');
  };

  const handleClaimIncome = (plan) => {
    if (plan.lastCollected === todayStr) return Alert.alert('Already Collected', 'Aaj ki earning le chuke hain.');
    setBalance(b => b + plan.daily);
    setMyActivePlans(myActivePlans.map(p => p.id === plan.id ? { ...p, lastCollected: todayStr } : p));
    setHistory([{ id: Date.now().toString(), type: 'Income: ' + plan.name, amount: '+₹' + plan.daily, status: 'Credited', date: 'Today' }, ...history]);
    Alert.alert('Success', '₹' + plan.daily + ' add ho gaye!');
  };

  const handleDepositSubmit = () => {
    if (!transactionId.trim() || transactionId.length < 6) return Alert.alert('Required', 'Valid UTR enter karein.');
    const amt = Number(depositAmount) > 0 ? Number(depositAmount) : 500;
    const req = { id: Date.now().toString(), amount: amt, utr: transactionId, upi: selectedUpi, date: 'Today' };
    setDepositRequests([req, ...depositRequests]);
    setHistory([{ id: req.id, type: 'Recharge Request', amount: '+₹' + amt, status: 'Pending', date: 'Today' }, ...history]);
    Alert.alert('Sent', 'Recharge verify hone ke baad add hoga.');
    setModalVisible(false); setTransactionId('');
  };

  const handleWithdrawSubmit = () => {
    if (!withdrawAmount || Number(withdrawAmount) < 200 || !withdrawUpi.trim() || Number(withdrawAmount) > balance) return Alert.alert('Error', 'Details check karein.');
    const amt = Number(withdrawAmount);
    setBalance(b => b - amt);
    const req = { id: Date.now().toString(), amount: amt, upi: withdrawUpi, date: 'Today' };
    setWithdrawRequests([req, ...withdrawRequests]);
    setHistory([{ id: req.id, type: 'Withdraw (' + withdrawUpi + ')', amount: '-₹' + amt, status: 'Review', date: 'Today' }, ...history]);
    Alert.alert('Sent', 'Withdrawal request submit ho gayi.');
    setWithdrawModalVisible(false); setWithdrawAmount('');
  };
    return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#0a101d' }}>
      <View style={{ padding: 15, backgroundColor: '#0e1726', alignItems: 'center' }}><Text style={{ color: '#fff', fontSize: 18, fontWeight: 'bold' }}>SOLAR INVEST</Text></View>
      <ScrollView contentContainerStyle={{ padding: 14, paddingBottom: 100 }}>
        {bottomNav === 'Invest' && (
          <View style={{ backgroundColor: '#1e293b', borderRadius: 14, padding: 16 }}>
            <Text style={{ color: '#fff', fontSize: 32, fontWeight: 'bold' }}>₹{balance.toFixed(2)}</Text>
            <View style={{ flexDirection: 'row', gap: 10, marginTop: 10 }}>
              <TouchableOpacity style={{ flex: 1, backgroundColor: '#16a34a', padding: 12, borderRadius: 10, alignItems: 'center' }} onPress={() => setModalVisible(true)}><Text style={{ color: '#fff' }}>+ Recharge</Text></TouchableOpacity>
              <TouchableOpacity style={{ flex: 1, backgroundColor: '#0284c7', padding: 12, borderRadius: 10, alignItems: 'center' }} onPress={() => setWithdrawModalVisible(true)}><Text style={{ color: '#fff' }}>↗ Withdraw</Text></TouchableOpacity>
            </View>
          </View>
        )}
      </ScrollView>

      {/* Bottom Tabs */}
      <View style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 60, backgroundColor: '#0e1726', flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', borderTopWidth: 1, borderColor: '#334155' }}>
        <TouchableOpacity onPress={() => setBottomNav('Invest')}><Text style={{color:bottomNav==='Invest'?'#f59e0b':'#fff'}}>⚡ Invest</Text></TouchableOpacity>
        <TouchableOpacity onPress={() => setBottomNav('History')}><Text style={{color:bottomNav==='History'?'#f59e0b':'#fff'}}>📋 History</Text></TouchableOpacity>
        <TouchableOpacity onPress={() => setBottomNav('Invite')}><Text style={{color:bottomNav==='Invite'?'#f59e0b':'#fff'}}>🎁 Invite</Text></TouchableOpacity>
        <TouchableOpacity onPress={() => setAdminModalVisible(true)}><Text style={{color:bottomNav==='Profile'?'#f59e0b':'#fff'}}>👤 Profile</Text></TouchableOpacity>
      </View>
    </SafeAreaView>
  );
        }
        
