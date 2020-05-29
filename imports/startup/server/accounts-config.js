// accounts-config.js
// Configuration of accounts authentication services

Accounts.emailTemplates.siteName = "RESTORE";
Accounts.emailTemplates.from = "Santa Cruz COE Data <data@santacruzcoe.org>";

Accounts.emailTemplates.resetPassword = {
  subject(user) {
    return "Reset your password for the RESTORE app";
  },
  text(user, url) {
    return `Hello ${user.profile.name}!

Click the link below to reset your password for the RESTORE app.
${url}

If you didn't request this email, please notify this incident to data@santacruzcoe.org.

Thank you!

The Santa Cruz COE Data team
`
  },
  html(user, url) {
    // This is where HTML email content would go.
    // See the section about html emails below.
  }
};

Accounts.emailTemplates.verifyEmail = {
   subject() {
      return "Activate your account for the RESTORE app!";
   },
   text(user, url) {
      return `Hey ${user.profile.name}! Verify your e-mail by following this link: ${url}`;
   }
};


AccountsTemplates.configure({
    // Behavior
    confirmPassword: true,
    enablePasswordChange: true,
    forbidClientAccountCreation: false,
    overrideLoginErrors: false,
    enforceEmailVerification: true,
    sendVerificationEmail: true,
    lowercaseUsername: false,
    focusFirstInput: true,

    // Appearance
    showAddRemoveServices: false,
    showForgotPasswordLink: true,
    showLabels: true,
    showPlaceholders: true,
    showResendVerificationEmailLink: true,

    // Client-side Validation
    continuousValidation: true,
    negativeFeedback: false,
    negativeValidation: true,
    positiveValidation: true,
    positiveFeedback: true,
    showValidating: true,

    // Privacy Policy and Terms of Use
    //privacyUrl: 'privacy',
    //termsUrl: 'terms-of-use',

    // Redirects
    //homeRoutePath: '/home',
    //redirectTimeout: 4000,

    // Hooks
    //onLogoutHook: myLogoutFunc,
    //onSubmitHook: mySubmitFunc,
    //preSignUpHook: myPreSubmitFunc,
    //postSignUpHook: myPostSubmitFunc,

    // Texts
    texts: {
	errors:{
	    loginForbidden: "Unrecognized credentials",
	},
	button: {
            signUp: "Register!"
	},
	socialIcons: {
            //google: 'google_icon.svg'
        },
	//socialSignUp: "Register",
	title: {
            forgotPwd: "Recover Your Password"
	},
	
    },
});

