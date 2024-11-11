'use client';

import axios, { endpoints } from 'src/utils/axios';

import { dispatch as reduxDispatch } from 'src/redux/store/store';

import { setSession } from './utils';
import { STORAGE_KEY } from './constant';

/** **************************************
 * Sign in
 *************************************** */
export const signInWithPassword = async ({ username, password }) => {
  reduxDispatch({ type: 'LOG_OUT' });

  try {
    const params = { username, password };

    const res = await axios.post(endpoints.auth.login, params);

    const { token } = res.data.data;

    if (!token) {
      throw new Error('Access token not found in response');
    }

    setSession(token);
  } catch (error) {
    console.error('Error during sign in:', error);
    throw error;
  }
};

/** **************************************
 * Sign up
 *************************************** */
export const signUp = async ({ email, password, firstName, lastName }) => {
  const params = {
    email,
    password,
    firstName,
    lastName,
  };

  try {
    const res = await axios.post(endpoints.auth.signUp, params);

    const { token } = res.data;

    if (!token) {
      throw new Error('Access token not found in response');
    }

    localStorage.setItem(STORAGE_KEY, token);
  } catch (error) {
    console.error('Error during sign up:', error);
    throw error;
  }
};

/** **************************************
 * Sign out
 *************************************** */
export const signOut = async () => {
  try {
    await setSession(null);
  } catch (error) {
    console.error('Error during sign out:', error);
    throw error;
  }
};
