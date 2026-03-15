# Identity Matching API

Backend service built for **Bitespeed Backend Task**
User will send request with either email or phone number or both. The service will record all the transaction and return the matched contact with either email or phone number and maintain single identity tagged as "primary" across the database.

## API Endpoint

### Request Format

POST /identify

```
{
    "email" : string?,
    "phoneNumber" : string?,
}
```
At least email or phone number must be present

### Response Format

```
{
"contact": {
    "primaryContactId": 1,
    "emails": [
    "lorraine@hillvalley.edu",
    "mcfly@hillvalley.edu"
    ],
    "phoneNumbers": [
    "123456"
    ],
    "secondaryContactIds": [23]
    }
}   
```

## Automated Testing

This project includes automated tests to verify the correctness of the identity reconciliation logic and the /identify endpoint.

Tests cover key scenarios such as:
- Creating a new primary contact
- Linking contacts using existing email or phone number
- Creating secondary contacts when new information is introduced
- Resolving multiple primary contacts by keeping the oldest as primary
- Validating the response structure and consolidated identity