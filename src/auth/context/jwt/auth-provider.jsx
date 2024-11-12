'use client';

import { useDispatch, useSelector } from 'react-redux';
import { useMemo, useEffect, useCallback } from 'react';

import { useSetState } from 'src/hooks/use-set-state';

import axios, { endpoints } from 'src/utils/axios';

import { fetchCountries } from 'src/redux/slices/general';
import { dispatch as reduxDispatch } from 'src/redux/store/store';

import { STORAGE_KEY } from './constant';
import { AuthContext } from '../auth-context';
import { setSession, isValidToken } from './utils';

// ----------------------------------------------------------------------

export function AuthProvider({ children }) {
  const { state, setState } = useSetState({
    user: null,
    loading: true,
  });

  const { countries } = useSelector((store) => store.general);

  const dispatch = useDispatch();

  const checkUserSession = useCallback(async () => {
    try {
      const token = localStorage.getItem(STORAGE_KEY);

      if (token && isValidToken(token)) {
        setSession(token);

        const res = await axios.get(endpoints.auth.me);

        const user = res.data.data;

        if (!countries.length) dispatch(fetchCountries());

        setState({ user: { ...user, token }, loading: false });
      } else {
        setState({ user: null, loading: false });
      }
    } catch (error) {
      reduxDispatch({ type: 'LOG_OUT' });

      console.error(error);
      setState({ user: null, loading: false });
    }
  }, [countries.length, dispatch, setState]);

  useEffect(() => {
    checkUserSession();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ----------------------------------------------------------------------

  const checkAuthenticated = state.user ? 'authenticated' : 'unauthenticated';

  const status = state.loading ? 'loading' : checkAuthenticated;

  const memoizedValue = useMemo(
    () => ({
      user: state.user
        ? {
            ...state.user,
            role: state.user?.role ?? 'admin',
          }
        : null,
      checkUserSession,
      loading: status === 'loading',
      authenticated: status === 'authenticated',
      unauthenticated: status === 'unauthenticated',
    }),
    [checkUserSession, state.user, status]
  );

  return <AuthContext.Provider value={memoizedValue}>{children}</AuthContext.Provider>;
}
