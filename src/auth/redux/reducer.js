import { jwtDecode } from 'jwt-decode';
import Toast from 'react-native-toast-message';
import { authorize, logout as RNLogout } from 'react-native-app-auth';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';

import keycloakConfig from '../../config/keycloak';
import { Alert } from 'react-native';

// Initial state
const initialState = {
  user: {
    email: 'test@gamil.com',
    accessToken: '1222',
    id: '2333',
    name: 'Ramiz',
    allowedApps: ['image_app_role', 'tracking_app_role', 'checkout_app_role'],
  },
  error: null,
  isLoading: false,
};

// Async actions

export const login = createAsyncThunk('auth/login', async () => {
  try {
    const result = await authorize(keycloakConfig);

    const accessToken = result.accessToken;
    const idToken = result.idToken;
    const decoded_accessToken = jwtDecode(accessToken);
    const decoded_idToken = jwtDecode(idToken);
    const resourceAccess = decoded_accessToken.resource_access.ABC_uniapp.roles; // ["image_app_role", "tracking_app_role", "checkout_app_role"]
    const email = decoded_idToken.preferred_username;
    const username = email.split('@')[0]; // tesuse@abcparts.be -> tesuse

    await AsyncStorage.setItem('@abcneils/token', idToken);

    if (username.length < 6) {
      Alert.alert('Username must be 6 characters long!');
      return;
    }

    return {
      email,
      accessToken,
      id: idToken,
      name: username,
      allowedApps: resourceAccess,
    };
  } catch (e) {
    Toast.show({
      type: 'error',
      text1: 'Error',
      text2: e?.message,
    });
  }
});

export const logout = createAsyncThunk('auth/logout', async () => {
  const idToken = await AsyncStorage.getItem('@abcneils/token');

  await RNLogout(keycloakConfig, {
    idToken: idToken,
    postLogoutRedirectUrl: keycloakConfig.redirectUrl,
  });

  await AsyncStorage.removeItem('@abcneils/token');
});

// export const updateUser = createAsyncThunk('auth/updateUser', async data => {
//   const response = await request({
//     url: '/user/me',
//     method: 'PUT',
//     data,
//   }).catch(e => console.log('Err', e));

//   if (response?.success) {
//     Toast.show({
//       type: 'success',
//       text1: 'User Updated',
//       text2: 'Your information is updated successfully',
//     });
//   }

//   return null;
// });

// Slice
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setError: (state, action) => {
      state.error = action.payload;
    },
  },
  extraReducers(builder) {
    builder
      // Login
      .addCase(login.pending, state => {
        state.error = null;
        state.isLoading = true;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload || null;
      })
      .addCase(login.rejected, state => {
        state.isLoading = false;
        state.error = "Coudn't login somthing went wrong";
      })
      // Logout
      .addCase(logout.pending, state => {
        state.error = null;
        state.isLoading = true;
      })
      .addCase(logout.fulfilled, state => {
        state.isLoading = false;
        state.user = null;
      })
      .addCase(logout.rejected, state => {
        state.isLoading = false;
        state.error = "Coudn't logout somthing went wrong";
      });
    // // UPDATE USER
    // .addCase(updateUser.pending, state => {
    //   state.error = null;
    //   state.isLoading = true;
    // })
    // .addCase(updateUser.fulfilled, state => {
    //   state.isLoading = false;
    // })
    // .addCase(updateUser.rejected, state => {
    //   state.isLoading = false;
    //   state.error = "Coudn't update user somthing went wrong";
    // });
  },
});

// Actions
export const { setError } = authSlice.actions;

// Reducer
export default authSlice.reducer;

// Selectors

export const selectUser = state => state.auth.user;

export const selectError = state => state.auth.error;

export const selectIsLoading = state => state.auth.isLoading;
