//accounts-config.js
// User accounts configuration


var mySubmitFunc = (error, state)=>{
    if (!error) {
	if (state === "signIn") {
	    // Successfully signed in
	    console.log('User signed in');
	    console.log(Meteor.user());
	}
	if (state === "signUp") {
	    // Successfully registered
	    console.log('User registration submitted');
	}
    }
};

var myLogoutFunc = ()=>{
     console.log('User signed out');
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
    onLogoutHook: myLogoutFunc,
    onSubmitHook: mySubmitFunc,
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
            //google: 'SCCOE_Logo_Color.svg'
        },
	//socialSignUp: "Register",
	title: {
            forgotPwd: "Recover Your Password"
	},
	
    },
});

AccountsTemplates.addField({
    _id: 'name',
    type: 'text',
    displayName: "Name",
    required: true
});


Accounts.onEmailVerificationLink(function(token,done){
    Accounts.verifyEmail(token, function (error) {
	if (error) {
	    console.log('ERROR while verifying email: '+error);
	} else {
    	    Meteor.call('updateEmailVerified', Meteor.user(), (err, res)=>{
		if (err) {
		    console.log('ERROR while updating user.verified_email: '+err);   
		} else {
		     console.log('Email succefully verified and updated');
		     VizsAddData(Meteor.user());
		}
	    });
	}
	done();
  });
});

