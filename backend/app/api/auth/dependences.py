from fastapi import HTTPException, Depends, Header
from .firebase import verify_firebase_token

async def get_current_user(authorization: str = Header(...)):
    # Extract the token from the Authorization header (Bearer <token>)
    token = authorization.split(" ")[1]
    decoded_token = verify_firebase_token(token)

    if decoded_token is None:
        raise HTTPException(status_code=401, detail="Invalid or expired token")
    
    return decoded_token  # Return the decoded user data
