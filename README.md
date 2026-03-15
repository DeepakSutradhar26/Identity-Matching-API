# Identity Matching API

Backend service built for **Bitespeed Backend Task**
User will send request with either email or phone number or both. The service will record all the transaction and return the matched contact with either email or phone number and maintain single identity tagged as "primary" across the database.

# Frontend

Use this frontend for making request to server

[Identity Matching Fronted made using Vite + Typescript + React](https://identity-matching-ui.vercel.app/)

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

## Local Setup for backend

Clone the repository
```
https://github.com/DeepakSutradhar26/Identity-Matching-API.git
```
Install required packages
```
npm install
```
Generate prisma client
```
npx prisma generate
```
Create tables in database
```
npx prisma migrate deploy
```
Run automated test suite locally 
```
npm test
```
Run the server locally
```
npm run dev
```