from pymongo import MongoClient
from urllib.parse import quote_plus

# Replace with your actual MongoDB username and password
username = "saimanideepnaidu"
password = "Mani@142803"

# URL-encode username and password
encoded_username = quote_plus(username)
encoded_password = quote_plus(password)

# Construct the MongoDB URI with the encoded username and password
uri = f"mongodb+srv://{encoded_username}:{encoded_password}@entangle.ltyoc.mongodb.net/?retryWrites=true&w=majority"

# Connect to the MongoDB cluster
client = MongoClient(uri)

# Select the database you want to use
db = client["entangle"]  # Replace 'your_database_name' with the name of your database

# Define collections
chats_collection = db["chats"]
messages_collection = db["messages"]

# Test connection
print("Connected to MongoDB!")
