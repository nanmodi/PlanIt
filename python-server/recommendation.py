from flask import Flask, request, jsonify
import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  


hotel_data = pd.read_csv(r'C:\Users\Nandini Modi\Desktop\PlanIt\python-server\data\hotels\google_hotel_data_clean_v2.csv')


hotel_data['combined_features'] = hotel_data[['Feature_1', 'Feature_2', 'Feature_3', 'Feature_4', 
                                              'Feature_5', 'Feature_6', 'Feature_7', 'Feature_8', 'Feature_9']].fillna('').agg(' '.join, axis=1)


vectorizer = TfidfVectorizer()
tfidf_matrix = vectorizer.fit_transform(hotel_data["combined_features"])
similarity_matrix = cosine_similarity(tfidf_matrix)
# Create a city-based weight matrix
city_weight_matrix = pd.DataFrame(
    1.0,  # Default weight = 1
    index=hotel_data["Hotel_Name"], 
    columns=hotel_data["Hotel_Name"]
)

# Increase weight for hotels in the same city (e.g., 1.2)
for hotel1, city1 in zip(hotel_data["Hotel_Name"], hotel_data["City"]):
    for hotel2, city2 in zip(hotel_data["Hotel_Name"], hotel_data["City"]):
        if city1 == city2:
            city_weight_matrix.loc[hotel1, hotel2] = 1.2  # Boost same-city similarity

# Adjust similarity scores with city weight
adjusted_similarity_matrix = similarity_matrix * city_weight_matrix.values

# Create similarity DataFrame
similarity_df = pd.DataFrame(
    adjusted_similarity_matrix,
    index=hotel_data["Hotel_Name"],
    columns=hotel_data["Hotel_Name"]
)


@app.route('/recommend/hotels', methods=['GET'])
def recommend_hotels():
    hotel_name = request.args.get('name')  
    num_recommendations = int(request.args.get('count', 5))  

    if hotel_name not in similarity_df.index:
        return jsonify({"error": "Hotel not found!"}), 404

    city=hotel_data[hotel_data['Hotel_Name']==hotel_name]['City'].values[0]
    filtered_hotels = hotel_data[hotel_data['City']==city]

    similarities = []
    for other_hotel, score in similarity_df[hotel_name].items():
        if other_hotel != hotel_name :  
            similarities.append((other_hotel, score))

   
    for i in range(len(similarities)):
        for j in range(i + 1, len(similarities)):
            if similarities[i][1] < similarities[j][1]:  
                similarities[i], similarities[j] = similarities[j], similarities[i]

   
    top_hotels = similarities[:num_recommendations]

   
    recommendations = [{"hotel_name": name, "similarity_score": round(score, 4)} for name, score in top_hotels]

    return jsonify({"hotel_name": hotel_name, "recommendations": recommendations})


   


@app.route('/recommend/by-price', methods=['GET'])
def recommend_by_price():
    max_price = int(request.args.get('price'))
    num_recommendations = int(request.args.get('count', 10))
    
    filtered_hotels = hotel_data[hotel_data["Hotel_Price"] <= max_price]
    recommended_hotels = filtered_hotels.sort_values(by="Hotel_Price").head(num_recommendations)
    
    return jsonify(recommended_hotels[["Hotel_Name", "Hotel_Price"]].to_dict(orient="records"))

@app.route('/recommend/by-rating', methods=['GET'])
def recommend_by_rating():
    max_rating = float(request.args.get('rating'))
    num_recommendations = int(request.args.get('count', 10))

    filtered_hotels = hotel_data[(hotel_data["Hotel_Rating"] >= max_rating) & (hotel_data["Hotel_Rating"] <= max_rating + 1)]
    recommended_hotels = filtered_hotels.sort_values(by="Hotel_Rating").head(num_recommendations)
    
    return jsonify(recommended_hotels[["Hotel_Name", "Hotel_Rating", "City"]].to_dict(orient="records"))

if __name__ == '__main__':
    app.run(debug=True)
