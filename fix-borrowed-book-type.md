# Fix for BorrowedBook Type Issue

## Problem Analysis

The file `app/(root)/my-profile/page.tsx` has a TypeScript error on line 57:
- **Error**: `Cannot find name 'BorrowedBook'. (2304)`
- **Location**: Line 57 in the `ProfileContent` component props type definition

## Root Cause

1. The `BorrowedBook` type is referenced but never defined or imported
2. The database query creates a specific structure by joining `books` and `borrowRecords` tables
3. The resulting data structure needs to match what the `BookList` component expects

## Database Query Analysis

The query in lines 21-47 selects:
- All book fields from `books` table
- Additional fields: `dueDate` and `borrowDate` from `borrowRecords` table
- Returns data with mixed types (some Date objects, some strings)

## BookList Component Requirements

From `components/BookList.tsx`, the component expects:
- `id`: string
- `borrowDate`: string 
- `dueDate`: string
- `createdAt`: string
- All other book fields as defined in the books interface

## Solution

### 1. Define BorrowedBook Type

Add the following type definition to the file:

```typescript
type BorrowedBook = {
  id: string;
  title: string;
  author: string;
  genre: string;
  rating: number;
  coverUrl: string;
  coverColor: string;
  description: string;
  totalCopies: number;
  availableCopies: number;
  videoUrl: string;
  summary: string;
  createdAt: Date | null;
  dueDate: Date | null;
  borrowDate: Date | null;
};
```

### 2. Alternative Solution: Use Existing Types

Instead of creating a new type, we could:
- Import the existing `books` interface from `types.d.ts`
- Extend it with the additional borrow-related fields
- Use intersection types or interface extension

### 3. Type-safe Database Query Result

The current query returns a structure that matches our `BorrowedBook` type, but the data transformation in lines 120-127 converts dates to strings for the `BookList` component.

## Implementation Steps

1. Add the `BorrowedBook` type definition at the top of the file
2. Verify the type matches the database query result structure
3. Ensure compatibility with the `BookList` component's expected props
4. Test that TypeScript errors are resolved

## Additional Improvements

1. **Centralize Types**: Consider moving the `BorrowedBook` type to `types.d.ts` for reusability
2. **Type Safety**: Use Drizzle's inferred types for better type safety
3. **Consistency**: Ensure all date handling is consistent throughout the application

## Files to Modify

- `app/(root)/my-profile/page.tsx` - Add type definition and fix line 57
- Optionally `types.d.ts` - Add centralized type definition

## Testing

After implementation:
1. Verify TypeScript compilation passes
2. Check that the component renders correctly
3. Ensure data transformation works as expected
4. Test with actual borrowed books data