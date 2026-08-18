import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Modal, TextInput, SafeAreaView, Image } from 'react-native';

export default function App() {
  const [balance, setBalance] = useState(1500);
  const [tab, setTab] = useState('home');
  const [filter, setFilter] = useState('all');
  const [history, setHistory] = useState([]);
  const [modalType, setModalType] = useState(null);
  const [amt, setAmt] = useState('');
  const [field, setField] = useState('');

  const plans = [
    { id: 1, title: "Solar Micro 15D", price: 200, daily: 25, days: 15, cat: '15d' },
    { id: 2, title: "Solar Mini 15D", price: 400, daily: 55, days: 15, cat: '15d' },
    { id: 3, title: "Solar Boost 15D", price: 800, daily: 120, days: 15, cat: '15d' },
    { id: 4, title: "Solar Starter 30D", price: 300, daily: 20, days: 30, cat: '30d' },
    { id: 5, title: "Solar Standard 30D", price: 500, daily: 40, days: 30, cat: '30d' },
    { id: 6, title: "Solar Pro 30D", price: 1000, daily: 90, days: 30, cat: '30d' },
  ];

  const buy = (p) => {
    if (balance < p.price) return alert("Low balance! Please recharge.");
    setBalance(balance - p.price);
    setHistory([...history, p]);
    alert("Plan Activated!");
  };

  const submitRecharge = () => {
    if (!field) return alert("Enter UTR number");
    setBalance(balance + Number(amt));
    setModalType(null);
    setAmt('');
    setField('');
    alert("Recharge Success!");
  };

  const submitWithdraw = () => {
    if (!amt || Number(amt) > balance) return alert("Invalid amount or low balance");
    if (!field) return alert("Enter UPI ID");
    setBalance(balance - Number(amt));
    setModalType(null);
    setAmt('');
    setField('');
    alert("Withdrawal submitted!");
  };

  const list = filter === 'all' ? plans : plans.filter(p => p.cat === filter);

  return (
    <SafeAreaView style={s.box}>
      <View style={s.head}><Text style={s.logo}>⚡ SOLAR INVEST</Text></View>

      <View style={s.mainArea}>
        {tab === 'home' && (
          <ScrollView contentContainerStyle={s.pad}>
            <View style={s.card}>
              <Text style={s.cSub}>Available Balance</Text>
              <Text style={s.cBal}>₹{balance.toFixed(2)}</Text>
              <View style={s.row}>
                <TouchableOpacity style={s.btnG} onPress={() => setModalType('recharge')}>
                  <Text style={s.btnT}>+ Recharge</Text>
                </TouchableOpacity>
                <TouchableOpacity style={s.btnR} onPress={() => setModalType('withdraw')}>
                  <Text style={s.btnT}>Withdraw</Text>
                </TouchableOpacity>
              </View>
            </View>

            <View style={s.row}>
              <TouchableOpacity style={[s.fBtn, filter === 'all' && s.fAct]} onPress={() => setFilter('all')}>
                <Text style={filter === 'all' ? s.fTxtA : s.fTxt}>All</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[s.fBtn, filter === '15d' && s.fAct]} onPress={() => setFilter('15d')}>
                <Text style={filter === '15d' ? s.fTxtA : s.fTxt}>15 Days</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[s.fBtn, filter === '30d' && s.fAct]} onPress={() => setFilter('30d')}>
                <Text style={filter === '30d' ? s.fTxtA : s.fTxt}>Monthly</Text>
              </TouchableOpacity>
            </View>

            {list.map(p => (
              <View key={p.id} style={s.pCard}>
                <View>
                  <Text style={s.pTitle}>{p.title}</Text>
                  <Text style={s.pSub}>Daily: ₹{p.daily} | {p.days} Days</Text>
                </View>
                <TouchableOpacity style={s.btnB} onPress={() => buy(p)}>
                  <Text style={s.btnT}>₹{p.price}</Text>
                </TouchableOpacity>
              </View>
            ))}
            <View style={{ height: 20 }} />
          </ScrollView>
        )}

        {tab === 'invite' && (
          <ScrollView contentContainerStyle={s.pad}>
            <View style={s.invCard}>
              <Text style={s.invT}>Invite & Earn</Text>
              <Text style={s.invCode}>SOLAR992</Text>
              <TouchableOpacity style={s.btnW} onPress={() => alert("Link Copied!")}>
                <Text style={s.btnWT}>Copy Link</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        )}

        {tab === 'me' && (
          <ScrollView contentContainerStyle={s.pad}>
            <Text style={s.secT}>My Plans ({history.length})</Text>
            {history.length === 0 ? (
              <Text style={{ color: '#64748b', marginTop: 10 }}>No plans active yet.</Text>
            ) : (
              history.map((h, i) => (
                <View key={i} style={s.pCard}>
                  <Text style={s.pTitle}>{h.title}</Text>
                  <Text style={{ color: 'green', fontWeight: 'bold' }}>+₹{h.daily}/day</Text>
                </View>
              ))
            )}
          </ScrollView>
        )}
      </View>

      {/* Fixed Bottom Navigation */}
      <View style={s.nav}>
        <TouchableOpacity style={s.navBtn} onPress={() => setTab('home')}>
          <Text style={s.navEmoji}>🏠</Text>
          <Text style={tab === 'home' ? s.navA : s.navI}>Home</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={s.navBtn} onPress={() => setTab('invite')}>
          <Text style={s.navEmoji}>🎁</Text>
          <Text style={tab === 'invite' ? s.navA : s.navI}>Invite</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={s.navBtn} onPress={() => setTab('me')}>
          <Text style={s.navEmoji}>👤</Text>
          <Text style={tab === 'me' ? s.navA : s.navI}>Profile</Text>
        </TouchableOpacity>
      </View>

      {/* Modals */}
      <Modal visible={modalType === 'recharge'} transparent>
        <View style={s.mBg}>
          <View style={s.mBox}>
            <Text style={s.secT}>Enter Recharge Amount</Text>
            <TextInput placeholder="₹ Amount" keyboardType="numeric" value={amt} onChangeText={setAmt} style={s.inp} />
            <TouchableOpacity style={s.btnG} onPress={() => setModalType('qr')}><Text style={s.btnT}>Next (QR Pay)</Text></TouchableOpacity>
            <TouchableOpacity style={s.btnC} onPress={() => setModalType(null)}><Text>Cancel</Text></TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Modal visible={modalType === 'qr'} transparent>
        <View style={s.mBg}>
          <View style={s.mBox}>
            <Text style={s.secT}>Pay ₹{amt}</Text>
            <Image source={{ uri: `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=upi://pay?pa=pay@upi&am=${amt}` }} style={{ width: 120, height: 120, alignSelf: 'center', marginVertical: 10 }} />
            <TextInput placeholder="Enter UTR Number" keyboardType="numeric" value={field} onChangeText={setField} style={s.inp} />
            <TouchableOpacity style={s.btnG} onPress={submitRecharge}><Text style={s.btnT}>Submit UTR</Text></TouchableOpacity>
            <TouchableOpacity style={s.btnC} onPress={() => setModalType(null)}><Text>Cancel</Text></TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Modal visible={modalType === 'withdraw'} transparent>
        <View style={s.mBg}>
          <View style={s.mBox}>
            <Text style={s.secT}>Withdraw Money</Text>
            <TextInput placeholder="₹ Amount" keyboardType="numeric" value={amt} onChangeText={setAmt} style={s.inp} />
            <TextInput placeholder="UPI ID" value={field} onChangeText={setField} style={s.inp} />
            <TouchableOpacity style={s.btnR} onPress={submitWithdraw}><Text style={s.btnT}>Withdraw</Text></TouchableOpacity>
            <TouchableOpacity style={s.btnC} onPress={() => setModalType(null)}><Text>Cancel</Text></TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  box: { flex: 1, backgroundColor: '#f1f5f9' },
  head: { padding: 14, backgroundColor: '#fff', borderBottomWidth: 1, borderColor: '#ddd' },
  logo: { fontWeight: '900', fontSize: 16 },
  mainArea: { flex: 1 },
  pad: { padding: 12 },
  card: { backgroundColor: '#0f172a', padding: 18, borderRadius: 12, marginBottom: 12 },
  cSub: { color: '#94a3b8', fontSize: 12 },
  cBal: { color: '#fff', fontSize: 28, fontWeight: 'bold', marginVertical: 4 },
  row: { flexDirection: 'row', gap: 8, marginTop: 6 },
  btnG: { flex: 1, backgroundColor: '#16a34a', padding: 10, borderRadius: 8, alignItems: 'center' },
  btnR: { flex: 1, backgroundColor: '#dc2626', padding: 10, borderRadius: 8, alignItems: 'center' },
  btnB: { backgroundColor: '#2563eb', paddingVertical: 8, paddingHorizontal: 16, borderRadius: 8 },
  btnT: { color: '#fff', fontWeight: 'bold' },
  fBtn: { flex: 1, padding: 8, backgroundColor: '#e2e8f0', borderRadius: 6, alignItems: 'center' },
  fAct: { backgroundColor: '#2563eb' },
  fTxt: { color: '#333', fontWeight: '600' },
  fTxtA: { color: '#fff', fontWeight: '600' },
  pCard: { backgroundColor: '#fff', padding: 12, borderRadius: 10, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 10 },
  pTitle: { fontWeight: 'bold', fontSize: 14 },
  pSub: { color: '#64748b', fontSize: 12, marginTop: 2 },
  nav: { flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', height: 60, backgroundColor: '#ffffff', borderTopWidth: 1, borderColor: '#cbd5e1' },
  navBtn: { alignItems: 'center', justifyContent: 'center', flex: 1 },
  navEmoji: { fontSize: 18 },
  navI: { color: '#64748b', fontSize: 11, marginTop: 2 },
  navA: { color: '#2563eb', fontWeight: 'bold', fontSize: 11, marginTop: 2 },
  invCard: { backgroundColor: '#2563eb', padding: 20, borderRadius: 12, alignItems: 'center' },
  invT: { color: '#fff', fontWeight: 'bold', fontSize: 18 },
  invCode: { color: '#fff', fontSize: 24, fontWeight: 'bold', marginVertical: 10 },
  btnW: { backgroundColor: '#fff', padding: 10, borderRadius: 8, width: '100%', alignItems: 'center' },
  btnWT: { color: '#2563eb', fontWeight: 'bold' },
  secT: { fontWeight: 'bold', fontSize: 15, marginBottom: 8 },
  mBg: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', padding: 20 },
  mBox: { backgroundColor: '#fff', padding: 16, borderRadius: 12 },
  inp: { borderWidth: 1, borderColor: '#ccc', borderRadius: 8, padding: 10, marginVertical: 8 },
  btnC: { padding: 10, alignItems: 'center', marginTop: 4 }
});
