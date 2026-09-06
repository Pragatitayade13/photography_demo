# API Conventions

## Base URL
All API routes are prefixed under:
```text
/api/v1
```

## Standard Response Format

### Success Response
```json
{
  "success": true,
  "data": { ... },
  "message": "Optional human-readable success description"
}
```

### Error Response
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR | UNAUTHORIZED | FORBIDDEN | NOT_FOUND | CONFLICT | RATE_LIMITED | INTERNAL_ERROR",
    "message": "Human friendly error description",
    "details": [ ... ]
  }
}
```

## HTTP Status Codes
- `200 OK`: Successful GET / PUT / PATCH
- `201 Created`: Successful POST creation
- `400 Bad Request`: Validation failure
- `401 Unauthorized`: Authentication missing or invalid
- `403 Forbidden`: Insufficient permissions
- `404 Not Found`: Entity not found
- `409 Conflict`: Duplicate unique key (e.g. duplicate slug or email)
- `429 Too Many Requests`: Rate limit reached
- `500 Internal Server Error`: Unhandled server error (sanitized message)
