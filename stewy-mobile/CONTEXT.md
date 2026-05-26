# Stewy — Domain Glossary

## User
The primary entity representing a person with an account in the application. Has firstName, lastName, email, password (hashed), phone, address, and account status. Can authenticate via JWT and maintain a session.

### Account Status
- `pending` — registered via self-service, awaiting Admin activation
- `active` — activated by an Admin

## Admin
A User with elevated privileges who manages games, activates accounts, approves volunteer profiles, and approves/rejects game participation requests. May or may not have an associated Volunteer profile. The first Admin is seeded in the database.

## Volunteer
A profile associated with a User representing their role in game operations. Contains role (HOOFD_STEWARD / DEVISIE_CHEF / STEWARD), kbvbId, and club (Club entity). A User can have at most one Volunteer profile.

### Profile Status
- `pending_approval` — submitted by User, awaiting Admin review
- `approved` — confirmed by Admin, User can now request game participation

## Registration
The self-service process by which a person creates a User account. Requires Admin activation. The Volunteer profile is a separate, subsequent step.

## Game Participation
A Volunteer requests to join a game. An Admin approves or rejects the request. Approved Volunteers are reflected in the VolunteerGame join table.

### Participation Status
- `REQUESTED` — Volunteer has asked to join
- `APPROVED` — Admin confirmed participation
- `REJECTED` — Admin denied participation

## Club
A football club represented in the system. Created by a HoofdSteward during volunteer profile setup. Has a clubName (unique), a responsible (the HoofdSteward, @OneToOne), and a list of volunteer members. Existing clubs are available for selection by other volunteers once the responsible HoofdSteward's profile is approved. A club can only be created once — duplicate club names are rejected.

## Email
A User's email address. Must be a valid RFC 5322 format validated on the API side via `@Email` annotation. The mobile app performs a basic format check (e.g., `.+@.+\..+`) before sending. Uniqueness is enforced at the database and service layers. Input is trimmed before validation on both sides.

## Password
A User's secret credential. Minimum 8 characters. Must contain at least one uppercase letter, one lowercase letter, and one digit. Validated on both mobile (before submission, field-level errors) and API (before persistence). Input is trimmed on mobile before validation.

## Name
A User's firstName or lastName. At least 1 non-whitespace character. Validated on both mobile (zod `.min(1).trim()`) and API (`@NotBlank`). Input is trimmed before validation on both sides.

## KBVB ID
A Volunteer's Belgian football federation registration number. Free text input with no format validation (format unknown).

## Phone Number
A User's contact number. Stored in E.164 canonical format (`+324XXXXXXXX`). The mobile app accepts common Belgian formats (e.g., `0495 XX XX XX`, `+32 495 XX XX XX`, `0032 495 XX XX XX`) and normalizes to E.164 before sending to the API. The API validates that the value is valid E.164 and returns structured field-level errors on failure.

## Mock Session
A fallback that was previously used to let users into the app during network failures or API errors. This is now removed — network failures and API errors both show an error message. A fake session provides no real value since the user can't load any data.

## Validation Error Response
The API returns validation errors as a structured JSON object with `{ "errors": { "fieldName": "error message" } }` and HTTP 400 status. The mobile app maps these back to individual form field `error` props for per-field display.

## Theme Preference
A user's choice of color scheme, persisted across sessions. Supports three states: `light` (forces light mode), `dark` (forces dark mode), and `auto` (follows device setting, the default). Accessible via compact icon buttons in the desktop header and Profile tab on mobile. The preference is stored in AsyncStorage and applied immediately by overriding NativeWind's `colorScheme`.

## Language Preference
A user's choice of application locale, persisted across sessions. Defaults to `nl` (Dutch). Switching languages is possible via a compact toggle (flag icons) in the desktop header and Profile tab on mobile. The preference is stored in AsyncStorage and applied immediately via i18next without page reload.

## Game
A match between two clubs with an appointment date/time, a deadline for volunteer sign-up, location, accessibility info, and a lifecycle status. Created by a HoofdSteward. The creation form uses Zod schema validation with i18n translation keys as error messages. Away team is selected via a combobox of available clubs (excluding the creator's home club). Dates use dd-MM-yyyy display format in pickers, converted to yyyy-MM-dd HH:mm for the API.

### Game Status
- `CREATE` — game is being set up
- `OPEN` — game is accepting volunteer requests
- `CLOSED` — game is no longer accepting volunteers (past or full)


