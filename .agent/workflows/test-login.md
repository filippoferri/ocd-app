---
description: Login to the app with the test account for browser testing
---

# Test Account Login

Use this workflow to authenticate into the app before testing any feature.

## Credentials

- **Email:** `test-agent-new@docrelief.app`
- **Password:** `TestAgent2026!`

## Steps

// turbo-all

1. Navigate to `http://localhost:8081`
2. Wait for the page to load (the auth screen should appear)
3. Look for the "Continua con Email" button and click it
4. Find the email input field and type: `test-agent-new@docrelief.app`
5. Find the password input field and type: `TestAgent2026!`
6. Click the "ACCEDI" button
7. Wait for the app to load — you should see the home screen with "Test Agent" as user name

## Notes

- The test account has onboarding marked as completed, so you should land directly on the home page.
- If login fails, check that the Expo dev server is running on port 8081.
