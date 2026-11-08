# Security Specification & Test Protocol: SPOTTER

## 1. Data Invariants
1. **Public Reading of Spots**: Anyone can read car spots in the public gallery (`/spots/{spotId}`).
2. **Authenticated Spot Creation**: Only authenticated users (`request.auth != null`) can submit a new spot.
3. **Identity Binding**: When creating a spot with `userId`, `incoming().userId` MUST match `request.auth.uid`.
4. **Spot Immutability & Ownership on Update/Delete**:
   - Only the creator of the spot (`resource.data.userId == request.auth.uid`) or an admin can update or delete the spot details.
   - Any user can upvote a spot by adding a like document in `/spots/{spotId}/likes/{userId}`, or incrementing `likes` with limited field access.
   - The original `userId` cannot be transferred or spoofed on update (`incoming().userId == existing().userId`).
5. **Like Subcollection Invariant**:
   - Path `/spots/{spotId}/likes/{userId}` requires that `{userId}` matches `request.auth.uid`. A user can only manage their own like.
6. **User Profile Invariant**:
   - Path `/users/{userId}`: A user can only write to their own profile where `{userId} == request.auth.uid`.

## 2. The Dirty Dozen Payloads (Security Attack Vectors)
1. **Unauthenticated Spot Injection**: Unauthenticated client attempts `setDoc(/spots/spot-hack)` -> Expected: PERMISSION_DENIED.
2. **User ID Spoofing**: User `auth_123` tries to create spot with `userId: "auth_999"` -> Expected: PERMISSION_DENIED.
3. **Malicious Giant Payload (Denial of Wallet)**: Injecting 2MB string into `make` or `model` -> Expected: PERMISSION_DENIED.
4. **Invalid Rarity Tampering**: Creating a spot with `rarity: "godlike"` outside the enum -> Expected: PERMISSION_DENIED.
5. **Path ID Traversal / Junk Characters**: Path `/spots/../../root_compromise` -> Expected: PERMISSION_DENIED.
6. **Like Stealing / Impersonation**: User `auth_123` creating `/spots/spot-001/likes/auth_999` -> Expected: PERMISSION_DENIED.
7. **Foreign Spot Deletion**: User `auth_123` attempting `deleteDoc(/spots/spot-owned-by-user-456)` -> Expected: PERMISSION_DENIED.
8. **Foreign Spot Hijacking (Update Make/Model)**: User `auth_123` updating vehicle details of someone else's spot -> Expected: PERMISSION_DENIED.
9. **User Profile Tampering**: User `auth_123` writing to `/users/auth_456` -> Expected: PERMISSION_DENIED.
10. **Ghost Field Injection (Shadow Update)**: Updating spot with forbidden administrative field `{ isAdmin: true }` -> Expected: PERMISSION_DENIED.
11. **Negative Likes Manipulation**: Setting `likes: -99999` -> Expected: PERMISSION_DENIED.
12. **Empty Photos Array**: Creating a spot without any photo array -> Expected: PERMISSION_DENIED.
