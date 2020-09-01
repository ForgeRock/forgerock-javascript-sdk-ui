/*
 * @forgerock/javascript-sdk-ui
 *
 * enums.ts
 *
 * Copyright (c) 2020 ForgeRock. All rights reserved.
 * This software may be modified and distributed under the terms
 * of the MIT license. See the LICENSE file for details.
 */

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
