import { createContext, useContext } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from '../api/client';

export const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const queryClient = useQueryClient();

  const {
    data: user,
    isLoading: loading,
    error,
  } = useQuery({
    queryKey: ['authUser'],
    queryFn: async () => {
      const token = localStorage.getItem('accessToken');
      if (!token) return null;

      const res = await apiClient.get('/auth/me');
      return res.data.user;
    },
    retry: false,
    staleTime: 10 * 60 * 1000,
  });

  const signupMutation = useMutation({
    mutationFn: async (userData) => {
      const res = await apiClient.post('/auth/signup', userData);
      return res.data;
    },
    onSuccess: (data) => {
      localStorage.setItem('accessToken', data.accessToken);
      localStorage.setItem('refreshToken', data.refreshToken);
      queryClient.setQueryData(['authUser'], data.user);
    },
  });

  const loginMutation = useMutation({
    mutationFn: async (credentials) => {
      const res = await apiClient.post('/auth/login', credentials);
      return res.data;
    },
    onSuccess: (data) => {
      localStorage.setItem('accessToken', data.accessToken);
      localStorage.setItem('refreshToken', data.refreshToken);
      queryClient.setQueryData(['authUser'], data.user);
    },
  });

  const refreshAccessToken = async () => {
    const refreshToken = localStorage.getItem('refreshToken');
    if (!refreshToken) throw new Error('No refresh token');

    try {
      const res = await apiClient.post('/auth/refresh', { refreshToken });
      localStorage.setItem('accessToken', res.data.accessToken);
      return res.data.accessToken;
    } catch (error) {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      queryClient.setQueryData(['authUser'], null);
      throw error;
    }
  };

  const signout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    queryClient.setQueryData(['authUser'], null);
    queryClient.clear();
  };

  const value = {
    user: user ?? null,
    loading,
    signup: signupMutation.mutateAsync,
    login: loginMutation.mutateAsync,
    signout,
    refreshAccessToken,
    authError: error,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
