#!/bin/bash

# Your Calendly API Token
CALENDLY_API_TOKEN="eyJraWQiOiIxY2UxZTEzNjE3ZGNmNzY2YjNjZWJjY2Y4ZGM1YmFmYThhNjVlNjg0MDIzZjdjMzJiZTgzNDliMjM4MDEzNWI0IiwidHlwIjoiUEFUIiwiYWxnIjoiRVMyNTYifQ.eyJpc3MiOiJodHRwczovL2F1dGguY2FsZW5kbHkuY29tIiwiaWF0IjoxNzI3MTc0MjE3LCJqdGkiOiI2ZDZmM2U2NS1hMjE5LTRhOTEtYTcxYy1kZjUxMzRhNTM0OTYiLCJ1c2VyX3V1aWQiOiIxOWE0NGY3NC02NmU1LTQyN2UtOTg4Ny05MDEyMjMzNGVlOTAifQ.Jh1j1Vyg8fldMZi8vQaUNEruoIYdlZ4ZE6VPbnnjyN13hKQwCMoJDXAWGakwp-gyLaxhPAJKY1Y_1zV_bD9cUA"

# Your Calendly Organization URI
CALENDLY_ORGANIZATION_URI="https://api.calendly.com/organizations/81a31525-bdc0-4090-882f-fdd8fb3ea350"

# Your webhook URL (the endpoint on your server to receive Calendly events)
WEBHOOK_URL="https://16.170.226.218:3000/api/calendlyWebhook"

# Create a Calendly webhook subscription
curl -X POST "https://api.calendly.com/webhook_subscriptions" \
-H "Authorization: Bearer $CALENDLY_API_TOKEN" \
-H "Content-Type: application/json" \
-d '{
  "url": "'"$WEBHOOK_URL"'",
  "events": ["invitee.created", "invitee.canceled"],
  "organization": "'"$CALENDLY_ORGANIZATION_URI"'",
  "scope": "organization"
}'
