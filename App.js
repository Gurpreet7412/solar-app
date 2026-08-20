import React, { useState } from 'react';
import { Text, View, ScrollView, TouchableOpacity, TextInput, Modal, Alert, SafeAreaView, StatusBar, Linking, Image, ImageBackground, Share } from 'react-native';

export default function App() {
  const [b, setB] = useState(1100.0), [tab, setTab] = useState('All'), [nav, setNav] = useState('Invest'), [mRec, setMRec] = useState(false), [mWdr, setMWdr] = useState(false), [mAdm, setMAdm] = useState(false), [auth, setAuth] = useState(false), [pin, setPin] = useState(''), [amt, setAmt] = useState('500'), [upi, setUpi] = useState('deepsingh7412@ibl'), [utr, setUtr] = useState(''), [wAmt, setWAmt] = useState(''), [wUpi, setWUpi] = useState(''), [plans, setPlans] = useState([]), [dReq, setDReq] = useState([]), [wReq, setWReq] = useState([]), [hist, setHist] = useState([{ id: '1', t: 'Welcome Bonus', a: '₹1100.00' }]);
  const plist = [{ id: 1, n: 'Solar Starter', p: 150, d: 30, c: 'Weekly' }, { id: 2, n: 'Solar Mini', p: 400, d: 55, c: '15 Days' }];
  const today = new Date().toDateString();

  const buyPlan = (p) => {
    if (b < p.p) return Alert.alert('Error', 'Low Balance');
    setB(b - p.p); setPlans([{ id: Date.now().toString(), n: p.n, d: p.d, lCol: '' }, ...plans]);
    Alert.alert('Success', 'Activated!');
  };

  const collect = (p) => {
    if (p.lCol === today) return Alert.alert('Done', 'Aaj collect kar liya.');
    setB(b + p.d); setPlans(plans.map(x => x.id === p.id ? { ...x, lCol: today } : x));
    Alert.alert('Success', 'Added!');
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#0a101d' }}>
      <ScrollView contentContainerStyle={{ padding: 20 }}>
        <Text style={{ color: '#fff', fontSize: 24, fontWeight: 'bold' }}>₹{b.toFixed(2)}</Text>
        <TouchableOpacity style={{ backgroundColor: '#16a34a', padding: 15, marginVertical: 10 }} onPress={() => setMRec(true)}><Text style={{ color: '#fff' }}>Recharge</Text></TouchableOpacity>
        <TouchableOpacity style={{ backgroundColor: '#0284c7', padding: 15 }} onPress={() => setMWdr(true)}><Text style={{ color: '#fff' }}>Withdraw</Text></TouchableOpacity>
        <TouchableOpacity onPress={() => setMAdm(true)}><Text style={{ color: '#f59e0b', marginTop: 10 }}>Admin Panel</Text></TouchableOpacity>
        {plans.map(ap => (
          <View key={ap.id} style={{ marginVertical: 5, padding: 10, backgroundColor: '#1e293b' }}>
            <Text style={{ color: '#fff' }}>{ap.n}</Text>
            <TouchableOpacity onPress={() => collect(ap)}><Text style={{ color: '#22c55e' }}>{ap.lCol === today ? 'Collected' : 'Collect'}</Text></TouchableOpacity>
          </View>
        ))}
      </ScrollView>

      {/* Admin Login */}
      <Modal visible={mAdm} transparent={true}>
        <View style={{ flex: 1, backgroundColor: '#0009', padding: 20, justifyContent: 'center' }}>
          {!auth ? (
            <View style={{ backgroundColor: '#fff', padding: 20 }}>
              <TextInput placeholder="PIN (7412)" secureTextEntry onChangeText={setPin} />
              <TouchableOpacity onPress={() => { if (pin === '7412') setAuth(true); }}><Text>Login</Text></TouchableOpacity>
            </View>
          ) : (
            <ScrollView style={{ backgroundColor: '#fff', padding: 20 }}>
              <Text>Recharges: {dReq.length}</Text>
              <TouchableOpacity onPress={() => setMAdm(false)}><Text>Close</Text></TouchableOpacity>
            </ScrollView>
          )}
        </View>
      </Modal>

      {/* Recharge Modal */}
      <Modal visible={mRec} transparent={true}>
        <View style={{ flex: 1, backgroundColor: '#0009', justifyContent: 'center', padding: 20 }}>
          <View style={{ backgroundColor: '#fff', padding: 20 }}>
            <TextInput placeholder="Amount" value={amt} onChangeText={setAmt} />
            <TextInput placeholder="UTR" value={utr} onChangeText={setUtr} />
            <TouchableOpacity onPress={() => { setDReq([...dReq, { id: Date.now(), a: amt, utr }]); setMRec(false); }}><Text>Submit</Text></TouchableOpacity>
            <TouchableOpacity onPress={() => setMRec(false)}><Text>Cancel</Text></TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
  }
  
