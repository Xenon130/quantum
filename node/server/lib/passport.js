const passport = require('passport')

/** setup authentication using passport
 *
 * @param {*} user   - mongoose user model
 * @param {*} config - app configuration
 *
 * Multiple authentication providers are supported:
 *
 *  Mongo     - https://heynode.com/tutorial/authenticate-users-node-expressjs-and-passportjs/
 *  Microsoft - https://www.passportjs.org/packages/passport-azure-ad-oauth2/
  */
module.exports = function (config, User) {

  switch(config.auth.provider.toLowerCase()) {

    case 'mongo':
        passport.use(User.createStrategy())
        passport.serializeUser(User.serializeUser());
        passport.deserializeUser(User.deserializeUser())
        return passport
      break

    default:
      throw `ERROR Unrecognized auth provider in config: ${config.auth.provider}`
  }
}

/*
    const AzureAdOAuth2Strategy = require('passport-azure-ad-oauth2')
    passport.provider = myconfig.oidc.provider

    console.log("setting passport options")
    passport.serializeUser(function (user, done) {
      done(null, user.id)
    })
    passport.deserializeUser(function (id, done) {
      User.findById(id, function (err, user) {
      done(err, user)
      })
    })

    passport.use(new AzureAdOAuth2Strategy({
      clientID:     myconfig.oidc.clientID,
      clientSecret: myconfig.oidc.clientSecret,
      callbackURL:  myconfig.oidc.callbackURL,
      tenantID:     myconfig.oidc.tenantID
    },
    // Verify Callback
    //  Accepts an accessToken, refresh_token, params and service-specific
    //  user profile, and then calls the 'done' callback supplying a user,
    //  which should be set to false if the credentials are not valid.
    function (accessToken, refresh_token, params, profile, done) {
      var waadProfile = profile || jwt.decode(params.id_token, '', true);
      console.log("Running passport.authenticate() verify callback with profile:")
      console.log(waadProfile)


      // following authentication, find or create the logged in user
      User.findOrCreate({ id: waadProfile.upn }, function (err, user) {
        done(err, user)
      });


    }));
  }

//// OLD CODE


  const jwt  = require('jsonwebtoken')
  const User = require('../models/user')

  // passport session setup
  passport.serializeUser(function (user, done) {
    done(null, user.id)
  })
  passport.deserializeUser(function (id, done) {
    User.findById(id, function (err, user) {
      done(err, user)
    })
  })

    AuthStrategy = new AzureADStrategy(
      {
        callbackURL: myconfig.oidc.callbackURL,
        clientID: myconfig.oidc.clientID,
        clientSecret: myconfig.oidc.clientSecret,
        passReqToCallback: true // allows checking login status
      },
      function (req, token, refreshToken, params, profile, done) {
        process.nextTick(function () {  // asynchronous
          profile = jwt.decode(params.id_token)
          console.log('User profile:')
          console.log(profile)

          if (!req.user) {  // user is NOT logged in
            console.log('User is not logged in (req.user is undefined).')

            User.findOne({ 'auth.id': profile.oid }, function (err, user) {
              if (err) { return done(err) }
              if (user) {
                console.log('Found known user')

                // check for user but no token (user was removed)
                if (!user.auth.token) {
                  user.auth.token = token
                  user.auth.name  = initCaps(profile.name)
                  user.auth.email = (profile.upn || '').toLowerCase()
                  user.save(function (err) {
                    if (err) { return done(err) }
                    return done(null, user)
                  })
                }
                return done(null, user)
              } else {
                console.log('Found no user => is new')
                const newUser            = new User()
                newUser.auth.id    = profile.oid
                newUser.auth.token = token
                newUser.auth.name  = initCaps(profile.name)
                newUser.auth.email = (profile.upn || '').toLowerCase() // pull the first email
                newUser.save(function (err) {
                  if (err) { return done(err) }
                  return done(null, newUser)
                })
              }
            })
          } else { // user exists and is logged in, link accounts
            console.log('User is logged in')
            const user            = req.user // pull user info from session
            user.auth.id    = profile.oid
            user.auth.token = token
            user.auth.name  = initCaps(profile.name)
            user.auth.email = (profile.upn || '').toLowerCase() // pull the first email
            user.save(function (err) {
              if (err) { return done(err) }
              return done(null, user)
            })
          }
        })
      }
    )
  } else if (myconfig.oidc.provider === 'Google') {
    const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy
    AuthStrategy = new GoogleStrategy()
    console.log('Passport Error: GMail Auth Not yet implemented')
  } else { // use proxy provided identity (default)
    // read from proxy session env?
    AuthStrategy = {}
    console.log('Passport Error: Local Auth Not yet implemented')
  }

  if (AuthStrategy) {
    console.log(`Registering authenticator with ${myconfig.oidc.provider}`)
    console.log(JSON.stringify(AuthStrategy, null, 2))
    try {
      passport.use(AuthStrategy)
      myapp.use(passport.initialize())
      myapp.use(passport.session())
    } catch (e) {
      console.log('Passport Error ' + e)
      console.log('AuthStrategy:')
    }
  console.log('-'.repeat(95))
  }
}


// capitalise first letter of each word
function initCaps (str) {
  const words = str.toLowerCase().split(' ')
  for (let i = 0; i < words.length; i++) {
    const letters = words[i].split('')
    letters[0] = letters[0].toUpperCase()
    words[i] = letters.join('')
  }
  return words.join(' ')
}

*/
