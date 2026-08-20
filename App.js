import React, { useState } from 'react';
import { Text, View, ScrollView, TouchableOpacity, TextInput, Modal, Alert, SafeAreaView, StatusBar, Linking, Image, ImageBackground, Share } from 'react-native';

export default function App() {
  const [bal, setBal] = useState(1100.0);
  const [tab, setTab] = useState('All');
  const [nav, setNav] = useState('Invest');
  const [mRec, setMRec] = useState(false);
  const [mWdr, setMWdr] = useState(false);
  const [mAdm, setMAdm] = useState(false);
  const [aAuth, setAAuth] = useState(false);
  const [pin, setPin] = useState('');
  const [amt, setAmt] = useState('500');
  const [upi, setUpi] = useState('deepsingh7412@ibl');
  const [utr, setUtr] = useState('');
  const [wAmt, setWAmt] = useState('');
  const [wUpi, setWUpi] = useState('');
  const [plans, setPlans] = useState([]);
  const [dReq, setDReq] = useState([]);
  const [wReq, setWReq] = useState([]);
  const [hist, setHist] = useState([{ id: '1', t: 'Welcome Bonus', a: '₹1100.00', s: 'Done' }]);

  const refL = 'https://solarinvest.in/register?ref=Guri7412';
  const plist = [
    { id: 1, n: 'Solar Starter 7D', p: 150, d: 30, c: 'Weekly', dur: '7D' },
    { id: 2, n: 'Solar Express 7D', p: 300, d: 65, c: 'Weekly', dur: '7D' },
    { id: 3, n: 'Solar Micro 15D', p: 200, d: 25, c: '15 Days', dur: '15D' },
    { id: 4, n: 'Solar Mini 15D', p: 400, d: 55, c: '15 Days', dur: '15D' },
    { id: 5, n: 'Solar Boost 15D', p: 800, d: 120, c: '15 Days', dur: '15D' },
    { id: 6, n: 'Solar Plant 30D', p: 1500, d: 240, c: '30 Days', dur: '30D' },
    { id: 7, n: 'Solar Farm Max', p: 3000, d: 520, c: '30 Days', dur: '30D' }
  ];

  const filtered = tab === 'All' ? plist : plist.filter(x => x.c === tab);
  const openSup = () => Linking.openURL('https://t.me/Guri7412').catch(() => Alert.alert('Support', '@Guri7412'));
  const today = new Date().toDateString();

  const openApp = (app) => {
    const a = Number(amt) > 0 ? amt : '500';
    const gen = `upi://pay?pa=${upi}&pn=SolarInvest&am=${a}&cu=INR`;
    const u = app === 'pp' ? `phonepe://pay?pa=${upi}&pn=SolarInvest&am=${a}&cu=INR` : (app === 'pt' ? `paytmmp://pay?pa=${upi}&pn=SolarInvest&am=${a}&cu=INR` : gen);
    Linking.openURL(u).catch(() => Linking.openURL(gen).catch(() => Alert.alert('UPI', 'App open nahi hui.')));
  };

  const buyPlan = (p) => {
    if (bal < p.p) return Alert.alert('Low Balance', `₹${p.p} recharge karein.`, [{ text: 'Cancel' }, { text: 'Recharge', onPress: () => { setAmt(p.p.toString()); setMRec(true); } }]);
    setBal(b => b - p.p);
    setPlans([{ id: Date.now().toString(), n: p.n, d: p.d, lCol: '' }, ...plans]);
    setHist([{ id: Date.now().toString(), t: `Invest: ${p.n}`, a: `-₹${p.p}`, s: 'Running' }, ...hist]);
    Alert.alert('Success', `${p.n} activate ho gaya!`);
  };

  const collectIncome = (p) => {
    if (p.lCol === today) return Alert.alert('Collected', 'Aaj ki earning collect ho chuki hai. Kal claim karein.');
    setBal(b => b + p.d);
    setPlans(plans.map(x => x.id === p.id ? { ...x, lCol: today } : x));
    setHist([{ id: Date.now().toString(), t: `Income: ${p.n}`, a: `+₹${p.d}`, s: 'Credited' }, ...hist]);
    Alert.alert('Success', `₹${p.d} wallet me add ho gaye!`);
  };

  const submitDeposit = () => {
    if (!utr.trim() || utr.length < 6) return Alert.alert('Required', 'Valid UTR enter karein.');
    const a = Number(amt) > 0 ? Number(amt) : 500;
    setDReq([{ id: Date.now().toString(), a, utr, upi }, ...dReq]);
    setHist([{ id: Date.now().toString(), t: 'Recharge Req', a: `+₹${a}`, s: 'Pending Approval' }, ...hist]);
    Alert.alert('Sent', 'Recharge verification ke liye chala gaya hai.');
    setMRec(false);
    setUtr('');
  };

  const submitWithdraw = () => {
    if (!wAmt || Number(wAmt) < 200 || !wUpi.trim() || Number(wAmt) > bal) return Alert.alert('Error', 'Details check karein (Min ₹200).');
    const a = Number(wAmt);
    setBal(b => b - a);
    setWReq([{ id: Date.now().toString(), a, upi: wUpi }, ...wReq]);
    setHist([{ id: Date.now().toString(), t: `Withdraw (${wUpi})`, a: `-₹${a}`, s: 'Under Review' }, ...hist]);
    Alert.alert('Sent', `₹${a} withdrawal review me chali gayi.`);
    setMWdr(false);
    setWAmt('');
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#0a101d' }}>
      <StatusBar barStyle="light-content" backgroundColor="#0a101d" />
      <ImageBackground source={{ uri: 'https://images.unsplash.com/photo-1509391365360-2e959784a276?q=80&w=1080&auto=format&fit=crop' }} style={{ flex: 1 }} resizeMode="cover">
        <View style={{ flex: 1, backgroundColor: 'rgba(10, 16, 29, 0.88)' }}>
          
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 14, backgroundColor: 'rgba(14, 23, 38, 0.85)' }}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Image source={require('./icon.png')} style={{ width: 32, height: 32, borderRadius: 8, marginRight: 8 }} />
              <Text style={{ fontSize: 17, fontWeight: 'bold', color: '#fff' }}>SOLAR <Text style={{ color: '#f59e0b' }}>INVEST</Text></Text>
            </View>
            <TouchableOpacity style={{ backgroundColor: '#0284c7', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 16 }} onPress={openSup}>
              <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 11 }}>✈️ @Guri7412</Text>
            </TouchableOpacity>
          </View>

          <ScrollView contentContainerStyle={{ padding: 14, paddingBottom: 110 }}>
            {nav === 'Invest' && (
              <>
                <View style={{ backgroundColor: 'rgba(27, 38, 59, 0.92)', borderRadius: 14, padding: 14, marginBottom: 10, borderWidth: 1, borderColor: '#2e3d5b' }}>
                  <Text style={{ color: '#94a3b8', fontSize: 11, fontWeight: '700' }}>TOTAL WALLET BALANCE</Text>
                  <Text style={{ fontSize: 32, fontWeight: 'bold', color: '#fff', marginVertical: 6 }}>₹{bal.toFixed(2)}</Text>
                  <View style={{ flexDirection: 'row', gap: 10 }}>
                    <TouchableOpacity style={{ flex: 1, backgroundColor: '#16a34a', borderRadius: 8, padding: 10, alignItems: 'center' }} onPress={() => setMRec(true)}><Text style={{ color: '#fff', fontWeight: 'bold' }}>⚡ + Recharge</Text></TouchableOpacity>
                    <TouchableOpacity style={{ flex: 1, backgroundColor: '#2e3d5b', borderRadius: 8, padding: 10, alignItems: 'center' }} onPress={() => setMWdr(true)}><Text style={{ color: '#fff', fontWeight: 'bold' }}>↗ Withdraw</Text></TouchableOpacity>
                  </View>
                </View>

                {plans.length > 0 && (
                  <View style={{ marginBottom: 10 }}>
                    <Text style={{ color: '#fff', fontSize: 13, fontWeight: 'bold', marginBottom: 6 }}>⚡ Running Plans ({plans.length})</Text>
                    {plans.map((ap) => {
                      const isCol = ap.lCol === today;
                      return (
                        <View key={ap.id} style={{ backgroundColor: 'rgba(22, 34, 53, 0.95)', borderRadius: 8, padding: 10, marginBottom: 6, borderWidth: 1, borderColor: isCol ? '#334155' : '#22c55e', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                          <View><Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 13 }}>{ap.n}</Text><Text style={{ color: '#22c55e', fontSize: 11, fontWeight: 'bold' }}>Daily: +₹{ap.d}</Text></View>
                          <TouchableOpacity style={{ backgroundColor: isCol ? '#334155' : '#16a34a', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 6 }} onPress={() => collectIncome(ap)}>
                            <Text style={{ color: isCol ? '#94a3b8' : '#fff', fontSize: 11, fontWeight: 'bold' }}>{isCol ? '✅ Done' : '💰 Collect'}</Text>
                          </TouchableOpacity>
                        </View>
                      );
                    })}
                  </View>
                )}

                <View style={{ flexDirection: 'row', backgroundColor: 'rgba(22, 34, 53, 0.85)', borderRadius: 8, padding: 3, marginBottom: 10 }}>
                  {['All', 'Weekly', '15 Days', '30 Days'].map((t) => (
                    <TouchableOpacity key={t} style={{ flex: 1, paddingVertical: 6, alignItems: 'center', borderRadius: 6, backgroundColor: tab === t ? '#f59e0b' : 'transparent' }} onPress={() => setTab(t)}>
                      <Text style={{ color: tab === t ? '#fff' : '#94a3b8', fontSize: 11, fontWeight: tab === t ? 'bold' : 'normal' }}>{t}</Text>
                    </TouchableOpacity>
                  ))}
                </View>

                {filtered.map((p) => (
                  <View key={p.id} style={{ backgroundColor: 'rgba(27, 38, 59, 0.92)', borderRadius: 12, padding: 12, marginBottom: 8, borderWidth: 1, borderColor: '#2e3d5b', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                    <View><Text style={{ color: '#fff', fontSize: 14, fontWeight: 'bold' }}>{p.n}</Text><Text style={{ color: '#94a3b8', fontSize: 11 }}>Daily: <Text style={{ color: '#22c55e', fontWeight: 'bold' }}>₹{p.d}</Text> | {p.dur}</Text></View>
                    <TouchableOpacity style={{ backgroundColor: '#f59e0b', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 6 }} onPress={() => buyPlan(p)}><Text style={{ color: '#000', fontWeight: 'bold', fontSize: 12 }}>Invest ₹{p.p}</Text></TouchableOpacity>
                  </View>
                ))}
              </>
            )}

            {nav === 'History' && (
              <View style={{ backgroundColor: 'rgba(27, 38, 59, 0.92)', borderRadius: 14, padding: 14 }}>
                <Text style={{ color: '#fff', fontSize: 14, fontWeight: 'bold', marginBottom: 6 }}>History</Text>
                {hist.map((h) => (
                  <View key={h.id} style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: '#334155' }}>
                    <Text style={{ color: '#fff', fontSize: 12 }}>{h.t}</Text>
                    <View style={{ alignItems: 'flex-end' }}><Text style={{ fontSize: 12, fontWeight: 'bold', color: h.a.includes('+') ? '#22c55e' : '#fff' }}>{h.a}</Text><Text style={{ color: '#94a3b8', fontSize: 10 }}>{h.s}</Text></View>
                  </View>
                ))}
              </View>
            )}

            {nav === 'Invite' && (
              <View style={{ backgroundColor: 'rgba(27, 38, 59, 0.92)', borderRadius: 14, padding: 14 }}>
                <Text style={{ color: '#f59e0b', fontSize: 11, fontWeight: 'bold' }}>🎉 30% BONUS</Text>
                <Text style={{ color: '#fff', fontSize: 14, fontWeight: 'bold', marginVertical: 6 }}>Invite & Earn 30%</Text>
                <Text style={{ color: '#22c55e', fontWeight: 'bold', fontSize: 11, marginBottom: 10 }}>{refL}</Text>
                <TouchableOpacity style={{ backgroundColor: '#16a34a', padding: 10, borderRadius: 8, alignItems: 'center', marginBottom: 6 }} onPress={() => Share.share({ message: `Solar Invest 30% Bonus Link: ${refL}` })}><Text style={{ color: '#fff', fontWeight: 'bold' }}>🚀 Share Invite Link</Text></TouchableOpacity>
                <TouchableOpacity style={{ backgroundColor: '#0284c7', padding: 10, borderRadius: 8, alignItems: 'center' }} onPress={openSup}><Text style={{ color: '#fff', fontWeight: 'bold' }}>✈️ Support (@Guri7412)</Text></TouchableOpacity>
              </View>
            )}

            {nav === 'Profile' && (
              <View style={{ backgroundColor: 'rgba(27, 38, 59, 0.92)', borderRadius: 14, padding: 14 }}>
                <Text style={{ color: '#fff', fontSize: 14, fontWeight: 'bold', marginBottom: 6 }}>Dashboard</Text>
                <Text style={{ color: '#e2e8f0', fontSize: 12, marginBottom: 4 }}>Total Balance: ₹{bal.toFixed(2)}</Text>
                <Text style={{ color: '#e2e8f0', fontSize: 12, marginBottom: 8 }}>Active Plans: {plans.length}</Text>
                <TouchableOpacity style={{ backgroundColor: '#f59e0b', padding: 10, borderRadius: 8, alignItems: 'center', marginBottom: 6 }} onPress={() => setMAdm(true)}><Text style={{ color: '#000', fontWeight: 'bold' }}>👑 Admin Panel (Pending: {dReq.length + wReq.length})</Text></TouchableOpacity>
                <TouchableOpacity style={{ backgroundColor: '#0284c7', padding: 10, borderRadius: 8, alignItems: 'center' }} onPress={openSup}><Text style={{ color: '#fff', fontWeight: 'bold' }}>✈️ 24/7 Support</Text></TouchableOpacity>
              </View>
            )}
          </ScrollView>

          <View style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 65, backgroundColor: '#0c1322', flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', borderTopWidth: 1, borderTopColor: '#1e293b' }}>
            {[{ id: 'Invest', l: 'Invest', i: '⚡' }, { id: 'History', l: 'History', i: '📋' }, { id: 'Invite', l: 'Invite', i: '🎁' }, { id: 'Profile', l: 'Profile', i: '👤' }].map((item) => (
              <TouchableOpacity key={item.id} style={{ alignItems: 'center', flex: 1 }} onPress={() => setNav(item.id)}>
                <Text style={{ fontSize: 18, color: nav === item.id ? '#f59e0b' : '#64748b' }}>{item.i}</Text>
                <Text style={{ fontSize: 10, color: nav === item.id ? '#f59e0b' : '#94a3b8', fontWeight: 'bold' }}>{item.l}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ImageBackground>

      {/* Recharge Modal with Live Dynamic QR & UPI */}
      <Modal visible={mRec} transparent={true} animationType="fade">
        <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.85)', justifyContent: 'center', alignItems: 'center', padding: 16 }}>
          <View style={{ backgroundColor: '#fff', borderRadius: 16, padding: 14, width: '100%', maxWidth: 350 }}>
            <Text style={{ fontSize: 15, fontWeight: 'bold', color: '#0f172a', marginBottom: 4 }}>Recharge & Scan QR</Text>
            <TextInput style={{ borderWidth: 1, borderColor: '#cbd5e1', borderRadius: 6, padding: 6, marginVertical: 3 }} placeholder="Amount (₹)" value={amt} onChangeText={setAmt} keyboardType="number-pad" />
            <View style={{ flexDirection: 'row', gap: 6, marginVertical: 3 }}>
              <TouchableOpacity style={{ flex: 1, borderWidth: 1, borderColor: upi === 'deepsingh7412@ibl' ? '#16a34a' : '#cbd5e1', borderRadius: 6, padding: 5, backgroundColor: upi === 'deepsingh7412@ibl' ? '#f0fdf4' : '#fff' }} onPress={() => setUpi('deepsingh7412@ibl')}><Text style={{ fontSize: 10, fontWeight: 'bold' }}>deepsingh7412@ibl</Text></TouchableOpacity>
              <TouchableOpacity style={{ flex: 1, borderWidth: 1, borderColor: upi === 'mandeep7412@axl' ? '#16a34a' : '#cbd5e1', borderRadius: 6, padding: 5, backgroundColor: upi === 'mandeep7412@axl' ? '#f0fdf4' : '#fff' }} onPress={() => setUpi('mandeep7412@axl')}><Text style={{ fontSize: 10, fontWeight: 'bold' }}>mandeep7412@axl</Text></TouchableOpacity>
            </View>
            <View style={{ alignItems: 'center', marginVertical: 4, backgroundColor: '#f8fafc', padding: 6, borderRadius: 8 }}>
              <Image source={{ uri: `https://api.qrserver.com/v1/create-qr-code/?size=140x140&data=upi://pay?pa=${upi}&pn=SolarInvest&am=${amt || '500'}` }} style={{ width: 130, height: 130 }} />
              <Text style={{ fontSize: 10, color: '#64748b', marginTop: 2 }}>Scan & Pay ₹{amt || '500'}</Text>
            </View>
            <View style={{ flexDirection: 'row', gap: 6, marginBottom: 4 }}>
              <TouchableOpacity style={{ flex: 1, backgroundColor: '#5f259f', padding: 7, borderRadius: 6, alignItems: 'center' }} onPress={() => openApp('pp')}><Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 11 }}>🟣 PhonePe</Text></TouchableOpacity>
              <TouchableOpacity style={{ flex: 1, backgroundColor: '#00baf2', padding: 7, borderRadius: 6, alignItems: 'center' }} onPress={() => openApp('pt')}><Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 11 }}>🔵 Paytm</Text></TouchableOpacity>
            </View>
            <TextInput style={{ borderWidth: 1, borderColor: '#cbd5e1', borderRadius: 6, padding: 6, marginVertical: 3 }} placeholder="Enter 12-digit UTR No." value={utr} onChangeText={setUtr} keyboardType="number-pad" />
            <TouchableOpacity style={{ backgroundColor: '#16a34a', borderRadius: 6, padding: 9, alignItems: 'center', marginTop: 3 }} onPress={submitDeposit}><Text style={{ color: '#fff', fontWeight: 'bold' }}>Submit Recharge Request</Text></TouchableOpacity>
            <TouchableOpacity style={{ alignItems: 'center', marginTop: 6 }} onPress={() => setMRec(false)}><Text style={{ color: '#ef4444', fontWeight: 'bold' }}>Cancel</Text></TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Withdraw Modal */}
      <Modal visible={mWdr} transparent={true} animationType="fade">
        <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.75)', justifyContent: 'center', alignItems: 'center', padding: 16 }}>
          <View style={{ backgroundColor: '#fff', borderRadius: 16, padding: 16, width: '100%', maxWidth: 350 }}>
            <Text style={{ fontSize: 15, fontWeight: 'bold', color: '#0f172a', marginBottom: 4 }}>Withdraw Balance</Text>
            <Text style={{ color: '#64748b', fontSize: 11, marginBottom: 4 }}>Available: ₹{bal.toFixed(2)}</Text>
            <TextInput style={{ borderWidth: 1, borderColor: '#cbd5e1', borderRadius: 6, padding: 6, marginVertical: 4 }} placeholder="Amount (Min ₹200)" value={wAmt} onChangeText={setWAmt} keyboardType="number-pad" />
            <TextInput style={{ borderWidth: 1, borderColor: '#cbd5e1', borderRadius: 6, padding: 6, marginVertical: 4 }} placeholder="Your UPI ID" value={wUpi} onChangeText={setWUpi} />
            <TouchableOpacity style={{ backgroundColor: '#16a34a', borderRadius: 6, padding: 9, alignItems: 'center', marginTop: 4 }} onPress={submitWithdraw}><Text style={{ color: '#fff', fontWeight: 'bold' }}>Submit Withdrawal Request</Text></TouchableOpacity>
            <TouchableOpacity style={{ alignItems: 'center', marginTop: 6 }} onPress={() => setMWdr(false)}><Text style={{ color: '#ef4444', fontWeight: 'bold' }}>Cancel</Text></TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Admin Panel Modal (PIN 7412) */}
      <Modal visible={mAdm} transparent={true} animationType="slide">
        <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.85)', justifyContent: 'center', alignItems: 'center', padding: 16 }}>
          <View style={{ backgroundColor: '#0f172a', borderRadius: 16, padding: 16, width: '100%', maxHeight: '85%', borderWidth: 1, borderColor: '#334155' }}>
            <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#f59e0b', marginBottom: 8 }}>👑 Admin Panel</Text>
            {!aAuth ? (
              <View>
                <Text style={{ color: '#94a3b8', fontSize: 12, marginBottom: 4 }}>Enter PIN (7412):</Text>
                <TextInput style={{ backgroundColor: '#1e293b', color: '#fff', padding: 8, borderRadius: 6, marginBottom: 8 }} placeholder="PIN" placeholderTextColor="#64748b" secureTextEntry value={pin} onChangeText={setPin} keyboardType="number-pad" />
                <TouchableOpacity style={{ backgroundColor: '#16a34a', padding: 9, borderRadius: 6, alignItems: 'center' }} onPress={() => { if (pin === '7412') { setAAuth(true); setPin(''); } else { Alert.alert('PIN', 'Galat PIN'); } }}><Text style={{ color: '#fff', fontWeight: 'bold' }}>Login</Text></TouchableOpacity>
              </View>
            ) : (
              <ScrollView showsVerticalScrollIndicator={false}>
                <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 13, marginBottom: 4 }}>⚡ Recharges ({dReq.length})</Text>
                {dReq.length === 0 ? <Text style={{ color: '#64748b', fontSize: 11, marginBottom: 8 }}>No pending recharges.
