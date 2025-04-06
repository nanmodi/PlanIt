from crewai import Agent, Task, Crew, LLM
import requests
from serpapi import GoogleSearch
from datetime import datetime, timedelta


llm = LLM(
    model="gemini",
    temperature=0.7,
    base_url="https://generativelanguage.googleapis.com/v1",
    api_key="AIzaSyCtCFeGtW8uD-N7qyhI1x8VjdEfikV8D44"  # Replace if invalid
)

class UserProfileAgent:
    def __init__(self):
        self.agent = Agent(
            name="User Profile Agent",
            role="Collects user preferences",
            goal="Gather travel preferences for a personalized trip plan",
            backstory="Expert travel consultant",
            llm=llm
        )

    def get_user_preferences(self, location, start_date, end_date, budget, interests):
        return {
            "location": location,
            "start_date": start_date,
            "end_date": end_date,
            "budget": budget,
            "interests": interests
        }

class EventFinderAgent:
    def __init__(self):
        self.agent = Agent(
            name="Event Finder Agent",
            role="Finds local events",
            goal="Discover events matching user interests",
            backstory="Digital event scout",
            llm=llm,
            verbose=True
        )

    def fetch_events(self, location, interests, start_date, end_date):
        params = {
            "engine": "google_events",
            "q": f"Events in {location} {start_date} to {end_date}",
            "hl": "en",
            "gl": "us",
            "api_key": "a6e82a376b0c8c21f7418a642677a112f8ed2d96d361c8d307054920fdf82d93"  # Replace if invalid
        }
        
        try:
            search = GoogleSearch(params)
            results = search.get_dict()
            
            if "events_results" not in results:
                return [{"title": "No events found", "date": "", "address": ""}]
            
            events = results["events_results"]
            filtered_events = []
            start = datetime.strptime(start_date, "%Y-%m-%d")
            end = datetime.strptime(end_date, "%Y-%m-%d")
            
            for event in events:
                event_date_str = event.get("date", {}).get("start_date", "")
                if event_date_str:
                    try:
                        event_date = datetime.strptime(event_date_str, "%Y-%m-%d")
                        if start <= event_date <= end:
                            description = event.get("description", "").lower()
                            title = event.get("title", "").lower()
                            if any(interest.lower() in description or interest.lower() in title for interest in interests):
                                filtered_events.append({
                                    "title": event["title"],
                                    "date": event_date_str,
                                    "address": ", ".join(event.get("address", []))
                                })
                    except ValueError:
                        continue
            
            # If no events match, return all available events to cycle through
            return filtered_events if filtered_events else events
        except Exception as e:
            return [{"title": f"Error fetching events: {str(e)}", "date": "", "address": ""}]

class HotelFinderAgent:
    def __init__(self):
        self.agent = Agent(
            name="Hotel Finder Agent",
            role="Finds accommodations",
            goal="Identify budget-friendly hotels",
            backstory="Travel accommodation expert",
            llm=llm
        )

    def fetch_hotels(self, location, start_date, end_date, budget, adults=2):
        params = {
            "engine": "google_hotels",
            "q": f"{location} Hotels",
            "check_in_date": start_date,
            "check_out_date": end_date,
            "adults": adults,
            "currency": "USD",
            "gl": "us",
            "hl": "en",
            "api_key": "a6e82a376b0c8c21f7418a642677a112f8ed2d96d361c8d307054920fdf82d93"  # Replace if invalid
        }

        try:
            search = GoogleSearch(params)
            results = search.get_dict()
            
            properties = results.get("properties", [])
            if not properties:
                return [{"name": "No hotels found", "price": "N/A"}]
            
            filtered_hotels = []
            for hotel in properties:
                price = hotel.get("total_rate", {}).get("lowest", "N/A")
                if price != "N/A" and "USD" in price:
                    price_value = float(price.replace("USD ", "").replace(",", ""))
                    if price_value <= budget:
                        filtered_hotels.append({
                            "name": hotel.get("name", "Unknown Hotel"),
                            "price": price
                        })
            
            return filtered_hotels if filtered_hotels else properties[:3]  # Return up to 3 hotels
        except Exception as e:
            return [{"name": f"Error fetching hotels: {str(e)}", "price": "N/A"}]

class WeatherAdvisorAgent:
    def __init__(self):
        self.agent = Agent(
            name="Weather Advisor Agent",
            role="Fetches weather data",
            goal="Provide accurate weather info",
            backstory="Meteorological expert",
            llm=llm
        )

    def get_weather(self, location, start_date, end_date):
        api_key = "your_openweather_api_key_here"  # Replace with valid OpenWeather API key
        api_url = f"http://api.openweathermap.org/data/2.5/forecast?q={location}&appid={api_key}&units=metric"
        
        try:
            response = requests.get(api_url)
            response.raise_for_status()
            data = response.json()
            
            start = datetime.strptime(start_date, "%Y-%m-%d")
            end = datetime.strptime(end_date, "%Y-%m-%d")
            forecasts = []
            
            for forecast in data["list"]:
                forecast_time = datetime.fromtimestamp(forecast["dt"])
                if start <= forecast_time <= end:
                    forecasts.append({
                        "date": forecast_time.strftime("%Y-%m-%d"),
                        "temperature": f"{forecast['main']['temp']}°C",
                        "description": forecast["weather"][0]["description"]
                    })
            return forecasts if forecasts else [{"date": "", "temperature": "N/A", "description": "No weather data"}]
        except Exception as e:
            return [{"date": "", "temperature": "N/A", "description": f"Error: {str(e)}"}]

class ItineraryPlannerAgent:
    def __init__(self):
        self.agent = Agent(
            name="Itinerary Planner Agent",
            role="Generates daily itinerary",
            goal="Create a personalized travel plan",
            backstory="Master travel curator",
            llm=llm
        )

    def generate_itinerary(self, user_data, events, weather, hotels):
        start_date = datetime.strptime(user_data["start_date"], "%Y-%m-%d")
        end_date = datetime.strptime(user_data["end_date"], "%Y-%m-%d")
        trip_days = (end_date - start_date).days + 1
        
        itinerary = []
        
        for day in range(trip_days):
            current_date = start_date + timedelta(days=day)
            current_date_str = current_date.strftime("%Y-%m-%d")
            
            # Weather for the day
            weather_info = next((w for w in weather if w["date"] == current_date_str), 
                              {"temperature": "N/A", "description": "Weather unavailable"})
            
            # Event for the day (cycle through events if fewer than days)
            event_index = day % len(events) if events else 0
            event_info = events[event_index] if events else {"title": "No event", "date": "", "address": ""}
            
            # Hotel for the day (cycle through hotels if multiple)
            hotel_index = day % len(hotels) if hotels else 0
            hotel_info = hotels[hotel_index] if hotels else {"name": "No hotel found", "price": "N/A"}
            
            day_plan = f"""
Day {day + 1} - {current_date_str}

 Stay at: {hotel_info['name']} (Price: {hotel_info.get('price', 'N/A')})
 Event: {event_info['title']}
   Date: {event_info['date']}
   Location: {event_info['address']}
"""
            itinerary.append(day_plan)
        
        return itinerary

class TravelPlannerCrew:
    def __init__(self):
        self.user_agent = UserProfileAgent()
        self.event_agent = EventFinderAgent()
        self.weather_agent = WeatherAdvisorAgent()
        self.hotel_agent = HotelFinderAgent()
        self.itinerary_agent = ItineraryPlannerAgent()

        self.crew = Crew(
            name="PlanIt AI",
            agents=[
                self.user_agent.agent,
                self.event_agent.agent,
                self.weather_agent.agent,
                self.hotel_agent.agent,
                self.itinerary_agent.agent
            ],
            llm=llm
        )

    def plan_trip(self, location, start_date, end_date, budget, interests):
        user_data = self.user_agent.get_user_preferences(location, start_date, end_date, budget, interests)
        events = self.event_agent.fetch_events(location, interests, start_date, end_date)
        weather = self.weather_agent.get_weather(location, start_date, end_date)
        hotels = self.hotel_agent.fetch_hotels(location, start_date, end_date, budget)
        return self.itinerary_agent.generate_itinerary(user_data, events, weather, hotels)

