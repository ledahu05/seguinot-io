# Feature Specification: Room Share Link

**Feature Branch**: `007-room-share-link`
**Created**: 2025-12-12
**Status**: Draft
**Input**: User description: "In the multiplayer mode, right now to play together people needs to exchange the code room. When a player create a room I would him to provide him a way to share a link that would allow the other user to directly navigate to the app and joined the room"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Share Room Link (Priority: P1)

As a room creator, I want to easily share a direct link to my game room so that my friend can join with one click instead of manually entering a room code.

**Why this priority**: This is the core feature request. Without the ability to share a link, the feature has no value.

**Independent Test**: Can be fully tested by creating a room, copying the share link, and verifying the link navigates directly to join that room.

**Acceptance Scenarios**:

1. **Given** a user has created an online game room and is on the waiting screen, **When** they look at the room information, **Then** they see both the room code AND a share link option.

2. **Given** a user is viewing the share link option, **When** they tap/click the share button, **Then** the system provides a way to share the link (copy to clipboard or native share dialog).

3. **Given** a share link has been copied, **When** the user pastes it somewhere, **Then** the link is a complete URL that can be opened in a browser.

---

### User Story 2 - Join via Shared Link (Priority: P1)

As a player receiving a shared link, I want to click the link and be taken directly to join the game room so that I don't have to manually navigate and enter a code.

**Why this priority**: This completes the share flow - without the ability to join via link, the share feature is useless.

**Independent Test**: Can be tested by opening a valid share link in a browser and verifying the user lands on the join flow for that specific room.

**Acceptance Scenarios**:

1. **Given** a user receives a valid room share link, **When** they click/open the link, **Then** they are navigated to the game with the room code pre-filled.

2. **Given** a user opens a share link, **When** the page loads, **Then** they see a prompt to enter their player name before joining.

3. **Given** a user has entered their name after opening a share link, **When** they confirm, **Then** they automatically attempt to join the specified room.

---

### User Story 3 - Mobile Share Experience (Priority: P2)

As a mobile user creating a room, I want to share the link using my device's native sharing capabilities so that I can easily send it via any messaging app.

**Why this priority**: Enhances the sharing experience on mobile but the feature works without it (copy-to-clipboard as fallback).

**Independent Test**: Can be tested on a mobile device by creating a room and verifying the native share sheet appears with the link.

**Acceptance Scenarios**:

1. **Given** a user is on a mobile device viewing the waiting screen, **When** they tap the share button, **Then** the device's native share dialog opens with the room link.

2. **Given** a user is on a desktop browser, **When** they click the share button, **Then** the link is copied to clipboard with visual confirmation.

---

### Edge Cases

- What happens when a user opens a share link for a room that no longer exists or is full?
  - User should see an appropriate error message and option to return to menu
- What happens when a user opens a share link while already in another game?
  - Standard navigation behavior applies (they leave current context)
- What happens if the room code in the URL is invalid format?
  - URL validation should reject and show error or redirect to menu
- What happens when a user tries to share before the room is fully created?
  - Share option should only appear after room is confirmed created

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST generate a shareable URL containing the room code when a room is created
- **FR-002**: System MUST display a share option on the "Waiting for Opponent" screen alongside the room code
- **FR-003**: System MUST provide a way to copy the share link to clipboard on all platforms
- **FR-004**: System MUST use the Web Share API on supported mobile devices for native sharing
- **FR-005**: System MUST show visual feedback when a link is copied to clipboard
- **FR-006**: System MUST accept room codes from URL parameters when navigating to the join page
- **FR-007**: System MUST prompt users opening a share link to enter their player name before joining
- **FR-008**: System MUST validate room codes in URLs match the expected format (6 alphanumeric characters)
- **FR-009**: System MUST display an error message if a user tries to join a non-existent or full room via share link
- **FR-010**: System MUST preserve the share link format as a clean, readable URL

### Key Entities

- **Share Link**: A URL containing the base application path plus room code parameter, enabling direct room joining
- **Room Code**: Existing 6-character alphanumeric identifier for online game rooms

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Users can share a room link within 2 taps/clicks from the waiting screen
- **SC-002**: Users joining via share link complete the join process in under 30 seconds (including name entry)
- **SC-003**: 100% of valid share links successfully navigate to the correct room join flow
- **SC-004**: Share link copy-to-clipboard works on all major browsers (Chrome, Safari, Firefox, Edge)
- **SC-005**: Native share dialog appears on 90%+ of mobile devices that support Web Share API

## Assumptions

- The existing room code system and online game infrastructure remain unchanged
- The application is served over HTTPS (required for clipboard API and Web Share API)
- Users have basic familiarity with sharing links via messaging apps
- The room join flow will handle errors gracefully when rooms don't exist or are full (existing behavior)
