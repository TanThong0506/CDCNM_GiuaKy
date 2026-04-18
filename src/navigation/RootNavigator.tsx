import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import WelcomeScreen from '../screens/WelcomeScreen';
import SignUpScreen from '../screens/SignUpScreen';
import SignUpSuccessScreen from '../screens/SignUpSuccessScreen';
import SignUpPasswordScreen from '../screens/SignUpPasswordScreen';
import VerifyOTPScreen from '../screens/VerifyOTPScreen';
import VerifyEmailScreen from '../screens/VerifyEmailScreen';
import ForgotPasswordScreen from '../screens/ForgotPasswordScreen';
import LoginScreen from '../screens/LoginScreen';
import HomeScreen from '../screens/HomeScreen';
import PasswordResetSuccessScreen from '../screens/PasswordResetSuccessScreen';
import JobDetailScreen from '../screens/JobDetailScreen';
import SavedJobsScreen from '../screens/SavedJobsScreen';
import PostScreen from '../screens/PostScreen';
import MessageScreen from '../screens/MessageScreen';
import SearchScreen from '../screens/SearchScreen';

export type RootStackParamList = {
  Welcome: undefined;
  SignUp: undefined;
  SignUpSuccess: undefined;
  SignUpPassword: undefined;
  PasswordResetSuccess: undefined;
  VerifyOTP: undefined;
  VerifyEmail: undefined;
  ForgotPassword: undefined;
  Login: undefined;
  Home: undefined;
  Search: undefined;
  SavedJobs: undefined;
  Post: undefined;
  Message: undefined;
  JobDetail: {
    jobTitle: string;
    company: string;
    location: string;
    logoText: string;
  };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function RootNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: '#fff' },
      }}
    >
      <Stack.Screen<"Welcome"> name="Welcome" component={WelcomeScreen} />
      <Stack.Screen<"SignUp"> name="SignUp" component={SignUpScreen} />
      <Stack.Screen<"SignUpSuccess"> name="SignUpSuccess" component={SignUpSuccessScreen} />
      <Stack.Screen<"SignUpPassword"> name="SignUpPassword" component={SignUpPasswordScreen} />
      <Stack.Screen<"PasswordResetSuccess"> name="PasswordResetSuccess" component={PasswordResetSuccessScreen} />
      <Stack.Screen<"VerifyOTP"> name="VerifyOTP" component={VerifyOTPScreen} />
      <Stack.Screen<"VerifyEmail"> name="VerifyEmail" component={VerifyEmailScreen} />
      <Stack.Screen<"ForgotPassword"> name="ForgotPassword" component={ForgotPasswordScreen} />
      <Stack.Screen<"Login"> name="Login" component={LoginScreen} />
      <Stack.Screen<"Home"> name="Home" component={HomeScreen} />
      <Stack.Screen<"Search"> name="Search" component={SearchScreen} />
      <Stack.Screen<"SavedJobs"> name="SavedJobs" component={SavedJobsScreen} />
      <Stack.Screen<"Post"> name="Post" component={PostScreen} />
      <Stack.Screen<"Message"> name="Message" component={MessageScreen} />
      <Stack.Screen<"JobDetail"> name="JobDetail" component={JobDetailScreen} />
    </Stack.Navigator>
  );
}
