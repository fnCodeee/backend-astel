curl -X POST http://localhost:3000/api/auth/register \
-H "Content-Type: application/json" \
-d '{
  "username": "faizatha",
  "email": "faizatha@gmail.com",
  "password": "securepassword"
}'

curl -X POST http://localhost:3000/api/auth/login \
-H "Content-Type: application/json" \
-d '{
  "username": "athaaja", 
  "password": "1234567890" 
}'

curl -X GET http://localhost:3000/api/profiles/me \
-H "Content-Type: application/json" \
-H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjZhMmZmY2U2OGVlMzVlNzY3MDFkNmI0MSIsImlhdCI6MTc4MTUyOTk5MywiZXhwIjoxNzgxNzg5MTkzfQ.GNEWn7o7Gm9BFd5tXTR_fhLjRBqQcgp4ZwGaee23Pnc" \
-d '{
  "username": "athaaja", 
  "password": "1234567890" 
}'
