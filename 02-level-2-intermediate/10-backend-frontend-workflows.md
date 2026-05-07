# Backend-Frontend Workflows

## Coordinating Full-Stack Development with AI

---

## 🎯 Overview

Full-stack development requires coordinating backend APIs, frontend interfaces, shared types, and data flow. Claude can help orchestrate end-to-end feature development, ensuring consistency between layers, generating boilerplate, and catching integration issues early.

**Time to Master:** 4-5 hours  
**Outcome:** Efficiently develop full-stack features with AI assistance across all layers

---

## 💡 Full-Stack Development Challenges

### Common Pain Points

**Without AI:**
- Manual type synchronization between frontend and backend
- Repetitive CRUD boilerplate
- Integration bugs from API contract mismatches
- Context switching between languages and frameworks
- Documentation drift between layers

**With AI:**
- Generate matching types automatically
- Create complete CRUD flows end-to-end
- Validate API contracts before implementation
- Maintain consistency across stack
- Keep documentation synchronized

---

## 🔄 End-to-End Feature Development

### Pattern: Complete Feature Generation

```
Create a complete {feature} feature across the stack.

Stack:
- Backend: {framework} ({language})
- Frontend: {framework} ({language})
- Database: {database}

Feature requirements:
{User stories or acceptance criteria}

Generate:
1. Database schema/migration
2. Backend model and validation
3. API endpoints (REST/GraphQL)
4. Frontend types matching backend
5. API client/hooks
6. UI components
7. Tests for each layer

Ensure type safety end-to-end.
```

### Example: User Profile Management

**Request:**
```
Create a complete user profile editing feature.

Stack:
- Backend: Node.js + Express + TypeScript
- Frontend: React + TypeScript
- Database: PostgreSQL

Requirements:
- Users can view their profile
- Users can edit name, email, bio
- Email must be unique
- Validate email format
- Optimistic UI updates
- Error handling

Generate:
1. Database migration
2. User model with validation
3. GET /api/profile and PUT /api/profile endpoints
4. Frontend types matching backend
5. useProfile hook
6. ProfileView and ProfileEdit components
7. Unit tests for validation, integration tests for API
```

**Claude's Response:**

**1. Database Migration**
```sql
-- migrations/002_add_user_profile.sql
ALTER TABLE users ADD COLUMN IF NOT EXISTS bio TEXT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP;

CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
```

**2. Backend Model & Validation**
```typescript
// models/User.ts
import { z } from 'zod';

export const UserProfileSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1, 'Name is required').max(100),
  email: z.string().email('Invalid email format'),
  bio: z.string().max(500, 'Bio must be 500 characters or less').optional(),
  createdAt: z.date(),
  updatedAt: z.date()
});

export type UserProfile = z.infer<typeof UserProfileSchema>;

export const UpdateUserProfileSchema = UserProfileSchema.pick({
  name: true,
  email: true,
  bio: true
}).partial();

export type UpdateUserProfile = z.infer<typeof UpdateUserProfileSchema>;
```

**3. API Endpoints**
```typescript
// routes/profile.ts
import express, { Request, Response } from 'express';
import { UserProfileSchema, UpdateUserProfileSchema } from '../models/User';
import { authenticate } from '../middleware/auth';
import { db } from '../db';

const router = express.Router();

/**
 * GET /api/profile
 * Get current user's profile
 */
router.get('/api/profile', authenticate, async (req: Request, res: Response) => {
  try {
    const userId = req.user!.id;
    
    const user = await db.query(
      'SELECT id, name, email, bio, created_at, updated_at FROM users WHERE id = $1',
      [userId]
    );

    if (!user.rows[0]) {
      return res.status(404).json({ error: 'User not found' });
    }

    const profile = UserProfileSchema.parse({
      id: user.rows[0].id,
      name: user.rows[0].name,
      email: user.rows[0].email,
      bio: user.rows[0].bio,
      createdAt: user.rows[0].created_at,
      updatedAt: user.rows[0].updated_at
    });

    res.json(profile);
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ error: 'Failed to fetch profile' });
  }
});

/**
 * PUT /api/profile
 * Update current user's profile
 */
router.put('/api/profile', authenticate, async (req: Request, res: Response) => {
  try {
    const userId = req.user!.id;
    
    // Validate input
    const updates = UpdateUserProfileSchema.parse(req.body);

    // Check email uniqueness if email is being updated
    if (updates.email) {
      const existing = await db.query(
        'SELECT id FROM users WHERE email = $1 AND id != $2',
        [updates.email, userId]
      );
      
      if (existing.rows.length > 0) {
        return res.status(409).json({ error: 'Email already in use' });
      }
    }

    // Build update query dynamically
    const fields: string[] = [];
    const values: any[] = [];
    let paramCount = 1;

    if (updates.name !== undefined) {
      fields.push(`name = $${paramCount++}`);
      values.push(updates.name);
    }
    if (updates.email !== undefined) {
      fields.push(`email = $${paramCount++}`);
      values.push(updates.email);
    }
    if (updates.bio !== undefined) {
      fields.push(`bio = $${paramCount++}`);
      values.push(updates.bio);
    }
    
    fields.push(`updated_at = CURRENT_TIMESTAMP`);
    values.push(userId);

    const result = await db.query(
      `UPDATE users SET ${fields.join(', ')} 
       WHERE id = $${paramCount} 
       RETURNING id, name, email, bio, created_at, updated_at`,
      values
    );

    const profile = UserProfileSchema.parse({
      id: result.rows[0].id,
      name: result.rows[0].name,
      email: result.rows[0].email,
      bio: result.rows[0].bio,
      createdAt: result.rows[0].created_at,
      updatedAt: result.rows[0].updated_at
    });

    res.json(profile);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ 
        error: 'Validation failed', 
        details: error.errors 
      });
    }
    
    console.error('Update profile error:', error);
    res.status(500).json({ error: 'Failed to update profile' });
  }
});

export default router;
```

**4. Frontend Types**
```typescript
// types/user.ts
// These match the backend Zod schemas exactly

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  bio?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface UpdateUserProfile {
  name?: string;
  email?: string;
  bio?: string;
}

export interface ApiError {
  error: string;
  details?: Array<{ message: string; path: string[] }>;
}
```

**5. API Client Hook**
```typescript
// hooks/useProfile.ts
import { useState, useEffect } from 'react';
import { UserProfile, UpdateUserProfile, ApiError } from '../types/user';

interface UseProfileResult {
  profile: UserProfile | null;
  loading: boolean;
  error: string | null;
  updateProfile: (updates: UpdateUserProfile) => Promise<void>;
  refresh: () => Promise<void>;
}

export function useProfile(): UseProfileResult {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch('/api/profile', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!response.ok) {
        const error: ApiError = await response.json();
        throw new Error(error.error);
      }

      const data: UserProfile = await response.json();
      // Convert date strings to Date objects
      data.createdAt = new Date(data.createdAt);
      data.updatedAt = new Date(data.updatedAt);
      
      setProfile(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (updates: UpdateUserProfile) => {
    try {
      setError(null);

      // Optimistic update
      if (profile) {
        setProfile({ ...profile, ...updates });
      }

      const response = await fetch('/api/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(updates)
      });

      if (!response.ok) {
        const error: ApiError = await response.json();
        
        // Revert optimistic update on error
        await fetchProfile();
        
        throw new Error(error.error);
      }

      const data: UserProfile = await response.json();
      data.createdAt = new Date(data.createdAt);
      data.updatedAt = new Date(data.updatedAt);
      
      setProfile(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update profile');
      throw err;
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  return {
    profile,
    loading,
    error,
    updateProfile,
    refresh: fetchProfile
  };
}
```

**6. UI Components**
```typescript
// components/ProfileView.tsx
import React from 'react';
import { UserProfile } from '../types/user';

interface ProfileViewProps {
  profile: UserProfile;
  onEdit: () => void;
}

export function ProfileView({ profile, onEdit }: ProfileViewProps) {
  return (
    <div className="profile-view">
      <div className="profile-header">
        <h2>Profile</h2>
        <button onClick={onEdit}>Edit Profile</button>
      </div>
      
      <div className="profile-fields">
        <div className="field">
          <label>Name</label>
          <p>{profile.name}</p>
        </div>
        
        <div className="field">
          <label>Email</label>
          <p>{profile.email}</p>
        </div>
        
        {profile.bio && (
          <div className="field">
            <label>Bio</label>
            <p>{profile.bio}</p>
          </div>
        )}
        
        <div className="field">
          <label>Member Since</label>
          <p>{profile.createdAt.toLocaleDateString()}</p>
        </div>
      </div>
    </div>
  );
}
```

```typescript
// components/ProfileEdit.tsx
import React, { useState } from 'react';
import { UserProfile, UpdateUserProfile } from '../types/user';

interface ProfileEditProps {
  profile: UserProfile;
  onSave: (updates: UpdateUserProfile) => Promise<void>;
  onCancel: () => void;
  error?: string | null;
}

export function ProfileEdit({ profile, onSave, onCancel, error }: ProfileEditProps) {
  const [formData, setFormData] = useState({
    name: profile.name,
    email: profile.email,
    bio: profile.bio || ''
  });
  const [saving, setSaving] = useState(false);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  const validate = (): boolean => {
    const errors: Record<string, string> = {};

    if (!formData.name.trim()) {
      errors.name = 'Name is required';
    } else if (formData.name.length > 100) {
      errors.name = 'Name must be 100 characters or less';
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      errors.email = 'Invalid email format';
    }

    if (formData.bio.length > 500) {
      errors.bio = 'Bio must be 500 characters or less';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    try {
      setSaving(true);
      await onSave(formData);
    } catch (err) {
      // Error handled by parent
    } finally {
      setSaving(false);
    }
  };

  return (
    <form className="profile-edit" onSubmit={handleSubmit}>
      <div className="profile-header">
        <h2>Edit Profile</h2>
      </div>

      {error && (
        <div className="error-message">{error}</div>
      )}

      <div className="field">
        <label htmlFor="name">Name *</label>
        <input
          id="name"
          type="text"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          maxLength={100}
        />
        {validationErrors.name && (
          <span className="field-error">{validationErrors.name}</span>
        )}
      </div>

      <div className="field">
        <label htmlFor="email">Email *</label>
        <input
          id="email"
          type="email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
        />
        {validationErrors.email && (
          <span className="field-error">{validationErrors.email}</span>
        )}
      </div>

      <div className="field">
        <label htmlFor="bio">Bio</label>
        <textarea
          id="bio"
          value={formData.bio}
          onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
          maxLength={500}
          rows={4}
        />
        <span className="char-count">{formData.bio.length}/500</span>
        {validationErrors.bio && (
          <span className="field-error">{validationErrors.bio}</span>
        )}
      </div>

      <div className="actions">
        <button type="button" onClick={onCancel} disabled={saving}>
          Cancel
        </button>
        <button type="submit" disabled={saving}>
          {saving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>
    </form>
  );
}
```

```typescript
// components/ProfilePage.tsx
import React, { useState } from 'react';
import { useProfile } from '../hooks/useProfile';
import { ProfileView } from './ProfileView';
import { ProfileEdit } from './ProfileEdit';

export function ProfilePage() {
  const { profile, loading, error, updateProfile } = useProfile();
  const [isEditing, setIsEditing] = useState(false);

  if (loading) {
    return <div className="loading">Loading profile...</div>;
  }

  if (error && !profile) {
    return <div className="error">Error: {error}</div>;
  }

  if (!profile) {
    return <div className="error">Profile not found</div>;
  }

  const handleSave = async (updates: UpdateUserProfile) => {
    await updateProfile(updates);
    setIsEditing(false);
  };

  return (
    <div className="profile-page">
      {isEditing ? (
        <ProfileEdit
          profile={profile}
          onSave={handleSave}
          onCancel={() => setIsEditing(false)}
          error={error}
        />
      ) : (
        <ProfileView
          profile={profile}
          onEdit={() => setIsEditing(true)}
        />
      )}
    </div>
  );
}
```

**7. Tests**
```typescript
// Backend tests
describe('Profile API', () => {
  it('should get user profile', async () => {
    const response = await request(app)
      .get('/api/profile')
      .set('Authorization', `Bearer ${validToken}`);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('id');
    expect(response.body).toHaveProperty('name');
    expect(response.body).toHaveProperty('email');
  });

  it('should update user profile', async () => {
    const updates = { name: 'New Name', bio: 'New bio' };
    
    const response = await request(app)
      .put('/api/profile')
      .set('Authorization', `Bearer ${validToken}`)
      .send(updates);

    expect(response.status).toBe(200);
    expect(response.body.name).toBe('New Name');
    expect(response.body.bio).toBe('New bio');
  });

  it('should reject duplicate email', async () => {
    const response = await request(app)
      .put('/api/profile')
      .set('Authorization', `Bearer ${validToken}`)
      .send({ email: 'existing@example.com' });

    expect(response.status).toBe(409);
    expect(response.body.error).toContain('already in use');
  });

  it('should validate email format', async () => {
    const response = await request(app)
      .put('/api/profile')
      .set('Authorization', `Bearer ${validToken}`)
      .send({ email: 'invalid-email' });

    expect(response.status).toBe(400);
  });
});

// Frontend tests
describe('useProfile hook', () => {
  it('should load profile on mount', async () => {
    const { result, waitForNextUpdate } = renderHook(() => useProfile());

    expect(result.current.loading).toBe(true);
    
    await waitForNextUpdate();

    expect(result.current.loading).toBe(false);
    expect(result.current.profile).toBeDefined();
  });

  it('should update profile optimistically', async () => {
    const { result, waitForNextUpdate } = renderHook(() => useProfile());
    
    await waitForNextUpdate(); // Wait for initial load

    const updates = { name: 'New Name' };
    act(() => {
      result.current.updateProfile(updates);
    });

    // Profile updated immediately (optimistic)
    expect(result.current.profile?.name).toBe('New Name');
  });
});
```

---

## 🔄 Type Synchronization Patterns

### Pattern 1: Generate Types from Backend

**Request:**
```
I have this backend User model with Zod schema:

{paste backend schema}

Generate matching TypeScript interfaces for the frontend.
Include conversion utilities for Date fields.
```

### Pattern 2: Generate Backend from Frontend

**Request:**
```
I have these frontend TypeScript interfaces:

{paste frontend types}

Generate matching Zod schemas for backend validation.
Ensure all validation rules are covered.
```

### Pattern 3: Shared Type Definition

**For Monorepos:**
```
Create a shared types package that both frontend and backend can import.

Structure:
shared/
  types/
    user.ts
    product.ts
  validators/
    user.ts (Zod schemas)

Frontend uses types directly.
Backend uses types + validators.
```

---

## 🔧 Common Full-Stack Workflows

### Workflow 1: Add New Field

**Request:**
```
Add a "phone_number" field to user profile.

Update:
1. Database migration
2. Backend model/validation
3. API types
4. Frontend types
5. UI form
6. Tests

Validation: Optional, E.164 format
```

### Workflow 2: New Resource CRUD

**Request:**
```
Create complete CRUD for "Projects" resource.

Schema:
- id (uuid)
- name (string, required)
- description (text, optional)
- owner_id (uuid, FK to users)
- created_at, updated_at

Generate:
- Database schema
- Backend models
- REST API (all CRUD endpoints)
- Frontend types
- React hooks (useProjects, useProject)
- List, detail, create, edit components
```

### Workflow 3: Add Filtering/Pagination

**Request:**
```
Add filtering and pagination to GET /api/products endpoint.

Filters:
- category (string)
- min_price, max_price (number)
- in_stock (boolean)

Pagination:
- page, pageSize
- Return total count

Update frontend useProducts hook to support these params.
```

---

## 🎯 GraphQL Full-Stack

### Pattern: GraphQL End-to-End

**Request:**
```
Create GraphQL API and frontend client for blog posts.

Schema:
- Post (id, title, content, authorId, createdAt)
- Author (id, name, email)

Queries:
- posts (list with pagination)
- post (by ID)

Mutations:
- createPost
- updatePost
- deletePost

Generate:
1. GraphQL schema definition
2. Resolvers (Node.js)
3. Frontend GraphQL client setup (Apollo)
4. TypeScript types from schema
5. React hooks using generated types
6. Components with GraphQL queries
```

**Output Structure:**
```
backend/
  schema.graphql
  resolvers/
    post.ts
    author.ts
  
frontend/
  graphql/
    queries.ts
    mutations.ts
  generated/
    types.ts (from schema)
  hooks/
    usePosts.ts
  components/
    PostList.tsx
    PostDetail.tsx
```

---

## ✅ Best Practices

### Type Safety
✅ Share types between frontend and backend  
✅ Use code generation for GraphQL types  
✅ Validate at boundaries (API layer)  
✅ Use branded types for IDs  
✅ Avoid `any` types  

### API Design
✅ Consistent error response format  
✅ Proper HTTP status codes  
✅ API versioning strategy  
✅ Request/response validation  
✅ Rate limiting and security  

### Frontend-Backend Contract
✅ Document API contracts (OpenAPI/GraphQL schema)  
✅ Generate clients from contracts  
✅ Contract testing  
✅ Version compatibility checks  
✅ Mock servers for frontend development  

### Development Workflow
✅ Backend API-first or frontend mock-first  
✅ Shared type definitions in monorepos  
✅ Integration tests at API boundary  
✅ E2E tests for critical flows  
✅ Automated type sync validation  

---

## 🚀 Advanced Patterns

### Pattern: tRPC End-to-End Type Safety

**Request:**
```
Set up tRPC for end-to-end type safety.

Backend:
- Node.js + Express
- Prisma ORM

Frontend:
- React + TypeScript
- React Query

Create example "user" router with:
- getUsers query
- getUser query
- createUser mutation

Show full type safety from DB to UI.
```

### Pattern: Real-Time Updates

**Request:**
```
Add WebSocket support for real-time profile updates.

When any user updates their profile:
- Broadcast change to all connected clients
- Update local state automatically

Backend: Socket.IO
Frontend: React hook for socket connection
```

### Pattern: Offline-First

**Request:**
```
Implement offline-first profile editing.

Features:
- Queue mutations when offline
- Sync when back online
- Conflict resolution
- Optimistic updates

Use: IndexedDB + sync queue
```

---

## 🎓 Practice Exercise

Create a complete todo list feature end-to-end:

**Requirements:**
- Backend: Node.js + PostgreSQL
- Frontend: React + TypeScript
- Features: CRUD, mark complete, filter by status
- Real-time updates when todos change
- Optimistic UI updates
- Full type safety

Generate all layers from database to UI components.

---

**Next:** [Claude Code Usage →](./11-claude-code-usage.md)
