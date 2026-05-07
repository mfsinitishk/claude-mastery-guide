# Lab 005: Feature Development End-to-End

## Learning Objectives

By the end of this lab, you will be able to:
- Plan and scope features with Claude's assistance
- Design APIs and data models collaboratively
- Implement features incrementally with TDD
- Write comprehensive tests at all levels
- Create documentation alongside code
- Perform self-code review before submission
- Handle edge cases and error scenarios systematically

## Prerequisites

- Completion of Labs 001-004
- Understanding of full-stack development
- Familiarity with test-driven development
- Knowledge of API design principles
- 90-120 minutes to complete the lab

## Setup

1. Create a new feature branch:
```bash
mkdir claude-lab-005-feature
cd claude-lab-005-feature
npm init -y
npm install express mongoose joi bcrypt jsonwebtoken
npm install --save-dev jest supertest @types/jest
```

2. Set up project structure:
```bash
mkdir -p src/{controllers,services,models,routes,middleware,utils}
mkdir -p tests/{unit,integration}
```

3. Open Claude in a new conversation

## Feature Specification

We'll build a complete feature: **User Profile Management System**

**Requirements**:
- Users can view their profile
- Users can update profile (name, bio, avatar URL)
- Users can change their password
- Profile changes are validated
- All actions are audited
- API is versioned and documented

## Exercise 1: Feature Planning and Design (25 minutes)

### Objective
Create a comprehensive feature plan with Claude's help.

### Instructions

**Step 1: Requirements Analysis**

Prompt:
```
I need to implement a User Profile Management feature with these requirements:

Business Requirements:
- Users must be authenticated to access their profile
- Users can view their complete profile
- Users can update: name, bio, avatar URL, email
- Users can change their password
- Email changes require verification
- Profile changes should be tracked in an audit log
- Invalid data should be rejected with clear error messages

Non-Functional Requirements:
- API response time <200ms (p95)
- Support 1000 concurrent users
- Data validation on all inputs
- Password changes require current password verification
- Secure password hashing (bcrypt)

Please help me:
1. Break down this feature into implementable tasks
2. Identify all API endpoints needed
3. Design the data model
4. Plan the validation rules
5. List all edge cases to handle
6. Suggest the implementation order
7. Estimate complexity for each task

Technology Stack:
- Node.js + Express
- MongoDB + Mongoose
- JWT authentication (already implemented)
- Jest for testing
```

**Step 2: API Design**

Continue with:
```
Based on the requirements, design the REST API endpoints:

For each endpoint specify:
- HTTP method and path
- Request headers required
- Request body schema (JSON)
- Success response (status code + body)
- Error responses (all possible status codes + bodies)
- Authentication/authorization requirements
- Validation rules
- Example curl command

Follow REST best practices and OpenAPI 3.0 specification format.
```

**Expected Output**:

```yaml
openapi: 3.0.0
info:
  title: User Profile API
  version: 1.0.0

paths:
  /api/v1/profile:
    get:
      summary: Get current user's profile
      security:
        - bearerAuth: []
      responses:
        '200':
          description: Profile retrieved successfully
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/UserProfile'
        '401':
          $ref: '#/components/responses/Unauthorized'
    
    patch:
      summary: Update current user's profile
      security:
        - bearerAuth: []
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              properties:
                name:
                  type: string
                  minLength: 2
                  maxLength: 100
                bio:
                  type: string
                  maxLength: 500
                avatarUrl:
                  type: string
                  format: uri
      responses:
        '200':
          description: Profile updated successfully
        '400':
          $ref: '#/components/responses/ValidationError'
        '401':
          $ref: '#/components/responses/Unauthorized'
  
  /api/v1/profile/password:
    put:
      summary: Change password
      security:
        - bearerAuth: []
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              required:
                - currentPassword
                - newPassword
              properties:
                currentPassword:
                  type: string
                  format: password
                newPassword:
                  type: string
                  format: password
                  minLength: 12
      responses:
        '200':
          description: Password changed successfully
        '400':
          $ref: '#/components/responses/ValidationError'
        '401':
          $ref: '#/components/responses/Unauthorized'
        '403':
          description: Current password is incorrect

components:
  schemas:
    UserProfile:
      type: object
      properties:
        id:
          type: string
        email:
          type: string
          format: email
        name:
          type: string
        bio:
          type: string
        avatarUrl:
          type: string
          format: uri
        createdAt:
          type: string
          format: date-time
        updatedAt:
          type: string
          format: date-time
```

**Step 3: Data Model Design**

Prompt:
```
Design the MongoDB schema for the User Profile feature using Mongoose:

Requirements:
- User collection with profile fields
- Audit log collection for tracking changes
- Email verification tokens (for email changes)
- Indexes for performance
- Validation at schema level
- Timestamps (createdAt, updatedAt)
- Virtual fields where appropriate
- Instance methods for common operations

Show:
1. Complete Mongoose schemas
2. Indexes and their justification
3. Validation rules
4. Instance methods
5. Static methods
6. Pre/post hooks if needed
```

**Step 4: Implementation Task Breakdown**

Prompt:
```
Break down the implementation into a task list with dependencies:

For each task:
- Task name
- Description
- Dependencies (what must be done first)
- Estimated effort (S/M/L)
- Acceptance criteria

Order tasks by dependency and priority.
```

**Expected Task List**:

```markdown
## Implementation Tasks

### Phase 1: Foundation (Prerequisites)
- [x] T1: Set up project structure (S)
- [x] T2: Install dependencies (S)
- [ ] T3: Create User model schema (M)
  - Acceptance: Schema with all fields, validations, indexes
- [ ] T4: Create AuditLog model schema (S)
  - Acceptance: Schema for audit trail

### Phase 2: Core Implementation
- [ ] T5: Implement GET /api/v1/profile (M)
  - Dependencies: T3
  - Acceptance: Returns user profile, authenticated users only
- [ ] T6: Implement PATCH /api/v1/profile (L)
  - Dependencies: T3, T4
  - Acceptance: Updates profile, validates input, creates audit log
- [ ] T7: Implement PUT /api/v1/profile/password (L)
  - Dependencies: T3, T4
  - Acceptance: Changes password securely, verifies current password

### Phase 3: Testing
- [ ] T8: Unit tests for validation (M)
  - Dependencies: T3
- [ ] T9: Unit tests for services (M)
  - Dependencies: T5, T6, T7
- [ ] T10: Integration tests for endpoints (L)
  - Dependencies: T5, T6, T7

### Phase 4: Documentation
- [ ] T11: API documentation (M)
- [ ] T12: Code documentation (S)
```

**Validation Checkpoint**:
- [ ] All requirements mapped to tasks
- [ ] API design is RESTful and consistent
- [ ] Data model supports all requirements
- [ ] Edge cases identified
- [ ] Implementation order is logical

### Solution

A good feature plan includes:
1. Clear task breakdown with dependencies
2. Comprehensive API specification
3. Well-designed data models
4. Validation rules defined upfront
5. Edge cases identified early

### Key Takeaways
- Planning prevents costly refactoring later
- API design should be reviewed before implementation
- Data model drives implementation architecture
- Break work into testable increments
- Identify edge cases during planning, not debugging

## Exercise 2: Test-Driven Implementation (40 minutes)

### Objective
Implement the feature using test-driven development with Claude's guidance.

### Instructions

**Step 1: Write Tests First**

Prompt:
```
I'm implementing the GET /api/v1/profile endpoint using TDD.

Help me write comprehensive tests BEFORE implementing the feature:

Requirements:
- Authenticated users can get their profile
- Unauthenticated requests return 401
- Response includes all profile fields
- Sensitive data (password hash) is excluded

Create:
1. Unit tests for the controller
2. Unit tests for the service
3. Integration test for the endpoint
4. Test fixtures and mocking strategy

Use Jest and supertest.
```

**Example Test Implementation**:

```javascript
// tests/integration/profile.test.js
const request = require('supertest');
const app = require('../../src/app');
const User = require('../../src/models/User');
const { generateToken } = require('../../src/utils/auth');

describe('GET /api/v1/profile', () => {
  let authToken;
  let testUser;
  
  beforeEach(async () => {
    // Clear database
    await User.deleteMany({});
    
    // Create test user
    testUser = await User.create({
      email: 'test@example.com',
      password: 'hashedpassword',
      name: 'Test User',
      bio: 'Test bio',
      avatarUrl: 'https://example.com/avatar.jpg'
    });
    
    // Generate auth token
    authToken = generateToken(testUser._id);
  });
  
  describe('when authenticated', () => {
    it('should return user profile with 200 status', async () => {
      const response = await request(app)
        .get('/api/v1/profile')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);
      
      expect(response.body).toMatchObject({
        id: testUser._id.toString(),
        email: 'test@example.com',
        name: 'Test User',
        bio: 'Test bio',
        avatarUrl: 'https://example.com/avatar.jpg'
      });
      
      expect(response.body.createdAt).toBeDefined();
      expect(response.body.updatedAt).toBeDefined();
    });
    
    it('should not include password hash in response', async () => {
      const response = await request(app)
        .get('/api/v1/profile')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);
      
      expect(response.body.password).toBeUndefined();
      expect(response.body.passwordHash).toBeUndefined();
    });
  });
  
  describe('when not authenticated', () => {
    it('should return 401 with no token', async () => {
      await request(app)
        .get('/api/v1/profile')
        .expect(401);
    });
    
    it('should return 401 with invalid token', async () => {
      await request(app)
        .get('/api/v1/profile')
        .set('Authorization', 'Bearer invalid-token')
        .expect(401);
    });
  });
});

// tests/unit/services/profileService.test.js
const ProfileService = require('../../../src/services/profileService');
const User = require('../../../src/models/User');

jest.mock('../../../src/models/User');

describe('ProfileService', () => {
  let profileService;
  
  beforeEach(() => {
    profileService = new ProfileService();
    jest.clearAllMocks();
  });
  
  describe('getProfile', () => {
    it('should return user profile without sensitive data', async () => {
      const mockUser = {
        _id: '123',
        email: 'test@example.com',
        name: 'Test User',
        password: 'shouldnotappear',
        toObject: jest.fn().mockReturnValue({
          _id: '123',
          email: 'test@example.com',
          name: 'Test User',
          password: 'shouldnotappear'
        })
      };
      
      User.findById = jest.fn().mockResolvedValue(mockUser);
      
      const result = await profileService.getProfile('123');
      
      expect(User.findById).toHaveBeenCalledWith('123');
      expect(result.password).toBeUndefined();
      expect(result.email).toBe('test@example.com');
    });
    
    it('should throw error if user not found', async () => {
      User.findById = jest.fn().mockResolvedValue(null);
      
      await expect(profileService.getProfile('nonexistent'))
        .rejects
        .toThrow('User not found');
    });
  });
});
```

**Step 2: Implement to Pass Tests**

Prompt:
```
Now implement the code to make these tests pass:

Tests: [paste the tests from Step 1]

Implement:
1. Route handler
2. Controller
3. Service layer
4. Any utilities needed

Follow these principles:
- Keep functions small and focused
- Handle errors properly
- Validate inputs
- Add appropriate logging
- Include JSDoc comments
- Follow DRY principle

Show the complete implementation.
```

**Example Implementation**:

```javascript
// src/routes/profile.js
const express = require('express');
const router = express.Router();
const profileController = require('../controllers/profileController');
const auth = require('../middleware/auth');

/**
 * @route   GET /api/v1/profile
 * @desc    Get current user's profile
 * @access  Private
 */
router.get('/', auth.required, profileController.getProfile);

/**
 * @route   PATCH /api/v1/profile
 * @desc    Update current user's profile
 * @access  Private
 */
router.patch('/', auth.required, profileController.updateProfile);

/**
 * @route   PUT /api/v1/profile/password
 * @desc    Change password
 * @access  Private
 */
router.put('/password', auth.required, profileController.changePassword);

module.exports = router;

// src/controllers/profileController.js
const profileService = require('../services/profileService');
const logger = require('../utils/logger');

class ProfileController {
  /**
   * Get current user's profile
   */
  async getProfile(req, res, next) {
    try {
      const profile = await profileService.getProfile(req.user.id);
      
      logger.info('Profile retrieved', { userId: req.user.id });
      
      res.json(profile);
    } catch (error) {
      logger.error('Error retrieving profile', { 
        userId: req.user.id, 
        error: error.message 
      });
      next(error);
    }
  }
  
  /**
   * Update current user's profile
   */
  async updateProfile(req, res, next) {
    try {
      const updates = req.body;
      const profile = await profileService.updateProfile(
        req.user.id,
        updates,
        req.ip
      );
      
      logger.info('Profile updated', { 
        userId: req.user.id,
        fields: Object.keys(updates)
      });
      
      res.json(profile);
    } catch (error) {
      logger.error('Error updating profile', {
        userId: req.user.id,
        error: error.message
      });
      next(error);
    }
  }
  
  /**
   * Change user password
   */
  async changePassword(req, res, next) {
    try {
      const { currentPassword, newPassword } = req.body;
      
      await profileService.changePassword(
        req.user.id,
        currentPassword,
        newPassword,
        req.ip
      );
      
      logger.info('Password changed', { userId: req.user.id });
      
      res.json({ message: 'Password changed successfully' });
    } catch (error) {
      logger.error('Error changing password', {
        userId: req.user.id,
        error: error.message
      });
      next(error);
    }
  }
}

module.exports = new ProfileController();

// src/services/profileService.js
const User = require('../models/User');
const AuditLog = require('../models/AuditLog');
const bcrypt = require('bcrypt');
const Joi = require('joi');

class ProfileService {
  constructor() {
    this.profileUpdateSchema = Joi.object({
      name: Joi.string().min(2).max(100),
      bio: Joi.string().max(500).allow(''),
      avatarUrl: Joi.string().uri().allow('')
    });
    
    this.passwordChangeSchema = Joi.object({
      currentPassword: Joi.string().required(),
      newPassword: Joi.string().min(12).required()
    });
  }
  
  /**
   * Get user profile by ID
   * @param {string} userId - User ID
   * @returns {Promise<Object>} User profile without sensitive data
   */
  async getProfile(userId) {
    const user = await User.findById(userId);
    
    if (!user) {
      throw new Error('User not found');
    }
    
    // Remove sensitive fields
    const profile = user.toObject();
    delete profile.password;
    delete profile.__v;
    
    return profile;
  }
  
  /**
   * Update user profile
   * @param {string} userId - User ID
   * @param {Object} updates - Profile updates
   * @param {string} ipAddress - IP address for audit
   * @returns {Promise<Object>} Updated profile
   */
  async updateProfile(userId, updates, ipAddress) {
    // Validate input
    const { error, value } = this.profileUpdateSchema.validate(updates);
    if (error) {
      throw new ValidationError(error.details[0].message);
    }
    
    // Update user
    const user = await User.findByIdAndUpdate(
      userId,
      { $set: value },
      { new: true, runValidators: true }
    );
    
    if (!user) {
      throw new Error('User not found');
    }
    
    // Create audit log
    await AuditLog.create({
      userId,
      action: 'profile_update',
      changes: value,
      ipAddress,
      timestamp: new Date()
    });
    
    // Return profile without sensitive data
    return this.getProfile(userId);
  }
  
  /**
   * Change user password
   * @param {string} userId - User ID
   * @param {string} currentPassword - Current password
   * @param {string} newPassword - New password
   * @param {string} ipAddress - IP address for audit
   */
  async changePassword(userId, currentPassword, newPassword, ipAddress) {
    // Validate input
    const { error } = this.passwordChangeSchema.validate({
      currentPassword,
      newPassword
    });
    if (error) {
      throw new ValidationError(error.details[0].message);
    }
    
    // Get user
    const user = await User.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }
    
    // Verify current password
    const isValidPassword = await bcrypt.compare(
      currentPassword,
      user.password
    );
    if (!isValidPassword) {
      throw new AuthenticationError('Current password is incorrect');
    }
    
    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 12);
    
    // Update password
    user.password = hashedPassword;
    await user.save();
    
    // Create audit log
    await AuditLog.create({
      userId,
      action: 'password_change',
      ipAddress,
      timestamp: new Date()
    });
  }
}

module.exports = new ProfileService();

// src/models/User.js
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  },
  password: {
    type: String,
    required: true,
    select: false // Don't include in queries by default
  },
  name: {
    type: String,
    required: true,
    trim: true,
    minlength: 2,
    maxlength: 100
  },
  bio: {
    type: String,
    maxlength: 500,
    default: ''
  },
  avatarUrl: {
    type: String,
    validate: {
      validator: function(v) {
        return !v || /^https?:\/\/.+/.test(v);
      },
      message: 'Invalid URL format'
    }
  }
}, {
  timestamps: true
});

// Indexes
userSchema.index({ email: 1 });

// Instance method to get public profile
userSchema.methods.toPublicJSON = function() {
  return {
    id: this._id,
    email: this.email,
    name: this.name,
    bio: this.bio,
    avatarUrl: this.avatarUrl,
    createdAt: this.createdAt,
    updatedAt: this.updatedAt
  };
};

module.exports = mongoose.model('User', userSchema);

// src/models/AuditLog.js
const mongoose = require('mongoose');

const auditLogSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  action: {
    type: String,
    required: true,
    enum: ['profile_update', 'password_change', 'email_change']
  },
  changes: {
    type: mongoose.Schema.Types.Mixed
  },
  ipAddress: {
    type: String,
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now,
    index: true
  }
});

// Compound index for user audit queries
auditLogSchema.index({ userId: 1, timestamp: -1 });

module.exports = mongoose.model('AuditLog', auditLogSchema);
```

**Step 3: Run Tests and Iterate**

```bash
npm test

# If tests fail, iterate with Claude:
# "These tests are failing: [paste failures]
#  Current implementation: [paste code]
#  Help me fix the issues."
```

**Validation Checkpoint**:
- [ ] All tests pass
- [ ] Code coverage >80%
- [ ] Edge cases handled
- [ ] Error messages are clear
- [ ] Code is well-documented

### Solution

TDD workflow:
1. Write failing tests first (red)
2. Implement minimal code to pass (green)
3. Refactor for quality (refactor)
4. Repeat for each feature

### Key Takeaways
- Tests define the contract before implementation
- TDD catches bugs early
- Tests serve as documentation
- Refactoring is safer with tests
- Each component is tested in isolation

## Exercise 3: Documentation and Code Review (20 minutes)

### Objective
Create comprehensive documentation and perform self-review with Claude.

### Instructions

**Step 1: Generate API Documentation**

Prompt:
```
Generate comprehensive API documentation for the Profile Management feature:

Endpoints implemented:
- GET /api/v1/profile
- PATCH /api/v1/profile
- PUT /api/v1/profile/password

Create documentation including:
1. Overview and purpose
2. Authentication requirements
3. For each endpoint:
   - Description
   - URL and method
   - Request format with examples
   - Response format with examples
   - Error responses with examples
   - curl examples
4. Common error codes and meanings
5. Rate limiting information
6. Versioning strategy

Format: Markdown suitable for README or wiki
```

**Step 2: Self Code Review**

Prompt:
```
Perform a thorough code review of my implementation:

[Paste all implementation code]

Review for:
1. Security vulnerabilities
2. Performance issues
3. Error handling completeness
4. Input validation gaps
5. Code organization and structure
6. Naming conventions
7. Documentation quality
8. Test coverage gaps
9. Edge cases not handled
10. SOLID principles violations

Provide:
- Issues found (categorized by severity)
- Specific recommendations
- Code examples for fixes
- Priority order for addressing issues
```

**Step 3: Create Inline Documentation**

Prompt:
```
Add comprehensive inline documentation to this code:

[Paste code]

Include:
- JSDoc comments for all functions
- Parameter descriptions with types
- Return value descriptions
- Throws documentation
- Usage examples
- Complex logic explanations
- TODO/FIXME where needed

Follow JSDoc 3 standard.
```

**Validation Checkpoint**:
- [ ] API documentation is complete and accurate
- [ ] All functions have JSDoc comments
- [ ] Code review issues addressed
- [ ] Examples are tested and working
- [ ] Documentation is up-to-date with code

### Solution

Good documentation includes:
1. API reference with examples
2. Inline code documentation
3. Architecture decisions
4. Usage examples
5. Common issues and solutions

### Key Takeaways
- Documentation written with code stays current
- Self-review catches issues before PR
- Examples make APIs easier to use
- JSDoc enables IDE intellisense
- Good docs reduce support burden

## Common Issues and Troubleshooting

### Issue 1: Tests Are Flaky

**Solution**:
- Isolate each test (proper setup/teardown)
- Avoid test interdependencies
- Mock time-dependent operations
- Clear database between tests

### Issue 2: Implementation Differs from Plan

**Solution**:
- Update plan as you learn
- Document why changes were made
- Communicate changes to team
- Update tests to match new design

### Issue 3: Feature Creep

**Solution**:
- Stick to original requirements
- Create backlog items for new ideas
- Complete MVP first
- Iterate based on feedback

## Extensions for Advanced Learners

### Extension 1: Add Feature Flags

Implement feature flags to:
- Enable/disable features dynamically
- Gradual rollout to users
- A/B testing capabilities
- Quick rollback if issues arise

### Extension 2: Implement Caching

Add caching layer:
- Redis cache for profile data
- Cache invalidation strategy
- Cache warming
- Performance comparison

### Extension 3: Add Real-time Updates

Implement WebSocket notifications:
- Notify user of profile changes
- Real-time audit log viewing
- Optimistic UI updates

## Summary

You've learned to:
- Plan features comprehensively
- Design APIs following best practices
- Implement features using TDD
- Write tests at all levels
- Create comprehensive documentation
- Perform thorough self-review
- Handle edge cases systematically

## Next Steps

1. Build a complete feature in your project
2. Practice TDD workflow
3. Create API documentation standards
4. Proceed to Lab 006: PR Review Workflow

---

**Lab Completion**: You've completed Lab 005. You can now develop features end-to-end with quality, tests, and documentation using Claude as your development partner.
