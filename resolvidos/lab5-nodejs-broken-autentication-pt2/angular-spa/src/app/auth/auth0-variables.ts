interface AuthConfig {
  clientID: string;
  domain: string;
  callbackURL: string;
  silentCallbackURL: string;
  audience: string;
  apiUrl: string;
}

export const AUTH_CONFIG: AuthConfig = {
  clientID: 'aAWdxLNf3uIiyorXTEa5fv6XLuWJc7jM',
  domain: 'dev-aivd9uma.us.auth0.com',
  callbackURL: 'http://localhost:4200/callback',
  silentCallbackURL: 'http://localhost:4200/silent',
  audience: 'http://localhost:4200',
  apiUrl: 'https://localhost:3000'
};
