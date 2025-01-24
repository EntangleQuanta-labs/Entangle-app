import firebase_admin
from firebase_admin import credentials, auth

# Initialize Firebase Admin SDK with your service account key
def initialize_firebase():
    cred = credentials.Certificate("path/to/serviceAccountKey.json")
    firebase_admin.initialize_app(cred)

# Function to verify ID token
def verify_firebase_token(id_token: str):
    try:
        decoded_token = auth.verify_id_token(id_token)
        return decoded_token
    except Exception as e:
        return None
