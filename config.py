import os

class Config:
    DEBUG = True
    PORT = int(os.getenv("PORT", 5000))
