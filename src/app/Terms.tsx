import React from 'react';
import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';

type TermsProps = {
  onBack: () => void;
};

const Terms: React.FC<TermsProps> = ({ onBack }) => {
  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack}>
          <Text style={styles.back}>‹ Back</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Terms of Service</Text>
      </View>

      {/* Content */}
      <ScrollView showsVerticalScrollIndicator={false}>
        <Text style={styles.heading}>OVERVIEW</Text>
        <Text style={styles.text}>
          Welcome to Simply Boxed! The terms “we”, “us” and “our” refer to
          Simply Boxed. Simply Boxed operates this store and website, including
          all related information, content, features, tools, products and
          services in order to provide you, the customer, with a curated
          shopping experience (the “Services”). Simply Boxed is powered by
          Shopify, which enables us to provide the Services to you. The below
          terms and conditions, together with any policies referenced herein
          (these “Terms of Service” or “Terms”) describe your rights and
          responsibilities when you use the Services. Please read these Terms of
          Service carefully, as they include important information about your
          legal rights and cover areas such as warranty disclaimers and
          limitations of liability. By visiting, interacting with or using our
          Services, you agree to be bound by these Terms of Service and our
          Privacy Policy [LINK]. If you do not agree to these Terms of Service
          or Privacy Policy, you should not use or access our Services.
        </Text>

        <Text style={styles.heading}>SECTION 1 - ACCESS AND ACCOUNT</Text>
        <Text style={styles.text}>
          By agreeing to these Terms of Service, you represent that you are at
          least the age of majority in your state or province of residence, and
          you have given us your consent to allow any of your minor dependents
          to use the Services on devices you own, purchase or manage. To use the
          Services, including accessing or browsing our online stores or
          purchasing any of the products or services we offer, you may be asked
          to provide certain information, such as your email address, billing,
          payment, and shipping information. You represent and warrant that all
          the information you provide in our stores is correct, current and
          complete and that you have all rights necessary to provide this
          information. You are solely responsible for maintaining the security
          of your account credentials and for all of your account activity. You
          may not transfer, sell, assign, or license your account to any other
          person.
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Terms;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  back: {
    fontSize: 16,
    color: '#0bb',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: 60,
  },
  heading: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 15,
  },
  text: {
    fontSize: 14,
    marginTop: 8,
    lineHeight: 22,
    color: '#333',
  },
});
