import dotenv from 'dotenv';

dotenv.config();
export default {
      googleClientId: process.env.GOOGLE_CLIENT_ID || '',
      googleClientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
      googleOauthRedirectUrl: process.env.GOOGLE_OAUTH_REDIRECT_URL || '',
    };
  