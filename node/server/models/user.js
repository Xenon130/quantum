
const passportLocalMongoose = require('passport-local-mongoose')

/** Defines the user model, exports to mongoose
 *
 * @param {*} config    - app config
 * @param {*} mongoose  - db connector
 *
 * passport-local-mongoose is used to create the local authentication
 * strategy (https://github.com/saintedlama/passport-local-mongoose)
 *
 * @returns
 */
module.exports = function (config, mongoose) {
  // enable push for all models
  mongoose.plugin(schema => {
    schema.options.usePushEach = true
  })

  // define user model schema
  // Note: token can be SSO or local password
  const Schema = mongoose.Schema
  const userSchema = new Schema({
    auth: {
      id:    { type: String, required: false},    // only used by oidc strategy
      token: { type: String, required: true },    // OIDC token or password
      email: { type: String, required: true },
      name:  { type: String, required: true },
      salt:  { type: String, required: false},    // only used by local strategy
    },
    grid: { type: Array },
    missions: { type: Array }
  })

  // Plugin authentication for passport
  const msg = `ERROR Unrecognized auth provider: ${config.auth.provider}`
  const errorMessage =  { code: 403, message: msg }

  switch (config.auth.provider.toLowerCase()) {
    case 'mongo':
      userSchema.plugin(passportLocalMongoose,
        {
          usernameField: 'auth.email',  // custom username field
          hashField: 'auth.token',      // custom password field
          saltField: 'auth.salt'        // custom salt field
        })
      break

    default:
      throw errorMessage
  }

  // static function to find or create a user
  // https://tomanagle.medium.com/adding-findoneorcreate-to-a-mongoose-model-efc7c2e11294
  userSchema.statics.findOneOrCreate = function findOneOrCreate (condition, doc) {
    const self = this
    const newDoc = doc

    return new Promise((resolve, reject) => {
      // search for user
      return self.findOne(condition)
        .then((result) => {

          // found user > return info
          if (result) {
            console.log(`Found user: ${newDoc.auth.email}`)
            return resolve(result)
          }

          // new user > create & return info
          return self.create(newDoc)
            .then((result) => {
              console.log(`Creating user: ${newDoc.auth.email}`)
              return resolve(result)
            }).catch((error) => {
              return reject(error)
            })
        }).catch((error) => {
          return reject(error)
        })

    })
  }

  // create the mongoose model for users
  const User = mongoose.model('User', userSchema)

  // if using local strategy and no user exists yet, create one from config
  if (config.auth.provider.toLowerCase() == 'mongo') {
    User.findOne({}, function(err,obj) {
      if (obj == null) {

        const emailAdmin  = config.auth.clientID
        const emailDomain = emailAdmin.slice(emailAdmin.indexOf("@"))
        const emailUser   = 'sys.user' + emailDomain
        const password    = config.auth.clientSecret
        const sysAdmin    = {email : emailAdmin, name : 'Sys Admin' }
        const sysUser     = {email : emailUser,  name : 'Sys User'  }

        User.register({auth:sysAdmin}, password)
        User.register({auth:sysUser}, password)
        console.log(`::: Created 1st User ::: ${sysAdmin.email}`)
        console.log(`::: Created 2nd User ::: ${sysUser.email}`)

      }
     })
  }

  // expose model to our app
  return User
}
