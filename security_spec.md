# DoodleLab Security Specification (Phase 0)

## 1. Data Invariants
1. A `UserProgress` document at `/users/{userId}` can only be read, created, or updated by the verified owner (`request.auth.uid == userId` and `request.auth.token.email_verified == true`), and `data.userId` must strictly equal `request.auth.uid`.
2. `UserProgress.createdAt` is immutable and must equal `request.time` at creation; `updatedAt` must equal `request.time` on every write.
3. All arrays in `UserProgress` (`badge`, `materiSelesai`, `kuisSelesai`, `simulasiDicoba`) are strictly bounded in size and type-checked.
4. `UserPrivateInfo` at `/users/{userId}/private/{docId}` isolates PII (`email`, `authProvider`) from progress data, requires parent `/users/{userId}` to exist (Master Gate), and is readable/writable solely by the verified owner.
5. `ProTransaction` at `/users/{userId}/transactions/{transactionId}` requires parent `/users/{userId}` to exist, enforces terminal status `'LUNAS (Paid)'`, is immutable once created (`allow update, delete: if false`), and rejects list/get by any non-owner.

## 2. The "Dirty Dozen" Adversarial Payloads
1. **Unauthenticated Read/Write**: `request.auth == null` reading `/users/userA` -> `PERMISSION_DENIED`.
2. **Unverified Email Write**: `request.auth.token.email_verified == false` writing `/users/userA` -> `PERMISSION_DENIED`.
3. **Identity Spoofing on Create**: `userB` creating `/users/userA` or setting `data.userId = "userA"` -> `PERMISSION_DENIED`.
4. **Shadow Field Injection**: `userA` creating `/users/userA` with extra ghost key `isAdmin: true` -> `PERMISSION_DENIED`.
5. **Path Variable ID Poisoning**: Creating `/users/` + 500-char invalid ID with `$` -> `PERMISSION_DENIED`.
6. **Client Timestamp Spoofing**: Setting `createdAt` or `updatedAt` to a past timestamp instead of `request.time` -> `PERMISSION_DENIED`.
7. **Immortal Field Mutation**: Updating `/users/userA` and changing `createdAt` or `userId` -> `PERMISSION_DENIED`.
8. **Type / Size Poisoning on Update**: Updating `namaAlias` to a 500-char string or negative `xp: -50` -> `PERMISSION_DENIED`.
9. **Unbounded Array Attack**: Sending `materiSelesai` with 500 elements -> `PERMISSION_DENIED`.
10. **PII Cross-User Read**: `userB` reading `/users/userA/private/account` -> `PERMISSION_DENIED`.
11. **Orphan Subcollection Write**: Creating `/users/userA/transactions/tx1` before `/users/userA` exists -> `PERMISSION_DENIED`.
12. **Terminal State Mutation**: Attempting to `update` or `delete` an existing `/users/userA/transactions/tx1` receipt -> `PERMISSION_DENIED`.
