/**
 * The set of stage values used in Express authentication trees.
 */
enum ExpressStage {
  DeviceAuthentication = 'DeviceAuthentication',
  DeviceRegistration = 'DeviceRegistration',
  DeviceRegistrationChoice = 'DeviceRegistrationChoice',
  LoginSuccess = 'LoginSuccess',
  OneTimePasswordEmail = 'OneTimePasswordEmail',
  OneTimePasswordSMS = 'OneTimePasswordSMS',
  Password = 'Password',
  PasswordlessChoice = 'PasswordlessChoice',
  RegistrationSuccess = 'RegistrationSuccess',
  RegistrationUserInfo = 'RegistrationUserInfo',
  SecondFactorChoice = 'SecondFactorChoice',
  Username = 'Username',
  UsernamePassword = 'UsernamePassword',
  UserPassword = 'UserPassword',
}

export { ExpressStage };
