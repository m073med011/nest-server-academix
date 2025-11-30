# API Documentation

## Auth Module

### Register a new user
- **Method**: POST
- **Endpoint**: `/auth/register`
- **Description**: Register a new user.
- **Body**:
  ```json
  {
    "name": "string",
    "email": "string",
    "password": "string (optional, min 6 chars)",
    "role": "UserRole (optional)",
    "isOAuthUser": "boolean (optional)",
    "provider": "AuthProvider (optional)",
    "imageProfileUrl": "string (optional)"
  }
  ```
- **Expected Response**:
  - Status: 201 Created
  - Body: User object (or similar result)

### Login user
- **Method**: POST
- **Endpoint**: `/auth/login`
- **Description**: Login user.
- **Body**:
  ```json
  {
    "email": "string",
    "password": "string"
  }
  ```
- **Expected Response**:
  - Status: 200 OK
  - Body: Login result (likely token)

### Verify email with OTP
- **Method**: POST
- **Endpoint**: `/auth/verify-email`
- **Description**: Verify email using OTP.
- **Body**:
  ```json
  {
    "email": "string",
    "otp": "string"
  }
  ```
- **Expected Response**:
  - Status: 200 OK

### Request password reset OTP
- **Method**: POST
- **Endpoint**: `/auth/forgot-password`
- **Description**: Request OTP for password reset.
- **Body**:
  ```json
  {
    "email": "string"
  }
  ```
- **Expected Response**:
  - Status: 200 OK

### Reset password with OTP
- **Method**: POST
- **Endpoint**: `/auth/reset-password`
- **Description**: Reset password using OTP.
- **Body**:
  ```json
  {
    "email": "string",
    "otp": "string",
    "newPassword": "string (min 6 chars)"
  }
  ```
- **Expected Response**:
  - Status: 200 OK

### Refresh access token
- **Method**: POST
- **Endpoint**: `/auth/refresh`
- **Description**: Refresh access token.
- **Body**:
  ```json
  {
    "refreshToken": "string (optional)"
  }
  ```
- **Expected Response**:
  - Status: 200 OK

### Logout user
- **Method**: POST
- **Endpoint**: `/auth/logout`
- **Description**: Logout user.
- **Expected Response**:
  - Status: 200 OK

### Get current user profile
- **Method**: GET
- **Endpoint**: `/auth/me`
- **Headers**: `Authorization: Bearer <token>`
- **Description**: Get current user profile.
- **Expected Response**:
  - Status: 200 OK
  - Body: `{ success: true, user: ... }`

### Get user by email (OAuth check)
- **Method**: GET
- **Endpoint**: `/auth/user/:email`
- **Description**: Check if user exists by email.
- **Expected Response**:
  - Status: 200 OK

### Enable 2FA
- **Method**: POST
- **Endpoint**: `/auth/enable-2fa`
- **Headers**: `Authorization: Bearer <token>`
- **Description**: Initiate 2FA enablement.
- **Expected Response**:
  - Status: 201 Created

### Confirm 2FA enablement
- **Method**: POST
- **Endpoint**: `/auth/confirm-2fa`
- **Headers**: `Authorization: Bearer <token>`
- **Description**: Confirm 2FA with OTP.
- **Body**:
  ```json
  {
    "otp": "string"
  }
  ```
- **Expected Response**:
  - Status: 201 Created

### Disable 2FA
- **Method**: POST
- **Endpoint**: `/auth/disable-2fa`
- **Headers**: `Authorization: Bearer <token>`
- **Description**: Disable 2FA.
- **Expected Response**:
  - Status: 201 Created

### Complete registration (role selection)
- **Method**: POST
- **Endpoint**: `/auth/complete-registration`
- **Headers**: `Authorization: Bearer <token>`
- **Description**: Complete registration by selecting a role.
- **Body**:
  ```json
  {
    "role": "UserRole"
  }
  ```
- **Expected Response**:
  - Status: 200 OK

### Google OAuth login
- **Method**: GET
- **Endpoint**: `/auth/google`
- **Description**: Initiate Google OAuth login.

### Google OAuth callback
- **Method**: GET
- **Endpoint**: `/auth/google/callback`
- **Description**: Callback for Google OAuth.

## Users Module

### Search users by email
- **Method**: GET
- **Endpoint**: `/users/search`
- **Headers**: `Authorization: Bearer <token>`
- **Query Params**: `email` (string, required)
- **Description**: Search users by email.
- **Expected Response**:
  - Status: 200 OK
  - Body: List of users or user object.

### Get current user profile
- **Method**: GET
- **Endpoint**: `/users/profile`
- **Headers**: `Authorization: Bearer <token>`
- **Description**: Get current user profile.
- **Expected Response**:
  - Status: 200 OK
  - Body: User profile.

### Update user profile
- **Method**: PATCH
- **Endpoint**: `/users/profile`
- **Headers**: `Authorization: Bearer <token>`
- **Description**: Update user profile.
- **Body**:
  ```json
  {
    "name": "string (optional)",
    "email": "string (optional)",
    "imageProfileUrl": "string (optional)"
  }
  ```
- **Expected Response**:
  - Status: 200 OK

### Change password
- **Method**: POST
- **Endpoint**: `/users/change-password`
- **Headers**: `Authorization: Bearer <token>`
- **Description**: Change password.
- **Body**:
  ```json
  {
    "currentPassword": "string",
    "newPassword": "string (min 6 chars)"
  }
  ```
- **Expected Response**:
  - Status: 200 OK

### Get user organizations
- **Method**: GET
- **Endpoint**: `/users/organizations`
- **Headers**: `Authorization: Bearer <token>`
- **Description**: Get user organizations.
- **Expected Response**:
  - Status: 200 OK

### Switch active organization context
- **Method**: POST
- **Endpoint**: `/users/switch-context`
- **Headers**: `Authorization: Bearer <token>`
- **Description**: Switch active organization context.
- **Body**:
  ```json
  {
    "organizationId": "string"
  }
  ```
- **Expected Response**:
  - Status: 200 OK

## Analysis Module

### Get instructor analysis summary
- **Method**: GET
- **Endpoint**: `/analysis/instructor/:instructorId/count`
- **Description**: Get analysis summary for an instructor.
- **Expected Response**:
  - Status: 200 OK

## Attendance Module

### Create attendance record
- **Method**: POST
- **Endpoint**: `/attendance`
- **Body**:
  ```json
  {
    "userId": "string",
    "courseId": "string",
    "materialId": "string",
    "organizationId": "string",
    "status": "AttendanceStatus (present, absent, late, excused)",
    "notes": "string (optional)"
  }
  ```
- **Expected Response**:
  - Status: 201 Created

### Get all attendance records
- **Method**: GET
- **Endpoint**: `/attendance`
- **Expected Response**:
  - Status: 200 OK

### Get attendance record by ID
- **Method**: GET
- **Endpoint**: `/attendance/:id`
- **Expected Response**:
  - Status: 200 OK

### Update attendance record
- **Method**: PATCH
- **Endpoint**: `/attendance/:id`
- **Body**: Partial attendance object.
- **Expected Response**:
  - Status: 200 OK

### Delete attendance record
- **Method**: DELETE
- **Endpoint**: `/attendance/:id`
- **Expected Response**:
  - Status: 200 OK

## Cart Module

### Get cart
- **Method**: GET
- **Endpoint**: `/cart`
- **Headers**: `Authorization: Bearer <token>`
- **Description**: Get user's cart.
- **Expected Response**:
  - Status: 200 OK

### Add item to cart
- **Method**: POST
- **Endpoint**: `/cart/items`
- **Headers**: `Authorization: Bearer <token>`
- **Body**:
  ```json
  {
    "courseId": "string"
  }
  ```
- **Expected Response**:
  - Status: 201 Created

### Remove item from cart
- **Method**: DELETE
- **Endpoint**: `/cart/items/:courseId`
- **Headers**: `Authorization: Bearer <token>`
- **Expected Response**:
  - Status: 200 OK

### Remove multiple items from cart
- **Method**: DELETE
- **Endpoint**: `/cart/items`
- **Headers**: `Authorization: Bearer <token>`
- **Body**:
  ```json
  {
    "courseIds": ["string"]
  }
  ```
- **Expected Response**:
  - Status: 200 OK

### Clear cart
- **Method**: DELETE
- **Endpoint**: `/cart`
- **Headers**: `Authorization: Bearer <token>`
- **Expected Response**:
  - Status: 200 OK

## Chat Module

### Create chat
- **Method**: POST
- **Endpoint**: `/chat`
- **Headers**: `Authorization: Bearer <token>`
- **Body**:
  ```json
  {
    "type": "ChatType (private, course, system)",
    "participants": ["string (userId)"],
    "courseId": "string (optional)",
    "name": "string (optional)"
  }
  ```
- **Expected Response**:
  - Status: 201 Created

### Get all chats
- **Method**: GET
- **Endpoint**: `/chat`
- **Headers**: `Authorization: Bearer <token>`
- **Description**: Get chats for current user.
- **Expected Response**:
  - Status: 200 OK

### Get chat by ID
- **Method**: GET
- **Endpoint**: `/chat/:id`
- **Expected Response**:
  - Status: 200 OK

### Update chat
- **Method**: PATCH
- **Endpoint**: `/chat/:id`
- **Body**: Partial chat object.
- **Expected Response**:
  - Status: 200 OK

### Delete chat
- **Method**: DELETE
- **Endpoint**: `/chat/:id`
- **Expected Response**:
  - Status: 200 OK

## Courses Module

### Create a new course
- **Method**: POST
- **Endpoint**: `/courses`
- **Headers**: `Authorization: Bearer <token>`
- **Body**:
  ```json
  {
    "title": "string",
    "description": "string",
    "thumbnailUrl": "string (optional)",
    "level": "CourseLevel (beginner, intermediate, advanced)",
    "category": "string",
    "price": "number",
    "tags": ["string"] (optional),
    "isPublished": "boolean (optional)",
    "organizationId": "string (optional)",
    "isOrgPrivate": "boolean (optional)"
  }
  ```
- **Expected Response**:
  - Status: 201 Created

### Get all courses
- **Method**: GET
- **Endpoint**: `/courses`
- **Query Params**:
  - `page`: string (optional)
  - `limit`: string (optional)
  - `category`: string (optional)
  - `level`: CourseLevel (optional)
  - `search`: string (optional)
- **Expected Response**:
  - Status: 200 OK

### Get user purchased courses
- **Method**: GET
- **Endpoint**: `/courses/user/purchased`
- **Headers**: `Authorization: Bearer <token>`
- **Expected Response**:
  - Status: 200 OK

### Get courses by instructor
- **Method**: GET
- **Endpoint**: `/courses/instructor/:instructorId`
- **Expected Response**:
  - Status: 200 OK

### Get course by ID
- **Method**: GET
- **Endpoint**: `/courses/:id`
- **Expected Response**:
  - Status: 200 OK

### Update course
- **Method**: PATCH
- **Endpoint**: `/courses/:id`
- **Headers**: `Authorization: Bearer <token>`
- **Body**:
  ```json
  {
    "title": "string (optional)",
    "description": "string (optional)",
    "thumbnailUrl": "string (optional)",
    "level": "CourseLevel (optional)",
    "category": "string (optional)",
    "price": "number (optional)",
    "tags": ["string"] (optional),
    "isPublished": "boolean (optional)",
    "isOrgPrivate": "boolean (optional)"
  }
  ```
- **Expected Response**:
  - Status: 200 OK

### Delete course
- **Method**: DELETE
- **Endpoint**: `/courses/:id`
- **Headers**: `Authorization: Bearer <token>`
- **Expected Response**:
  - Status: 200 OK

### Enroll in course
- **Method**: POST
- **Endpoint**: `/courses/:id/enroll`
- **Headers**: `Authorization: Bearer <token>`
- **Expected Response**:
  - Status: 200 OK

### Add editor to course
- **Method**: POST
- **Endpoint**: `/courses/:id/editors`
- **Headers**: `Authorization: Bearer <token>`
- **Body**:
  ```json
  {
    "editorId": "string"
  }
  ```
- **Expected Response**:
  - Status: 200 OK

### Remove editor from course
- **Method**: DELETE
- **Endpoint**: `/courses/:id/editors/:editorId`
- **Headers**: `Authorization: Bearer <token>`
- **Expected Response**:
  - Status: 200 OK

## Discount Module

### Create discount code
- **Method**: POST
- **Endpoint**: `/discounts`
- **Headers**: `Authorization: Bearer <token>`
- **Body**:
  ```json
  {
    "code": "string",
    "type": "DiscountType (platform_wide, course_specific)",
    "value": "number",
    "valueType": "DiscountValueType (percentage, fixed)",
    "applicableOn": "ApplicableOn (single_only, both)",
    "maxUses": "number (optional)",
    "expiresAt": "Date (optional)",
    "courseId": "string (optional, required if course_specific)"
  }
  ```
- **Expected Response**:
  - Status: 201 Created

### Get all discount codes
- **Method**: GET
- **Endpoint**: `/discounts`
- **Headers**: `Authorization: Bearer <token>`
- **Expected Response**:
  - Status: 200 OK

### Get discount code by ID
- **Method**: GET
- **Endpoint**: `/discounts/:id`
- **Headers**: `Authorization: Bearer <token>`
- **Expected Response**:
  - Status: 200 OK

### Get discount code by code
- **Method**: GET
- **Endpoint**: `/discounts/code/:code`
- **Headers**: `Authorization: Bearer <token>`
- **Expected Response**:
  - Status: 200 OK

### Update discount code
- **Method**: PATCH
- **Endpoint**: `/discounts/:id`
- **Headers**: `Authorization: Bearer <token>`
- **Body**: Partial discount object.
- **Expected Response**:
  - Status: 200 OK

### Delete discount code
- **Method**: DELETE
- **Endpoint**: `/discounts/:id`
- **Headers**: `Authorization: Bearer <token>`
- **Expected Response**:
  - Status: 200 OK

## Health Module

### Check system health
- **Method**: GET
- **Endpoint**: `/health`
- **Description**: Check system health.
- **Expected Response**:
  - Status: 200 OK

## Invoice Module

### Create invoice
- **Method**: POST
- **Endpoint**: `/invoices`
- **Headers**: `Authorization: Bearer <token>`
- **Body**:
  ```json
  {
    "paymentId": "string",
    "userId": "string",
    "courseIds": ["string"],
    "amount": "number",
    "currency": "string",
    "paymentMethod": "string",
    "billingData": {
      "firstName": "string",
      "lastName": "string",
      "email": "string",
      "phoneNumber": "string",
      "address": "string",
      "city": "string",
      "country": "string"
    },
    "items": [{
      "courseId": "string",
      "courseName": "string",
      "price": "number",
      "quantity": "number"
    }]
  }
  ```
- **Expected Response**:
  - Status: 201 Created

### Get all invoices
- **Method**: GET
- **Endpoint**: `/invoices`
- **Headers**: `Authorization: Bearer <token>`
- **Description**: Get user's invoices.
- **Expected Response**:
  - Status: 200 OK

### Get invoice by ID
- **Method**: GET
- **Endpoint**: `/invoices/:id`
- **Headers**: `Authorization: Bearer <token>`
- **Expected Response**:
  - Status: 200 OK

### Get invoice by number
- **Method**: GET
- **Endpoint**: `/invoices/number/:invoiceNumber`
- **Headers**: `Authorization: Bearer <token>`
- **Expected Response**:
  - Status: 200 OK

### Update invoice
- **Method**: PATCH
- **Endpoint**: `/invoices/:id`
- **Headers**: `Authorization: Bearer <token>`
- **Body**: Partial invoice object.
- **Expected Response**:
  - Status: 200 OK

### Delete invoice
- **Method**: DELETE
- **Endpoint**: `/invoices/:id`
- **Headers**: `Authorization: Bearer <token>`
- **Expected Response**:
  - Status: 200 OK

## Level Module

### Create level
- **Method**: POST
- **Endpoint**: `/levels`
- **Headers**: `Authorization: Bearer <token>`
- **Body**:
  ```json
  {
    "name": "string",
    "description": "string (optional)",
    "organizationId": "string",
    "order": "number (optional)"
  }
  ```
- **Expected Response**:
  - Status: 201 Created

### Get all levels
- **Method**: GET
- **Endpoint**: `/levels`
- **Headers**: `Authorization: Bearer <token>`
- **Expected Response**:
  - Status: 200 OK

### Get level by ID
- **Method**: GET
- **Endpoint**: `/levels/:id`
- **Headers**: `Authorization: Bearer <token>`
- **Expected Response**:
  - Status: 200 OK

### Get levels by organization
- **Method**: GET
- **Endpoint**: `/levels/organization/:organizationId`
- **Headers**: `Authorization: Bearer <token>`
- **Expected Response**:
  - Status: 200 OK

### Update level
- **Method**: PATCH
- **Endpoint**: `/levels/:id`
- **Headers**: `Authorization: Bearer <token>`
- **Body**: Partial level object.
- **Expected Response**:
  - Status: 200 OK

### Delete level
- **Method**: DELETE
- **Endpoint**: `/levels/:id`
- **Headers**: `Authorization: Bearer <token>`
- **Expected Response**:
  - Status: 200 OK

## Material Module

### Create material
- **Method**: POST
- **Endpoint**: `/materials`
- **Headers**: `Authorization: Bearer <token>`
- **Body**:
  ```json
  {
    "courseId": "string",
    "title": "string",
    "description": "string (optional)",
    "type": "MaterialType (video, pdf, link, text)",
    "content": "string",
    "order": "number (optional)",
    "duration": "number (optional)",
    "isPublished": "boolean (optional)"
  }
  ```
- **Expected Response**:
  - Status: 201 Created

### Get all materials
- **Method**: GET
- **Endpoint**: `/materials`
- **Headers**: `Authorization: Bearer <token>`
- **Expected Response**:
  - Status: 200 OK

### Get material by ID
- **Method**: GET
- **Endpoint**: `/materials/:id`
- **Headers**: `Authorization: Bearer <token>`
- **Expected Response**:
  - Status: 200 OK

### Get materials by course
- **Method**: GET
- **Endpoint**: `/materials/course/:courseId`
- **Headers**: `Authorization: Bearer <token>`
- **Expected Response**:
  - Status: 200 OK

### Update material
- **Method**: PATCH
- **Endpoint**: `/materials/:id`
- **Headers**: `Authorization: Bearer <token>`
- **Body**: Partial material object.
- **Expected Response**:
  - Status: 200 OK

### Delete material
- **Method**: DELETE
- **Endpoint**: `/materials/:id`
- **Headers**: `Authorization: Bearer <token>`
- **Expected Response**:
  - Status: 200 OK

## Organizations Module

### Create organization
- **Method**: POST
- **Endpoint**: `/organizations`
- **Headers**: `Authorization: Bearer <token>`
- **Body**:
  ```json
  {
    "name": "string",
    "description": "string (optional)"
  }
  ```
- **Expected Response**:
  - Status: 201 Created

### Get all organizations
- **Method**: GET
- **Endpoint**: `/organizations`
- **Expected Response**:
  - Status: 200 OK

### Get organization by ID
- **Method**: GET
- **Endpoint**: `/organizations/:id`
- **Expected Response**:
  - Status: 200 OK

### Update organization
- **Method**: PATCH
- **Endpoint**: `/organizations/:id`
- **Headers**: `Authorization: Bearer <token>`
- **Body**:
  ```json
  {
    "name": "string (optional)",
    "description": "string (optional)",
    "settings": "any (optional)"
  }
  ```
- **Expected Response**:
  - Status: 200 OK

### Delete organization
- **Method**: DELETE
- **Endpoint**: `/organizations/:id`
- **Headers**: `Authorization: Bearer <token>`
- **Expected Response**:
  - Status: 200 OK

### Search user by email
- **Method**: POST
- **Endpoint**: `/organizations/search-user`
- **Headers**: `Authorization: Bearer <token>`
- **Body**:
  ```json
  {
    "email": "string"
  }
  ```
- **Expected Response**:
  - Status: 200 OK

### Add member to organization
- **Method**: POST
- **Endpoint**: `/organizations/:id/members`
- **Headers**: `Authorization: Bearer <token>`
- **Body**:
  ```json
  {
    "userId": "string",
    "email": "string",
    "roleId": "string",
    "levelId": "string (optional)",
    "termId": "string (optional)"
  }
  ```
- **Expected Response**:
  - Status: 201 Created

### Remove member from organization
- **Method**: DELETE
- **Endpoint**: `/organizations/:id/members/:userId`
- **Headers**: `Authorization: Bearer <token>`
- **Expected Response**:
  - Status: 200 OK

### Get organization members
- **Method**: GET
- **Endpoint**: `/organizations/:id/members`
- **Headers**: `Authorization: Bearer <token>`
- **Query Params**: `status` (string, optional)
- **Expected Response**:
  - Status: 200 OK

### Leave organization
- **Method**: POST
- **Endpoint**: `/organizations/:id/members/leave`
- **Headers**: `Authorization: Bearer <token>`
- **Expected Response**:
  - Status: 200 OK

### Get organization users by role
- **Method**: GET
- **Endpoint**: `/organizations/:id/users`
- **Headers**: `Authorization: Bearer <token>`
- **Query Params**: `roleId` (string, optional)
- **Expected Response**:
  - Status: 200 OK

### Update member role
- **Method**: PATCH
- **Endpoint**: `/organizations/:id/users/:userId/role`
- **Headers**: `Authorization: Bearer <token>`
- **Body**:
  ```json
  {
    "roleId": "string",
    "levelId": "string (optional)",
    "termId": "string (optional)"
  }
  ```
- **Expected Response**:
  - Status: 200 OK

### Get member details
- **Method**: GET
- **Endpoint**: `/organizations/:id/users/:userId`
- **Headers**: `Authorization: Bearer <token>`
- **Expected Response**:
  - Status: 200 OK

### Get organization roles
- **Method**: GET
- **Endpoint**: `/organizations/:id/roles`
- **Headers**: `Authorization: Bearer <token>`
- **Expected Response**:
  - Status: 200 OK

### Create organization role
- **Method**: POST
- **Endpoint**: `/organizations/:id/roles`
- **Headers**: `Authorization: Bearer <token>`
- **Body**:
  ```json
  {
    "name": "string",
    "permissions": "RolePermissions (optional)"
  }
  ```
- **Expected Response**:
  - Status: 201 Created

### Update organization role
- **Method**: PATCH
- **Endpoint**: `/organizations/:id/roles/:roleId`
- **Headers**: `Authorization: Bearer <token>`
- **Body**:
  ```json
  {
    "name": "string (optional)",
    "permissions": "RolePermissions (optional)"
  }
  ```
- **Expected Response**:
  - Status: 200 OK

### Delete organization role
- **Method**: DELETE
- **Endpoint**: `/organizations/:id/roles/:roleId`
- **Headers**: `Authorization: Bearer <token>`
- **Expected Response**:
  - Status: 200 OK

### Accept organization invitation
- **Method**: POST
- **Endpoint**: `/organizations/:id/invitations/accept`
- **Headers**: `Authorization: Bearer <token>`
- **Expected Response**:
  - Status: 200 OK

### Get organization courses
- **Method**: GET
- **Endpoint**: `/organizations/:id/courses`
- **Query Params**:
  - `termId`: string (optional)
  - `levelId`: string (optional)
  - `instructor`: string (optional)
  - `isPublished`: string (optional)
- **Expected Response**:
  - Status: 200 OK

### Create organization course
- **Method**: POST
- **Endpoint**: `/organizations/:id/courses`
- **Headers**: `Authorization: Bearer <token>`
- **Body**:
  ```json
  {
    "title": "string",
    "description": "string",
    "thumbnailUrl": "string (optional)",
    "level": "string",
    "category": "string",
    "price": "number",
    "tags": ["string"] (optional),
    "isPublished": "boolean (optional)",
    "isOrgPrivate": "boolean (optional)"
  }
  ```
- **Expected Response**:
  - Status: 201 Created

### Update organization course
- **Method**: PATCH
- **Endpoint**: `/organizations/:id/courses/:courseId`
- **Headers**: `Authorization: Bearer <token>`
- **Body**:
  ```json
  {
    "title": "string (optional)",
    "description": "string (optional)",
    "thumbnailUrl": "string (optional)",
    "level": "string (optional)",
    "category": "string (optional)",
    "price": "number (optional)",
    "tags": ["string"] (optional),
    "isPublished": "boolean (optional)",
    "isOrgPrivate": "boolean (optional)"
  }
  ```
- **Expected Response**:
  - Status: 200 OK

### Delete organization course
- **Method**: DELETE
- **Endpoint**: `/organizations/:id/courses/:courseId`
- **Headers**: `Authorization: Bearer <token>`
- **Expected Response**:
  - Status: 200 OK

### Assign course to term
- **Method**: PATCH
- **Endpoint**: `/organizations/:id/courses/:courseId/assign-term`
- **Headers**: `Authorization: Bearer <token>`
- **Body**:
  ```json
  {
    "termId": "string"
  }
  ```
- **Expected Response**:
  - Status: 200 OK

## OTP Module

### Generate OTP
- **Method**: POST
- **Endpoint**: `/otp/generate`
- **Body**:
  ```json
  {
    "email": "string",
    "purpose": "OtpPurpose (password_reset, email_verification, login_verification)"
  }
  ```
- **Expected Response**:
  - Status: 201 Created

### Verify OTP
- **Method**: POST
- **Endpoint**: `/otp/verify`
- **Body**:
  ```json
  {
    "email": "string",
    "code": "string",
    "purpose": "OtpPurpose"
  }
  ```
- **Expected Response**:
  - Status: 201 Created

## Payments Module

### Create payment
- **Method**: POST
- **Endpoint**: `/payments`
- **Body**:
  ```json
  {
    "userId": "string",
    "courseId": "string (optional)",
    "courseIds": ["string"] (optional),
    "amount": "number",
    "currency": "string",
    "paymentMethod": "PaymentMethod (card, wallet, cash)",
    "billingData": {
      "firstName": "string",
      "lastName": "string",
      "email": "string",
      "phoneNumber": "string",
      "..."
    }
  }
  ```
- **Expected Response**:
  - Status: 201 Created

### Get all payments
- **Method**: GET
- **Endpoint**: `/payments`
- **Expected Response**:
  - Status: 200 OK

### Get payment by ID
- **Method**: GET
- **Endpoint**: `/payments/:id`
- **Expected Response**:
  - Status: 200 OK

### Update payment
- **Method**: PATCH
- **Endpoint**: `/payments/:id`
- **Body**: Partial payment object.
- **Expected Response**:
  - Status: 200 OK

### Delete payment
- **Method**: DELETE
- **Endpoint**: `/payments/:id`
- **Expected Response**:
  - Status: 200 OK




