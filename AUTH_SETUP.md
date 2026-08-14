# Authentication Setup Documentation

## Overview

This project uses **Supabase Authentication** with a comprehensive email/password authentication flow. The auth system includes:

- ✅ Email/Password Sign-Up with validation
- ✅ Email/Password Sign-In
- ✅ Password Reset Flow (Forgot Password)
- ✅ Protected Routes with AuthGuard
- ✅ Session Management with Auto-Refresh
- ✅ Loading States & Error Handling
- ✅ Toast Notifications for User Feedback
- ✅ Form Validation with Zod
- ✅ Profile Management

## Architecture

### State Management

**Zustand Store** ([store/authStore.ts](store/authStore.ts))
- Manages authentication state globally
- Includes session, user, loading, and error states
- Provides methods for sign-in, sign-up, sign-out, and password management
- Integrates with Toast notifications for user feedback

### Form Validation

**Zod Schemas** ([utils/authValidation.ts](utils/authValidation.ts))

Password requirements:
- Minimum 8 characters
- At least one uppercase letter
- At least one lowercase letter
- At least one number

### Auth Screens

1. **Sign Up** ([app/(auth)/sign-up.tsx](app/(auth)/sign-up.tsx))
   - Email input with validation
   - Password input with strength requirements
   - Password confirmation
   - Real-time error display
   - Loading states

2. **Sign In** ([app/(auth)/sign-in.tsx](app/(auth)/sign-in.tsx))
   - Email/password login
   - "Forgot Password" link
   - Form validation
   - Error handling

3. **Forgot Password** ([app/(auth)/forgot-password.tsx](app/(auth)/forgot-password.tsx))
   - Email input to send reset link
   - Success confirmation screen
   - Deep link redirect to reset password screen

4. **Reset Password** ([app/(auth)/reset-password.tsx](app/(auth)/reset-password.tsx))
   - New password input with validation
   - Password confirmation
   - Updates password via Supabase

### Protected Routes

**AuthGuard Component** ([components/auth/AuthGuard.tsx](components/auth/AuthGuard.tsx))
- Wraps protected screens
- Redirects unauthenticated users to sign-in
- Currently protects:
  - Profile Tab
  - Watchlist Tab

### Session Management

**Root Layout** ([app/_layout.tsx](app/_layout.tsx))
- Initializes session on app start
- Shows loading screen during session check
- Subscribes to auth state changes
- Auto-updates store on auth events

## User Flow

### Sign Up Flow

1. User enters email, password, and password confirmation
2. Form validates with Zod schema
3. Supabase creates account
4. Success toast notification
5. User redirected to app (tabs)
6. Supabase sends verification email (optional)

### Sign In Flow

1. User enters email and password
2. Form validates credentials
3. Supabase authenticates user
4. Success toast notification
5. User redirected to app (tabs)

### Password Reset Flow

1. User clicks "Forgot Password" on sign-in screen
2. User enters email address
3. Supabase sends reset email with deep link
4. User clicks link in email
5. App opens to reset-password screen
6. User enters new password (with validation)
7. Password updated in Supabase
8. User redirected to sign-in

### Sign Out Flow

1. User clicks "Sign Out" in Profile tab
2. Supabase signs out user
3. Session cleared from store
4. User redirected to sign-in screen

## Configuration

### Supabase Setup

**Required Environment Variables** (`.env` file):
```env
EXPO_PUBLIC_SUPABASE_URL=your-project-url
EXPO_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

**Supabase Client** ([services/supabase.ts](services/supabase.ts))
- Uses AsyncStorage for session persistence
- Auto-refresh tokens enabled
- Deep linking configured: `smtime://reset-password`

### Deep Linking

**App Scheme**: `smtime://`

Configured in [app.json](app.json):
```json
{
  "scheme": "smtime"
}
```

**Password Reset Redirect**:
- Supabase sends email with link: `smtime://reset-password`
- App automatically opens to reset password screen

## Supabase Dashboard Configuration

### Email Templates

1. Go to Authentication > Email Templates in Supabase Dashboard
2. Configure "Reset Password" template:
   - Set redirect URL to: `smtime://reset-password`
   - Customize email design (optional)

### Email Settings

1. Go to Authentication > Settings
2. Enable "Confirm Email" (optional, recommended for production)
3. Configure email rate limiting to prevent abuse

### Auth Providers

Currently configured for **email/password** only.

To add social providers (Google, Apple):
- Dependencies already installed
- Configuration needed in Supabase Dashboard
- Implementation required in auth screens

## File Structure

```
app/
├── _layout.tsx                    # Root layout with session init
├── (auth)/
│   ├── sign-in.tsx               # Sign in screen
│   ├── sign-up.tsx               # Sign up screen
│   ├── forgot-password.tsx       # Forgot password screen
│   └── reset-password.tsx        # Reset password screen
├── (tabs)/
│   └── profile.tsx               # Profile screen with sign out

components/
├── auth/
│   └── AuthGuard.tsx             # Protected route wrapper
└── ui/
    ├── Input.tsx                 # Form input component
    └── Button.tsx                # Button component

store/
└── authStore.ts                   # Zustand auth state

services/
├── supabase.ts                   # Supabase client config
└── auth.ts                       # Legacy auth functions (deprecated)

hooks/
└── useAuth.ts                    # Auth hook (exposes store)

utils/
└── authValidation.ts             # Zod validation schemas
```

## API Reference

### Auth Store Methods

```typescript
// Sign in
const result = await signIn(email, password);
// Returns: { success: boolean }

// Sign up
const result = await signUp(email, password);
// Returns: { success: boolean }

// Sign out
await signOut();

// Request password reset
const result = await resetPassword(email);
// Returns: { success: boolean }

// Update password
const result = await updatePassword(newPassword);
// Returns: { success: boolean }

// Clear error state
clearError();
```

### Auth Store State

```typescript
{
  session: Session | null;
  user: User | null;
  isLoading: boolean;
  isInitializing: boolean;
  error: string | null;
}
```

### useAuth Hook

```typescript
const {
  session,
  user,
  isLoading,
  isInitializing,
  error,
  signIn,
  signUp,
  signOut,
  resetPassword,
  updatePassword,
  clearError,
  isAuthenticated,
} = useAuth();
```

## Toast Notifications

The app uses `react-native-toast-message` for user feedback:

- ✅ Success messages (green)
- ❌ Error messages (red)
- Automatic dismissal
- Positioned at top of screen

Example messages:
- "Welcome back!" (sign in)
- "Account Created!" (sign up)
- "Email Sent" (password reset)
- "Password Updated" (reset complete)
- Error messages from Supabase

## Security Best Practices

✅ **Implemented:**
- Password validation (length, complexity)
- Secure session storage (AsyncStorage)
- Auto-refresh tokens
- HTTPS-only communication (Supabase)
- Protected routes with AuthGuard

🔄 **Recommended for Production:**
- Email verification enforcement
- Rate limiting (configure in Supabase)
- Biometric authentication (Face ID/Touch ID)
- Multi-factor authentication (MFA)
- Session timeout policies
- Account deletion flow

## Testing

### Manual Testing Checklist

- [ ] Sign up with new email
- [ ] Receive verification email (if enabled)
- [ ] Sign in with correct credentials
- [ ] Sign in with incorrect credentials (expect error)
- [ ] Access protected routes (Profile, Watchlist)
- [ ] Request password reset
- [ ] Click reset link from email
- [ ] Update password successfully
- [ ] Sign in with new password
- [ ] Sign out
- [ ] Verify redirect to sign-in
- [ ] Check session persistence (close/reopen app)

## Next Steps / Enhancements

### Phase 2: Social Authentication

1. **Google Sign-In**
   - Configure OAuth in Supabase
   - Implement Google button
   - Handle OAuth callbacks

2. **Apple Sign-In**
   - Configure Apple OAuth
   - Implement Apple button
   - iOS-specific setup

### Phase 3: Email Verification

1. Create email verification screen
2. Resend verification email button
3. Handle verification deep links
4. Enforce verification before access

### Phase 4: Advanced Features

1. **Biometric Authentication**
   - Add expo-local-authentication
   - Face ID/Touch ID option
   - Secure credential storage

2. **Multi-Factor Authentication (MFA)**
   - TOTP setup
   - SMS verification
   - Backup codes

3. **Profile Management**
   - Avatar upload
   - Display name editing
   - Account deletion

4. **Session Management**
   - View active sessions
   - Revoke sessions
   - Session timeout

## Troubleshooting

### Common Issues

**Issue: "Invalid login credentials" error**
- Verify email/password are correct
- Check Supabase dashboard for user existence
- Ensure email is verified (if required)

**Issue: Password reset email not received**
- Check spam folder
- Verify email template configuration in Supabase
- Check Supabase email logs

**Issue: Deep link not working**
- Verify app scheme in app.json
- Test deep link: `npx uri-scheme open smtime://reset-password --ios`
- Rebuild app after changing app.json

**Issue: Session not persisting**
- Check AsyncStorage permissions
- Verify Supabase client configuration
- Clear app data and re-test

**Issue: Toast not showing**
- Verify Toast component is in root layout
- Check if Toast.show() is being called
- Look for z-index issues

## Support

For issues or questions:
1. Check Supabase dashboard logs
2. Review browser/Metro console for errors
3. Verify .env variables are loaded
4. Test Supabase connection independently

## Dependencies

```json
{
  "@supabase/supabase-js": "^2.112.3",
  "@react-native-async-storage/async-storage": "2.2.0",
  "zod": "^3.x.x",
  "react-native-toast-message": "^2.x.x",
  "zustand": "^5.0.15",
  "expo-router": "~57.0.12"
}
```

## License

Same as project license.
