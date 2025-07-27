# Password Reset Link Fix

## Issue
When clicking on a password reset link from an email, the following Vue Router warning was displayed:
```
[Vue Router warn]: No match found for location with path "/password-reset/d8087e86253974380739a8fa6cdd340d778348caee15be3ba8a7b7a42686314a?email=mavenava00@gmail.com"
```

## Root Cause
The password reset emails were sending links with the format:
```
/password-reset/{token}?email={email}
```

However, the application's router configuration only had a route for:
```
/reset-password
```

The ResetPassword component expects both the token and email as query parameters, but the email links were providing the token as a path parameter.

## Solution
Added a new route in `src/router/setup.ts` that:
1. Matches the URL format from the email links (`/password-reset/:token`)
2. Redirects to the existing reset-password route
3. Passes both the token and email as query parameters

```typescript
{
  path: 'password-reset/:token',
  redirect: to => {
    return { 
      name: 'reset-password', 
      query: { 
        token: to.params.token, 
        email: to.query.email 
      } 
    };
  },
  meta: { requiresAuth: false },
},
```

## How It Works
1. When a user clicks a password reset link like `/password-reset/abc123?email=user@example.com`
2. The new route catches this URL pattern
3. It extracts the token (`abc123`) from the path and the email (`user@example.com`) from the query
4. It redirects to `/reset-password?token=abc123&email=user@example.com`
5. The ResetPassword component receives both parameters as expected

This solution maintains compatibility with the existing ResetPassword component without requiring changes to its code or the email templates.