import serpapi
from dotenv import load_dotenv
import os
# Load environment variables from .env file
load_dotenv()


serpapi_key = os.getenv("SERP_API")
print(serpapi_key)
print(dir(serpapi))

