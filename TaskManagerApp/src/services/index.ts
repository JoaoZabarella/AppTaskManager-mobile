import api from './api';
import authService from './authService';
import userService from './usuarioService';

export default {
  api,
  auth: authService,
  user: userService,
};