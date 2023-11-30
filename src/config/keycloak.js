const keycloakConfig = {
  issuer: 'https://keycloak.abcparts.be:8443/auth/realms/abc-production',
  clientId: 'ABC_uniapp',
  redirectUrl: 'com.abcniels://auth', // changed appAuthRedirectScheme in android/app/build.gradle to 'com.niels'
  scopes: ['openid'],
};

export default keycloakConfig;
