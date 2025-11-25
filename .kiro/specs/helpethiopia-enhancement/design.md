# Design Document

## Overview

The HelpEthiopia platform enhancement will transform the existing static prototype into a fully functional donation matching system using vanilla HTML, CSS, and JavaScript. The design focuses on client-side data management using browser storage APIs, modular JavaScript architecture, and progressive enhancement principles. The system will support user authentication, real-time filtering, interactive mapping, and intelligent item matching while maintaining simplicity and avoiding external frameworks.

## Architecture

### High-Level Architecture

The application follows a client-side MVC-inspired architecture:

```
┌─────────────────────────────────────────────────────────────┐
│                        Browser Layer                         │
├─────────────────────────────────────────────────────────────┤
│  HTML Pages (Views)                                          │
│  ├── index.html (Home)                                       │
│  ├── items.html (Browse)                                     │
│  ├── item-detail.html (Detail View)                          │
│  ├── donate.html / request.html (Forms)                      │
│  ├── dashboard.html (User Dashboard)                         │
│  ├── map.html (Map View)                                     │
│  ├── profile.html (User Profile)                             │
│  ├── messages.html (Messaging)                               │
│  └── login.html / signup.html (Auth)                         │
├─────────────────────────────────────────────────────────────┤
│  JavaScript Modules (Controllers & Services)                 │
│  ├── js/storage.js (Data Layer)                              │
│  ├── js/auth.js (Authentication)                             │
│  ├── js/validation.js (Form Validation)                      │
│  ├── js/items.js (Item Management)                           │
│  ├── js/matching.js (Matching Algorithm)                     │
│  ├── js/map.js (Map Integration)                             │
│  ├── js/messaging.js (Messaging System)                      │
│  ├── js/notifications.js (Notifications)                     │
│  └── js/utils.js (Utilities)                                 │
├─────────────────────────────────────────────────────────────┤
│  CSS Stylesheets                                             │
│  ├── css/style.css (Main Styles)                             │
│  ├── css/forms.css (Form Styles)                             │
│  ├── css/components.css (Reusable Components)                │
│  └── css/responsive.css (Mobile Styles)                      │
├─────────────────────────────────────────────────────────────┤
│  Browser Storage (Data Persistence)                          │
│  ├── localStorage (Users, Items, Messages, Notifications)    │
│  └── sessionStorage (Current Session, Auth Token)            │
└─────────────────────────────────────────────────────────────┘
```

### Data Flow

1. **User Interaction** → HTML page captures event
2. **Event Handler** → JavaScript module processes action
3. **Data Layer** → Storage module reads/writes to localStorage
4. **View Update** → DOM manipulation reflects changes
5. **State Sync** → Session state maintained in sessionStorage

## Components and Interfaces

### 1. Storage Module (`js/storage.js`)

Centralized data management layer for all localStorage operations.

**Interface:**
```javascript
// Core CRUD operations
StorageManager.save(key, data)
StorageManager.get(key)
StorageManager.update(key, id, updatedData)
StorageManager.delete(key, id)
StorageManager.getAll(key)

// Specialized methods
StorageManager.getUserItems(userId)
StorageManager.getItemsByStatus(status)
StorageManager.searchItems(query, filters)
```

**Storage Keys:**
- `helpethiopia_users` - Array of user objects
- `helpethiopia_items` - Array of donation/request objects
- `helpethiopia_messages` - Array of message objects
- `helpethiopia_notifications` - Array of notification objects

### 2. Authentication Module (`js/auth.js`)

Handles user registration, login, logout, and session management.

**Interface:**
```javascript
Auth.signup(userData)
Auth.login(email, password)
Auth.logout()
Auth.getCurrentUser()
Auth.isAuthenticated()
Auth.requireAuth(redirectUrl)
Auth.updateUserProfile(userId, updates)
```

**Session Data (sessionStorage):**
```javascript
{
  userId: "uuid",
  email: "user@example.com",
  name: "User Name",
  role: "donor|recipient|admin",
  loginTime: timestamp
}
```

### 3. Validation Module (`js/validation.js`)

Client-side form validation with real-time feedback.

**Interface:**
```javascript
Validator.validateEmail(email)
Validator.validatePassword(password)
Validator.validateRequired(value)
Validator.validateForm(formElement)
Validator.showError(fieldElement, message)
Validator.clearError(fieldElement)
```

**Validation Rules:**
- Email: RFC 5322 compliant regex
- Password: Minimum 6 characters
- Required fields: Non-empty after trim
- Phone: Ethiopian format (+251...)

### 4. Items Module (`js/items.js`)

Manages donation and request CRUD operations.

**Interface:**
```javascript
Items.create(itemData)
Items.getById(itemId)
Items.update(itemId, updates)
Items.delete(itemId)
Items.getAll(filters)
Items.getUserItems(userId)
Items.updateStatus(itemId, newStatus)
```

**Item Object Structure:**
```javascript
{
  id: "uuid",
  type: "Donation|Request",
  userId: "uuid",
  name: "string",
  category: "Food|Clothes|Books|Hygiene|Electronics",
  description: "string",
  location: "string",
  coordinates: {lat: number, lng: number},
  urgency: "Low|Medium|High|Critical",
  status: "Pending|Active|Matched|Completed|Rejected",
  images: ["base64string"],
  condition: "string",
  quantity: number,
  createdAt: timestamp,
  updatedAt: timestamp
}
```

### 5. Matching Algorithm Module (`js/matching.js`)

Intelligent pairing of donations with requests.

**Interface:**
```javascript
Matcher.findMatches(requestId)
Matcher.calculateMatchScore(donation, request)
Matcher.getSuggestedDonations(userId)
Matcher.getSuggestedRequests(userId)
```

**Matching Criteria:**
1. Category match (weight: 40%)
2. Location proximity (weight: 30%)
3. Urgency level (weight: 20%)
4. Availability status (weight: 10%)

**Score Calculation:**
```javascript
score = (categoryMatch * 0.4) + 
        (proximityScore * 0.3) + 
        (urgencyScore * 0.2) + 
        (availabilityScore * 0.1)
```

### 6. Map Module (`js/map.js`)

Interactive map using Leaflet.js library.

**Interface:**
```javascript
MapView.initialize(containerId)
MapView.addMarker(item)
MapView.removeMarker(itemId)
MapView.updateMarkers(items)
MapView.centerOn(coordinates)
MapView.filterMarkers(category)
```

**Marker Types:**
- Green markers: Donations
- Red markers: Requests
- Yellow markers: Matched items

### 7. Messaging Module (`js/messaging.js`)

User-to-user communication system.

**Interface:**
```javascript
Messaging.sendMessage(fromUserId, toUserId, itemId, content)
Messaging.getConversation(userId1, userId2, itemId)
Messaging.getUserConversations(userId)
Messaging.markAsRead(messageId)
Messaging.getUnreadCount(userId)
```

**Message Object:**
```javascript
{
  id: "uuid",
  fromUserId: "uuid",
  toUserId: "uuid",
  itemId: "uuid",
  content: "string",
  timestamp: number,
  read: boolean
}
```

### 8. Notifications Module (`js/notifications.js`)

Event-based notification system.

**Interface:**
```javascript
Notifications.create(userId, type, message, relatedId)
Notifications.getUserNotifications(userId)
Notifications.markAsRead(notificationId)
Notifications.getUnreadCount(userId)
Notifications.clear(notificationId)
```

**Notification Types:**
- `item_approved` - Item approved by admin
- `item_rejected` - Item rejected by admin
- `new_match` - New matching item found
- `new_message` - New message received
- `item_interest` - Someone interested in your item

### 9. Utilities Module (`js/utils.js`)

Helper functions used across the application.

**Interface:**
```javascript
Utils.generateUUID()
Utils.formatDate(timestamp)
Utils.calculateDistance(coord1, coord2)
Utils.debounce(func, delay)
Utils.sanitizeHTML(string)
Utils.imageToBase64(file)
Utils.base64ToImage(base64)
```

## Data Models

### User Model
```javascript
{
  id: "uuid",
  name: "string",
  email: "string",
  password: "hashed_string", // Simple hash for demo
  role: "donor|recipient|admin",
  phone: "string",
  location: "string",
  coordinates: {lat: number, lng: number},
  createdAt: timestamp,
  stats: {
    itemsPosted: number,
    itemsCompleted: number,
    rating: number
  }
}
```

### Item Model
```javascript
{
  id: "uuid",
  type: "Donation|Request",
  userId: "uuid",
  userName: "string",
  name: "string",
  category: "Food|Clothes|Books|Hygiene|Electronics",
  description: "string",
  location: "string",
  coordinates: {lat: number, lng: number},
  urgency: "Low|Medium|High|Critical",
  status: "Pending|Active|Matched|Completed|Rejected",
  images: ["base64string"],
  condition: "string",
  quantity: number,
  deliveryOption: "string",
  createdAt: timestamp,
  updatedAt: timestamp,
  matchedWith: "uuid|null"
}
```

### Message Model
```javascript
{
  id: "uuid",
  conversationId: "uuid", // Unique per user pair + item
  fromUserId: "uuid",
  fromUserName: "string",
  toUserId: "uuid",
  toUserName: "string",
  itemId: "uuid",
  itemName: "string",
  content: "string",
  timestamp: number,
  read: boolean
}
```

### Notification Model
```javascript
{
  id: "uuid",
  userId: "uuid",
  type: "string",
  message: "string",
  relatedId: "uuid|null",
  timestamp: number,
  read: boolean
}
```

## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system—essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*


### Property 1: Badge class matches item type
*For any* item displayed on the platform, the badge CSS class should correspond to the item's type (donation or request).
**Validates: Requirements 1.4**

### Property 2: Donation data round-trip consistency
*For any* valid donation data, saving it to localStorage and then retrieving it should return equivalent data.
**Validates: Requirements 2.1**

### Property 3: Request data round-trip consistency
*For any* valid request data, saving it to localStorage and then retrieving it should return equivalent data.
**Validates: Requirements 2.2**

### Property 4: Items persistence after page refresh
*For any* set of items saved to localStorage, loading them after a page refresh should return the same complete set.
**Validates: Requirements 2.3**

### Property 5: Unique item identifiers
*For any* two items created in the system, their assigned identifiers should be different.
**Validates: Requirements 2.4**

### Property 6: Graceful handling of corrupted storage data
*For any* corrupted or malformed data in localStorage, the platform should handle it without crashing and return a safe default state.
**Validates: Requirements 2.5**

### Property 7: User account creation round-trip
*For any* valid user registration data, creating an account and then retrieving it should return equivalent user data.
**Validates: Requirements 3.1**

### Property 8: Successful authentication creates session
*For any* registered user with correct credentials, logging in should create a valid session in sessionStorage.
**Validates: Requirements 3.2**

### Property 9: Authenticated user display in navigation
*For any* authenticated user session, the navigation bar should display the user's name and role.
**Validates: Requirements 3.3**

### Property 10: Unauthenticated access protection
*For any* unauthenticated user attempting to access protected actions (posting items), the platform should redirect to the login page.
**Validates: Requirements 3.4**

### Property 11: Logout clears session
*For any* authenticated user, clicking logout should clear all session data from sessionStorage.
**Validates: Requirements 3.5**

### Property 12: Empty required fields show errors
*For any* form with required fields, submitting with empty values should display error messages for those fields.
**Validates: Requirements 4.1**

### Property 13: Invalid email format validation
*For any* string that doesn't match valid email format, the email validation should fail and display an error.
**Validates: Requirements 4.2**

### Property 14: Password length validation
*For any* password string with length less than 6 characters, the password validation should fail and display an error.
**Validates: Requirements 4.3**

### Property 15: Error clearing on field correction
*For any* form field with a validation error, correcting the value to be valid should remove the error message.
**Validates: Requirements 4.4**

### Property 16: Submit button enabled when form valid
*For any* form where all fields pass validation, the submit button should be enabled.
**Validates: Requirements 4.5**

### Property 17: Map displays markers for all items
*For any* set of items with valid coordinates, the map should display exactly one marker for each item.
**Validates: Requirements 5.2**

### Property 18: Donation marker click shows details
*For any* donation marker on the map, clicking it should display a popup containing the donation's details.
**Validates: Requirements 5.3**

### Property 19: Request marker click shows details
*For any* request marker on the map, clicking it should display a popup containing the request's details.
**Validates: Requirements 5.4**

### Property 20: Category filter updates map markers
*For any* category filter selection, the map should display only markers for items in that category.
**Validates: Requirements 5.5**

### Property 21: Donor dashboard shows only their donations
*For any* donor user, their dashboard should display exactly the donations they posted and no others.
**Validates: Requirements 6.1**

### Property 22: Recipient dashboard shows only their requests
*For any* recipient user, their dashboard should display exactly the requests they posted and no others.
**Validates: Requirements 6.2**

### Property 23: Admin dashboard shows all pending items
*For any* admin user, their dashboard should display all items with status "Pending".
**Validates: Requirements 6.3**

### Property 24: Dashboard statistics accuracy
*For any* user, the dashboard statistics should accurately count their items by status (total, active, completed).
**Validates: Requirements 6.4**

### Property 25: Dashboard item click navigates to detail
*For any* item displayed in a dashboard, clicking it should navigate to that item's detail page.
**Validates: Requirements 6.5**

### Property 26: View details button navigation
*For any* item card, clicking the "View Details" button should navigate to the item's detail page.
**Validates: Requirements 6.7**

### Property 27: Item detail page completeness
*For any* item, its detail page should display all item properties including name, category, description, location, and images.
**Validates: Requirements 7.2**

### Property 28: Donor sees help button on requests
*For any* donor user viewing any request detail page, an "I Can Help" button should be displayed.
**Validates: Requirements 7.3**

### Property 29: Recipient sees request button on donations
*For any* recipient user viewing any donation detail page, a "Request This Item" button should be displayed.
**Validates: Requirements 7.4**

### Property 30: Contact info respects privacy settings
*For any* item detail page, the displayed contact information should match the poster's privacy settings.
**Validates: Requirements 7.5**

### Property 31: Suggested donations displayed for recipients
*For any* recipient user with active requests, their dashboard should display suggested matching donations.
**Validates: Requirements 8.1**

### Property 32: Category match prioritization
*For any* request, donations in the same category should have higher match scores than donations in different categories.
**Validates: Requirements 8.2**

### Property 33: Geographic proximity scoring
*For any* request, donations geographically closer should have higher proximity scores than donations farther away.
**Validates: Requirements 8.3**

### Property 34: Match ranking by relevance score
*For any* set of donations matching a request, they should be ordered by descending relevance score.
**Validates: Requirements 8.4**

### Property 35: Match display includes percentage and reason
*For any* suggested match displayed to a user, it should include both the match percentage and the reason for the suggestion.
**Validates: Requirements 8.5**

### Property 36: Image selection creates preview
*For any* valid image file selected by a user, a preview should be displayed immediately.
**Validates: Requirements 9.1**

### Property 37: Multiple image previews displayed
*For any* set of images uploaded, all images should have previews displayed in the gallery.
**Validates: Requirements 9.2**

### Property 38: Image removal from queue
*For any* image in the upload queue, removing it should decrease the queue size by exactly one.
**Validates: Requirements 9.3**

### Property 39: Image base64 conversion round-trip
*For any* image converted to base64 and stored, retrieving and converting back should preserve the image data.
**Validates: Requirements 9.4**

### Property 40: Base64 images render correctly
*For any* item with base64-encoded images, the images should render as valid displayable images.
**Validates: Requirements 9.5**

### Property 41: Contact button opens messaging
*For any* item detail page, clicking the "Contact" button should open the messaging interface.
**Validates: Requirements 10.1**

### Property 42: Message persistence with metadata
*For any* message sent, it should be saved to localStorage with sender, recipient, and timestamp, and be retrievable.
**Validates: Requirements 10.2**

### Property 43: Messages grouped by item
*For any* user's messages page, conversations should be correctly grouped by the associated item.
**Validates: Requirements 10.3**

### Property 44: Unread message badge display
*For any* user with unread messages, a notification badge should be displayed on the messages icon.
**Validates: Requirements 10.4**

### Property 45: Conversation chronological ordering
*For any* conversation viewed, messages should be displayed in chronological order (ascending by timestamp).
**Validates: Requirements 10.5**

### Property 46: Real-time search filtering
*For any* search query entered, only items containing that text in their name or description should be displayed.
**Validates: Requirements 11.1**

### Property 47: Multiple category filter (OR logic)
*For any* set of selected categories, displayed items should belong to at least one of the selected categories.
**Validates: Requirements 11.2**

### Property 48: Location filter accuracy
*For any* location filter applied, only items in that specified location should be displayed.
**Validates: Requirements 11.3**

### Property 49: Urgency filter accuracy
*For any* urgency level filter applied, only requests with that urgency level should be displayed.
**Validates: Requirements 11.4**

### Property 50: Multiple filters combined (AND logic)
*For any* combination of filters applied, displayed items should satisfy all filter criteria simultaneously.
**Validates: Requirements 11.5**

### Property 51: New items start as pending
*For any* newly created donation or request, its status should be set to "Pending" and it should not appear in public listings.
**Validates: Requirements 12.1**

### Property 52: Admin dashboard shows all pending
*For any* admin user, their dashboard should display exactly all items with status "Pending".
**Validates: Requirements 12.2**

### Property 53: Item approval changes status
*For any* pending item, when an admin approves it, the status should change to "Active".
**Validates: Requirements 12.3**

### Property 54: Item rejection creates notification
*For any* pending item, when an admin rejects it, the status should change to "Rejected" and a notification should be created for the poster.
**Validates: Requirements 12.4**

### Property 55: Admin review buttons present
*For any* pending item in the admin review queue, both approve and reject buttons should be displayed.
**Validates: Requirements 12.5**

### Property 56: Interest creates donor notification
*For any* interest event on a donor's item, a notification should be created for that donor.
**Validates: Requirements 13.1**

### Property 57: Match creates recipient notification
*For any* match event between a request and donation, a notification should be created for the recipient.
**Validates: Requirements 13.2**

### Property 58: New message creates notification
*For any* new message sent, a notification should be created for the recipient user.
**Validates: Requirements 13.3**

### Property 59: Unread notification count accuracy
*For any* user with unread notifications, the count displayed in the navigation should match the actual number of unread notifications.
**Validates: Requirements 13.4**

### Property 60: Notification click marks as read
*For any* notification, clicking it should change its read status to true.
**Validates: Requirements 13.5**

### Property 61: Profile page displays user data
*For any* user, their profile page should display all their stored profile information.
**Validates: Requirements 14.1**

### Property 62: Profile update validation
*For any* profile update with invalid data, the validation should fail and prevent saving.
**Validates: Requirements 14.2**

### Property 63: Profile update round-trip
*For any* valid profile update, saving the changes and then retrieving the profile should return the updated data.
**Validates: Requirements 14.3**

### Property 64: Password change requires verification
*For any* password change attempt, it should fail if the current password provided is incorrect.
**Validates: Requirements 14.4**

### Property 65: Profile statistics accuracy
*For any* user, the activity statistics on their profile should accurately count items posted and exchanges completed.
**Validates: Requirements 14.5**

## Error Handling

### Storage Errors
- **Quota Exceeded**: When localStorage is full, display user-friendly message and suggest clearing old data
- **Parse Errors**: When JSON parsing fails, log error and return empty array/object
- **Missing Keys**: When expected data is missing, initialize with default values

### Validation Errors
- **Client-side**: Display inline error messages with red borders and error text
- **Format Errors**: Provide specific guidance (e.g., "Email must contain @")
- **Required Fields**: Highlight all empty required fields on submit attempt

### Authentication Errors
- **Invalid Credentials**: Display "Email or password incorrect" message
- **Session Expired**: Redirect to login with message "Please log in again"
- **Duplicate Email**: Display "Email already registered" on signup

### Map Errors
- **Geolocation Unavailable**: Fall back to default Ethiopia center coordinates
- **Invalid Coordinates**: Skip markers with invalid lat/lng values
- **Map Load Failure**: Display error message with retry button

### Image Errors
- **File Too Large**: Limit to 2MB, display size error message
- **Invalid Format**: Accept only jpg, png, gif; display format error
- **Base64 Conversion Failure**: Log error and skip image

## Testing Strategy

### Unit Testing Approach

Unit tests will verify specific functions and edge cases:

**Storage Module Tests:**
- Test saving and retrieving different data types
- Test handling of null/undefined values
- Test UUID generation uniqueness
- Test data sanitization

**Validation Module Tests:**
- Test email regex with valid/invalid examples
- Test password length boundaries (5, 6, 7 characters)
- Test required field detection
- Test error message display/clearing

**Matching Algorithm Tests:**
- Test score calculation with known inputs
- Test category matching logic
- Test distance calculation accuracy
- Test ranking order

**Authentication Tests:**
- Test password hashing
- Test session creation/destruction
- Test authentication state checks

### Property-Based Testing Approach

Property-based tests will use **fast-check** library for JavaScript to verify universal properties across many randomly generated inputs.

**Configuration:**
- Minimum 100 iterations per property test
- Custom generators for domain objects (users, items, messages)
- Shrinking enabled to find minimal failing cases

**Test Generators:**
```javascript
// Example generators
fc.record({
  id: fc.uuid(),
  name: fc.string({minLength: 1, maxLength: 100}),
  email: fc.emailAddress(),
  category: fc.constantFrom('Food', 'Clothes', 'Books', 'Hygiene', 'Electronics'),
  coordinates: fc.record({
    lat: fc.double({min: 3, max: 15}), // Ethiopia bounds
    lng: fc.double({min: 33, max: 48})
  })
})
```

**Property Test Tags:**
Each property-based test will include a comment tag in this format:
```javascript
// **Feature: helpethiopia-enhancement, Property 2: Donation data round-trip consistency**
```

This ensures traceability between design properties and test implementation.

### Integration Testing

Integration tests will verify component interactions:
- Form submission → Storage → Display flow
- Login → Session → Protected page access
- Item creation → Matching → Notification flow
- Search/Filter → Display update

### Manual Testing Checklist

- [ ] Test on Chrome, Firefox, Safari
- [ ] Test on mobile devices (iOS, Android)
- [ ] Test with localStorage disabled
- [ ] Test with slow network (map loading)
- [ ] Test with maximum localStorage data
- [ ] Test keyboard navigation
- [ ] Test screen reader compatibility

## Implementation Notes

### Browser Compatibility
- Target: Modern browsers (Chrome 90+, Firefox 88+, Safari 14+)
- Use ES6+ features (const, let, arrow functions, template literals)
- No transpilation required for target browsers
- Graceful degradation for older browsers

### Performance Considerations
- Debounce search input (300ms delay)
- Lazy load images on item cards
- Paginate item lists (20 items per page)
- Cache localStorage reads in memory
- Throttle map marker updates

### Security Considerations
- Sanitize all user inputs before display (prevent XSS)
- Use simple password hashing (SHA-256) for demo purposes
- Validate file types and sizes on upload
- Implement CSRF tokens for future backend integration
- Never store sensitive data in localStorage

### Accessibility
- Semantic HTML5 elements
- ARIA labels for interactive elements
- Keyboard navigation support (Tab, Enter, Escape)
- Focus indicators on all interactive elements
- Alt text for all images
- Color contrast ratio 4.5:1 minimum

### Code Organization
- One module per file
- Use ES6 modules (import/export)
- Consistent naming conventions (camelCase for functions, PascalCase for classes)
- JSDoc comments for public functions
- Separate concerns (data, UI, business logic)
