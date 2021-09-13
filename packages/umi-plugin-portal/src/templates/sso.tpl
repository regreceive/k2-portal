import Oidc from 'oidc-client';

const BASE_URL = location.origin + location.pathname; // 本地地址
const CLIENT_URL = window.$$config.sso?.clientUrl; // hydra客户端地址
const CLIENT_ID = window.$$config.sso?.clientId; // 客户端必须与之必须对应

let mgr: Oidc.UserManager;

if (CLIENT_URL && CLIENT_ID) {
  mgr = new Oidc.UserManager({
    userStore: new Oidc.WebStorageStateStore({ store: window.localStorage }),
    authority: CLIENT_URL,
    client_id: CLIENT_ID, // 客户端必须与之必须对应
    redirect_uri: `${BASE_URL}`,
    response_type: 'code',
    scope: 'openid offline',
    silent_redirect_uri: `${BASE_URL}/silent-login.html`,
    post_logout_redirect_uri: `${BASE_URL}`,
    popup_redirect_uri: `${BASE_URL}`,
    // requireConsent: false,
    accessTokenExpiringNotificationTime: 60,
    filterProtocolClaims: true,
    // loadUserInfo: false,
    revokeAccessTokenOnSignout: true,
    automaticSilentRenew: false,
    loadUserInfo: false,
    response_mode: 'query',
  });

  mgr.events.addAccessTokenExpiring(function () {
    console.log('AccessToken Expiring：', arguments);
  });

  mgr.events.addAccessTokenExpired(() => {
    // 超时
    mgr
      .signoutRedirect()
      .then((resp) => {
        console.log('signed out', resp);
      })
      .catch((err) => {
        console.log(err);
      });
  });

  mgr.events.addSilentRenewError(function () {
    console.error('Silent Renew Error：', arguments);
  });

  mgr.events.addUserSignedOut(function () {
    console.log('UserSignedOut：', arguments);
    mgr
      .signoutRedirect()
      .then((resp) => {
        console.log('signed out', resp);
        window.location.href = BASE_URL;
      })
      .catch((err) => {
        console.log(err);
      });
  });
}

class SecurityService {
  // Renew the token manually
  renewToken() {
    const self = this;
    console.log('refresh token');
    return new Promise((resolve, reject) => {
      mgr
        .signinSilent()
        .then((user) => {
          if (user == null) {
            self.signIn();
          } else {
            return resolve(user);
          }
        })
        .catch((err) => {
          console.log(err);
          return reject(err);
        });
    });
  }

  // Get the user who is logged in
  getUser() {
    const self = this;
    return new Promise((resolve, reject) => {
      mgr
        .getUser()
        .then((user) => {
          if (user == null) {
            self.signIn();
            return resolve(null);
          }
          return resolve(user);
        })
        .catch((err) => {
          console.log(err);
          return reject(err);
        });
    });
  }

  // Check if there is any user logged in
  getSignedIn() {
    const self = this;
    return new Promise((resolve, reject) => {
      mgr
        .getUser()
        .then((user) => {
          if (user == null) {
            self.signIn();
            return resolve(false);
          }

          // replace('/login')// fix this
          return resolve(true);
        })
        .catch((err) => {
          console.log(err);
          return reject(err);
        });
    });
  }

  signinSilentCallback = () => mgr.signinSilentCallback();

  // Redirect of the current window to the authorization endpoint.
  signIn = () => {
    if (window.location.pathname !== '/login') {
      window.sessionStorage.setItem(
        'login_redirect_url',
        window.location.pathname,
      );
    }
    mgr.signinRedirect().catch((err) => {
      console.log(err);
      if (err.message?.indexOf('404') > -1) {
        alert('OAuth2配置无效, 请联系管理员!');
      }
    });
  };

  signInCallback = async (replace: (arg: string) => void) => {
    try {
      await mgr.signinRedirectCallback();
      replace(window.sessionStorage.getItem('login_redirect_url') || '/');
    } catch (error) {
      replace('/');
      console.error(error);
    }
  };

  // Redirect of the current window to the end session endpoint
  async signOut() {
    const user = (await this.getUser()) as { id_token?: any };
    if (user) {
      mgr
        .signoutRedirect({ id_token_hint: user.id_token, state: user })
        .then(async () => {
          await mgr.clearStaleState();
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }

  // Get the profile of the user logged in
  getProfile() {
    const self = this;
    return new Promise((resolve, reject) => {
      mgr
        .getUser()
        .then((user) => {
          if (user == null) {
            self.signIn();
            return resolve(null);
          }
          return resolve(user.profile);
        })
        .catch((err) => {
          console.log(err);
          return reject(err);
        });
    });
  }

  // Get the token id
  getIdToken() {
    const self = this;
    return new Promise((resolve, reject) => {
      mgr
        .getUser()
        .then((user) => {
          if (user == null) {
            self.signIn();
            return resolve(null);
          }
          return resolve(user.id_token);
        })
        .catch((err) => {
          console.log(err);
          return reject(err);
        });
    });
  }

  // Get the session state
  getSessionState() {
    const self = this;
    return new Promise((resolve, reject) => {
      mgr
        .getUser()
        .then((user) => {
          if (user == null) {
            self.signIn();
            return resolve(null);
          }
          return resolve(user.session_state);
        })
        .catch((err) => {
          console.log(err);
          return reject(err);
        });
    });
  }

  // Get the access token of the logged in user
  getAcessToken() {
    const self = this;
    return new Promise((resolve, reject) => {
      mgr
        .getUser()
        .then((user) => {
          if (user == null) {
            self.signIn();
            return resolve(null);
          }
          return resolve(user.access_token);
        })
        .catch((err) => {
          console.log(err);
          return reject(err);
        });
    });
  }

  // Takes the scopes of the logged in user
  getScopes() {
    const self = this;
    return new Promise((resolve, reject) => {
      mgr
        .getUser()
        .then((user) => {
          if (user == null) {
            self.signIn();
            return resolve(null);
          }
          return resolve(user.scopes);
        })
        .catch((err: any) => {
          console.log(err);
          return reject(err);
        });
    });
  }

  // Get the user roles logged in
  getRole() {
    const self = this;
    return new Promise((resolve, reject) => {
      mgr
        .getUser()
        .then((user) => {
          if (user == null) {
            self.signIn();
            return resolve(null);
          }
          return resolve(user.profile.role);
        })
        .catch((err: any) => {
          console.log(err);
          return reject(err);
        });
    });
  }
}

export default new SecurityService();
