# Changelog

## [Unreleased]

### Added

- Social Login support.

### Fixed

- Fixed build issue with Windows PowerShell

### Breaking Changes

- Removed `nonce` from export as it was removed from Core SDK
- Upgraded to Twitter Bootstrap 5.0 and removed ForgeRock's UI Library
- Markup for password and select components have changed; check your customizations for compatibility

## [2.2.0] - 2020-12-18

### Added

- Added email suspended node support in sample apps
- Added support for `TextOutputCallback` `messageType 4` behind a configuration option that is disabled by default
- Support for TypeScript 4.0

### Fixed

- Fixed basic callback handler to better support unique page node callback composition: polling wait and message node within page node

## [2.1.1] - 2020-09-24

### Fixed

- Added missing exported members to the `index.js` file

## [2.1.0] - 2020-08-25

### Added

- Support for the recovery code display node and the parsing of the codes from the TextOutputCallback
- Updated support for new IDM nodes for registration and self-service
- Added SuspendedTextOutputCallback support for the new Email Suspended Node
- Added description text to generic page node handler
- Added NumberAttributeInputCallback support

### Fixed

- Conditionally set user verification, relying party and allow credentials to WebAuthn key options
- Improved instructions for cert creation for sample app

## [2.0.0] - 2020-06-22

### Added

- Ability to customize text
- Optimized stylesheet

### Fixed

- Updated all dependencies to latest version

## [1.0.2] - 2020-01-06

### Added

- Updates to WebAuthn handler

## [1.0.1] - 2019-12-19

### Added

- E2E testing
- API documentation

## [1.0.0] - 2019-12-10

### Added

- Initial release for UI SDK
- Initial npm deployment for GA
