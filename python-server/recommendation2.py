import pandas as pd
import numpy as np
from flask import Flask, request, jsonify
from flask_cors import CORS
import json


import app as example


app = Flask(__name__)
CORS(app, supports_credentials=True, origins=["http://localhost:5173"])
df=pd.read_csv(r'C:\Users\Nandini Modi\Desktop\PlanIt\python-server\data\hotels\booking_com-travel_sample.csv')
print(df.head())
print(df.columns)
df=df[['address','city','country','hotel_description','hotel_facilities','hotel_star_rating','latitude','locality','longitude','property_name','property_type','province','room_count','similar_hotel','state','zone']]
df.isnull().sum()
missing_percentage = df.isnull().sum() / len(df) * 100
# Fix missing values in categorical columns using mode
df['city'] = df['city'].fillna(df['city'].mode()[0])
df['state'] = df['state'].fillna(df['state'].mode()[0])

# Fix hotel_star_rating (convert to numeric & fill NaN with mean)
df['hotel_star_rating'] = df['hotel_star_rating'].astype(str).str.extract('(\d+)')  # Extract digits
df['hotel_star_rating'] = pd.to_numeric(df['hotel_star_rating'], errors='coerce')  # Convert to number
df['hotel_star_rating'] = df['hotel_star_rating'].fillna(df['hotel_star_rating'].mean())

# Fix room_count (convert to numeric & fill NaN with mean)
df['room_count'] = pd.to_numeric(df['room_count'], errors='coerce')  # Convert to numeric
df['room_count'] = df['room_count'].fillna(df['room_count'].mean())

# Fill missing text descriptions with default values
df['hotel_description'] = df['hotel_description'].fillna("No Description Available")
df['hotel_facilities'] = df['hotel_facilities'].fillna("Facilities not listed")

# Drop rows where property_name is missing
df = df.dropna(subset=['property_name'])

# Fill similar_hotel column using mode per locality
df['similar_hotel'] = df.groupby('locality')['similar_hotel'].transform(lambda x: x.fillna(x.mode()[0] if not x.mode().empty else "No Similar Hotel"))

# Display final missing values (to verify)
print(df.isna().sum())


import pandas as pd
from math import radians, sin, cos, sqrt, atan2
from geopy.geocoders import Nominatim



# Function to calculate Haversine Distance
def haversine(lat1, lon1, lat2, lon2):
    R = 6371  # Earth radius in km
    dlat = radians(lat2 - lat1)
    dlon = radians(lon2 - lon1)
    a = sin(dlat/2)**2 + cos(radians(lat1)) * cos(radians(lat2)) * sin(dlon/2)**2
    c = 2 * atan2(sqrt(a), sqrt(1-a))
    return R * c  # Distance in km

# Function to get landmark coordinates
def get_landmark_coordinates(landmark):
    geolocator = Nominatim(user_agent="geoapi")
    
    location = geolocator.geocode(landmark)
    
    if location:
        return location.latitude, location.longitude
    return None, None
def recommend_hotels(state, city, min_price, max_price, landmark):
    # Convert user input to lowercase
    state = state.lower()
    city = city.lower()

    # Filter hotels based on state and city
    hotels = df[(df['state'].str.lower() == state) & 
                (df['city'].str.lower() == city) & 
                (df['hotel_star_rating'] >= min_price) & 
                (df['hotel_star_rating'] <= max_price)].copy()

    if hotels.empty:
        return "⚠️ No hotels found for the given state, city, and budget."
    hotels = hotels.drop_duplicates(subset=['property_name'], keep='first')
    # If landmark is provided, calculate distances
    if landmark:
        landmark_lat, landmark_lon = get_landmark_coordinates(landmark)
        if landmark_lat and landmark_lon:
            hotels['distance'] = hotels.apply(
                lambda row: haversine(landmark_lat, landmark_lon, row['latitude'], row['longitude']), axis=1
            )
            hotels = hotels.sort_values(by='distance')
        else:
            print('uiii')
            return hotels[['property_name']].head(7)

  
    

  
    return hotels[['property_name']].head(7)





@app.route('/recommend/hotels', methods=['GET'])
def get_recomm():
    state = request.args.get('state')
    city = request.args.get('city')
    min_price = float(request.args.get('min_price', 1))
    max_price = float(request.args.get('max_price', 5))
    landmark = request.args.get('landmark', '')
    
    recommendations = recommend_hotels(state, city, min_price, max_price, landmark)
    json_data = recommendations.to_json(orient='records')


    json_output = json.dumps(json_data)
    return jsonify(recommendations.to_dict(orient='records'))

@app.route('/generate/iternary',methods=['POST'])
def generate_itinerary():
    data = request.get_json()
    state = data.get('location')
    start_date= data.get('start_date')
    end_date = data.get('end_date')
    budget = data.get('budget')
    interest= data.get('intrest')
     
    travel_planner = example.TravelPlannerCrew()
    itinerary = travel_planner.plan_trip(
        location=state,
        start_date=start_date,
        end_date=end_date,
        budget=budget,
        interests=interest
    )
    print("Your Travel Itinerary:")
    for day in itinerary:
        print(day)
    return jsonify({"iternary":itinerary})

if __name__ == '__main__':
    app.run(debug=True)

    