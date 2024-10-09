# Changelog

All significant changes to the Dream Auto project will be documented in this file.

## Version: [1.0.8.0] - 2024-10-09

### Added

- Added auto reply.
- Clicking on a chat notification opens the chat tabs for each user.
- Clicking on an email notification opens the inbox tab.

## Version: [1.0.7.2] - 2024-10-03

### Added

- Changed TTS sending logic. It should now take the given voice first, if it is not found then any US or UK Google, if they are not found then any possible voice.

- New emails: Changed the logic. One more element will now be checked.

## Version: [1.0.7.1] - 2024-09-22

### Added

- New error detection options.

### Fixed

- Restored some lines which were lost due to testing.

## Version: [1.0.7.0] - 2024-09-20

### Added

- Option to set up notifications via Telegram.

## Version: [1.0.6.2] - 2024-09-17

### Added

- Logic to handle Chrome's error page.

## [1.0.6.1] - 2024-09-12

### Fixed

- Minor fixes
- Performance optimizations

## [1.0.6.0] - 2024-09-04

### Added

- Ability for user to decide if favorites should be excluded

## [1.0.5.5] - 2024-09-02

### Changed

- Further changes to the user interface

## [1.0.5.4] - 2024-09-01

### Changed

- User interface updates

## [1.0.5.3] - 2024-08-28

### Changed

- Small changes to the user interface

### Fixed

- Errors with names that caused a large memory overhead

## [1.0.5.2] - 2024-08-25

### Fixed

- Fixed more bugs

## [1.0.5.1] - 2024-08-22

### Fixed

- Fixed minor bugs

## [1.0.5] - 2024-08-20

### Added

- Ability to open the browser that sent the notification by clicking on the notification
- Added radio

## [1.0.4.3] - 2024-08-15

### Added

- Workaround when DS changes chat page to home page

## [1.0.4.2] - 2024-08-11

### Fixed

- Bug causing name to not show up in notifications

### Changed

- Notification Optimization

## [1.0.4.1] - 2024-08-10

### Added

- Username for TTS in case a user has more than 1 account to avoid confusion

## [1.0.4] - 2024-08-08

### Added

- TTS function as an audio notification

## [1.0.3.1] - 2024-08-05

### Fixed

- Bug where the chat timer was not assigned if the popup was closed after assignment

## [1.0.3] - 2024-07-02

#### Changed

- Removed the word “Myjchina” from the beginning of emails
- Replaced notification icons

#### Fixed

- Bug where tab was not detected when searching for new invitations

## [1.0.2] - 2024-06-30

### Added

- Re-enable WS to prevent missing notifications when browser is inactive

### Changed

- Changed the number of notifications to 1 for each type to avoid spamming

## [1.0.1] - 2024-06-28

### Changed

- Changed tab behavior
- Changed email notification logic

### Fixed

- Bugs with WS connection
- Unable to set emails without at least one video file
- Bug with array when text was filled into two fields and the field between them was left empty
- Bug where chat invitations were triggered twice when opening a tab for the first time

## [1.0.0] - 2024-06-22

### Added

- Combining Auto Letters, Auto Chat and Auto Sender extensions into one extension
- Ability to set custom chat invitations
- Email and chat notifications
