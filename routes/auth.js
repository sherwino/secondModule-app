// This route is related to user registration and authentication
// SignUp, LogIn & LogOut
const express = require('express');
const bcrypt = require('bcrypt');
const router = express.Router();
const passport = require('passport');
const path = require('path');
const multer = require('multer');
const ensure = require('connect-ensure-login');


// Require bcrypt and the User model for use in our POST route.
const User = require('../models/user');
const bcryptSalt = 8;

//---------------------------SignUp---------------------------------
router.get('/signup', (req, res, next) => {
  res.render('auth/signup', {
    errorMessage: ''
  });
});

const myUploader = multer({
  dest: path.join(__dirname, '../public/uploads')
});

//Define our POST route with the /signup URL. It can have the same URL
// because it uses a different HTTP verb (GET vs. POST).
router.post('/signup',

  myUploader.single('photo'),

  (req, res, next) => {
    //Makes a variable for the inputs submitted
    // by the form (stored in req.body).
    const nameInput = req.body.name;
    const emailInput = req.body.email;
    const passwordInput = req.body.password;
    console.log("~~~~~~~~~~~~~~~~");
    console.log(passwordInput);

    // we are checking for is if the email or password is blank.
    if (emailInput === '' || passwordInput === '') {
      res.render('auth/signup', {
        errorMessage: 'Enter both email and password to sign up.'
      });
      return;
    }

    User.findOne({
        email: emailInput
      }, '_id',
      (err, existingUser) => {
        if (err) {
          next(err);
          return;
        }

        // Lines 44-49: Check if there’s already a user with the submitted email.
        if (existingUser !== null) {
          res.render('auth/signup', {
            errorMessage: `The email ${emailInput} is already in use.`
          });
          return;
        }

        //Use the bcrypt methods genSaltSync() and hashSync()
        // to encrypt the submitted password.
        const salt = bcrypt.genSaltSync(8);
        const hashedPass = bcrypt.hashSync(passwordInput, salt);

        // Creates an instance of the User model with
        // the correct properties (values from the form submission).
        const userSubmission = {
          name: nameInput,
          email: emailInput,
          password: hashedPass,
          photoAddress: `/uploads/${req.file.filename}`
        };

        const theUser = new User(userSubmission);

        // Call Mongoose’s save() model method to
        // actually save the new user to the database.
        theUser.save((err) => {

          // Check for database errors when we save.
          if (err) {
            res.render('auth/signup', {
              errorMessage: 'Something went wrong. Try again later.'
            });
            return;
          }
          router.get('/profile',
            ensure.ensureLoggedIn('/login'),
            (req, res) => {
              res.render('auth/profile', {
                user: req.user
              });
            });

          // If everything goes as planned, redirect back to the home page.
          res.redirect('/');
        });
      });
  });
//End of registration

// -------------------LogIn------------------------

router.get('/login',

(req, res, next) => {
  res.render('auth/login', {
    errorMessage: ''
  });
});

router.post('/login', (req, res, next) => {
  const emailInput = req.body.email;
  const passwordInput = req.body.password;

  if (emailInput === '' || passwordInput === '') {
    res.render('auth/login', {
      errorMessage: 'Enter both email and password to log in.'
    });
    return;
  }
console.log(emailInput);

  //Find the user by their email.
  User.findOne({
    email: emailInput
  }, (err, theUser) => {
    if (err || theUser === null) {
      console.log("couldnt find user!!!!!!!!!!!!!!!!!!!!!");
      res.render('auth/login', {
        errorMessage: `There isn't an account with email ${emailInput}.`
      });
      return;
    }

    //  Use the compareSync() method to verify the password.
    if (!bcrypt.compareSync(passwordInput, theUser.password)) {
      console.log("WRONG credentials breh!!!!!!!!!!!!!!!!");
      res.render('auth/login', {
        errorMessage: 'Invalid password.'
      });
      return;
    }

    // If everything works, save the user’s information in req.session.
    res.redirect('/');
  });
});

// -------------------LogOut------------------------
router.get('/logout', (req, res, next) => {
  // req.logout() method provided by Passport
  req.logout();

  req.flash('success', 'You have logged out successfully. 🤠');

  res.redirect('/');
});

// --------------SocialLogins------------------------
router.get('/auth/facebook', passport.authenticate('facebook'));
//                  |
//  Link to this address to log in with Facebook


// Where Facebook comes back to after the user has accepted/rejected
//  callbackURL: '/auth/facebook/callback'
//                        |
router.get('/auth/facebook/callback', passport.authenticate('facebook', {
  successRedirect: '/',
  failureRedirect: '/login'
}));


//                                                  google as in "GoogleStrategy"
//                                                    |
router.get('/auth/google', passport.authenticate('google', {
  scope: ["https://www.googleapis.com/auth/plus.login",
    "https://www.googleapis.com/auth/plus.profile.emails.read"
  ]
}));


// Where Google comes back to after the user has accepted/rejected
//  callbackURL: '/auth/google/callback'
//                        |
router.get('/auth/google/callback', passport.authenticate('google', {
  successRedirect: '/',
  failureRedirect: '/login'
}));

module.exports = router;
