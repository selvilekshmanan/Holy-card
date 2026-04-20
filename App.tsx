/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */
import Toast from 'react-native-toast-message';
import { StatusBar, useColorScheme } from 'react-native';
import {
  SafeAreaProvider,
} from 'react-native-safe-area-context';
import Home from './src/app/Home';
import { StripeProvider } from '@stripe/stripe-react-native';
import Login from './src/app/Login';
import SignUp from './src/app/SignUp';
import { useState } from 'react';


function App() {

  const isDarkMode = useColorScheme() === 'dark';

  return (
    <StripeProvider publishableKey='pk_test_51THKGP4hdt18sDUOKjba9Y9DYkXEpX25iqUUhtpJER0PLzKLoJYLrwbJAaJcFW2RiH7r3hYvMgVNg7lnG1S6wWCK00QJMROoIK'>
    <SafeAreaProvider>
      <StatusBar backgroundColor="#ffffff" 
      barStyle="dark-content"/>
      <Home />
      <Toast/>
    </SafeAreaProvider>
    </StripeProvider>
  );
}

export default App;
