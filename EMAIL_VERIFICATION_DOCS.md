# Email Verification Documentation

This document provides information about the email verification functionality implemented in the PDF-signature application.

## Overview

The email verification system allows users to verify their email addresses, which is important for security and ensuring that users can receive important notifications. The system includes:

1. A reusable email verification banner component
2. API endpoints for sending verification emails and checking verification status
3. Router handling for verification links and failure scenarios
4. Automatic sending of verification emails after user registration

## Components

### EmailVerificationBanner

A reusable Vue component that displays a banner for unverified users with a button to send verification emails, and a success message for verified users.

#### Usage

```vue
<template>
  <!-- Basic usage -->
  <EmailVerificationBanner />
  
  <!-- With custom styling -->
  <EmailVerificationBanner class="mb-8" />
  
  <!-- Hide the success banner for verified users -->
  <EmailVerificationBanner :showOnVerified="false" />
</template>

<script setup>
import EmailVerificationBanner from '@/components/EmailVerificationBanner.vue';
</script>
```

#### Props

- `showOnVerified` (Boolean, default: `true`): Whether to show a success banner when the user's email is verified.

## API Endpoints

### Send Verification Email

Sends a verification email to the user's email address.

**Endpoint:** `POST /api/email/verification-notification`

**Example:**

```javascript
// Using fetch
async function sendVerificationEmail() {
  try {
    const response = await fetch('/api/email/verification-notification', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      }
    });

    const data = await response.json();
    
    if (response.ok) {
      alert('Verification email sent! Please check your inbox.');
    } else {
      alert(data.message || 'Failed to send verification email');
    }
  } catch (error) {
    console.error('Error sending verification email:', error);
    alert('An error occurred while sending the verification email');
  }
}

// Using the auth store
async function sendVerificationEmail() {
  try {
    await authStore.resendVerification();
    if (authStore.verificationEmailSent) {
      // Show success message
    }
  } catch (error) {
    // Handle error
  }
}
```

### Check Verification Status

Checks if the user's email is verified.

**Endpoint:** `GET /api/email/verification-status`

**Example:**

```javascript
// Using fetch
async function checkVerificationStatus() {
  try {
    const response = await fetch('/api/email/verification-status', {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
        'Accept': 'application/json'
      }
    });

    const data = await response.json();
    
    return {
      isVerified: data.email_verified,
      verifiedAt: data.email_verified_at
    };
  } catch (error) {
    console.error('Error checking verification status:', error);
    return { isVerified: false, verifiedAt: null };
  }
}

// Using the auth store
async function checkVerificationStatus() {
  try {
    const status = await authStore.checkEmailVerificationStatus();
    return status;
  } catch (error) {
    // Handle error
    return { email_verified: false, email_verified_at: null };
  }
}
```

## Router Handling

The application includes routes for handling email verification:

- `/email/verify/:id/:hash`: Verifies the user's email using the ID and hash from the verification link.
- `/email/verify`: Shows the verification notice page.
- `/email/verification-failed`: Shows an error page when verification fails.

### URL Parameters

The application checks for URL parameters to show appropriate messages:

- `verified=1`: Indicates that the email was successfully verified.
- `already_verified`: Indicates that the email was already verified.
- `error=invalid-link`: Indicates that the verification link is invalid or expired.
- `error=verification-failed`: Indicates that verification failed for another reason.

## Implementation Examples

### Profile Page

The Profile page includes the EmailVerificationBanner component to remind users to verify their email:

```vue
<template>
  <div class="profile-container">
    <!-- Email Verification Banner -->
    <EmailVerificationBanner />
    
    <!-- Profile form -->
    <!-- ... -->
  </div>
</template>
```

### Dashboard Page

The Dashboard page also includes the EmailVerificationBanner component:

```vue
<template>
  <div class="dashboard-container">
    <!-- Header -->
    <!-- ... -->
    
    <!-- Email Verification Banner -->
    <EmailVerificationBanner class="mb-8" />
    
    <!-- Dashboard content -->
    <!-- ... -->
  </div>
</template>
```

## Customization

You can customize the appearance of the EmailVerificationBanner component by modifying the component's template or by applying CSS classes.

## Registration Process

When a user registers for an account, the system automatically sends a verification email to the provided email address. This happens as part of the registration process, so users don't need to manually request a verification email after registering.

The automatic email verification process works as follows:

1. User completes the registration form and submits it
2. The system creates the user account
3. A verification email is automatically sent to the user's email address
4. The user is redirected to the login page
5. The user can check their email and click the verification link to verify their email address

If the user doesn't receive the verification email or doesn't verify their email address immediately, they will see the EmailVerificationBanner component on various pages (like Dashboard and Profile) reminding them to verify their email. They can use this banner to request a new verification email if needed.

## Troubleshooting

If users are not receiving verification emails:

1. Check that the email service is properly configured.
2. Verify that the user's email address is correct.
3. Check the server logs for any errors related to sending emails.
4. If the issue occurs during registration, check that the automatic email sending is working properly.

If verification links are not working:

1. Ensure that the verification link format is correct.
2. Check that the ID and hash parameters are being properly passed to the verification endpoint.
3. Verify that the user exists in the database.