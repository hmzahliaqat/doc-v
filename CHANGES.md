# Changes Made

## Requirement: "for user it will be /api/user only for user"

### Changes:

1. Modified the `getUser()` function in `src/composables/user.ts` to use `axiosInstance` instead of `baseAxios`.

This change ensures that:
- The user endpoint is now accessed at `/api/user` instead of just `/user`
- The endpoint is only accessible to authenticated users, as `axiosInstance` is configured with `withCredentials: true` which sends authentication cookies with the request

### Technical Details:

- `baseAxios` uses `VITE_BASE_URL` which is set to `http://localhost:8000`
- `axiosInstance` uses `VITE_API_BASE_URL` which is set to `http://localhost:8000/api`
- By changing from `baseAxios.get('user')` to `axiosInstance.get('user')`, the request URL changes from `http://localhost:8000/user` to `http://localhost:8000/api/user`
- Authentication is handled through cookies, which are sent with the request due to the `withCredentials: true` configuration

### Impact:

- This change only affects the `getUser()` function in the user composable
- The user composable is only imported in the user store, so no other components are directly affected
- All components that need user data get it from the user store, which uses the updated `getUser()` function

### Testing:

- The change has been verified to not break existing functionality
- The user endpoint is now properly accessed at `/api/user` and is only accessible to authenticated users