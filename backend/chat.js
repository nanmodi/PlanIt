import axios from "axios";
import dotenv from "dotenv";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { getJson } from "serpapi";
import dayjs from "dayjs";
import { getFlight } from "./flight.js";
dotenv.config();
async function getEvents(location) {
  const prompt = "events in " + location;

  return new Promise((resolve, reject) => {
    getJson(
      {
        engine: "google_events",
        q: prompt,
        hl: "en",
        gl: "us",
        api_key: process.env.SERP_API,
      },
      (json) => {
        if (json && json.error) {
          return reject(json);
        }

        if (!json || !json.events_results) {
          return reject("No events found.");
        }

        const events = json.events_results.map((event) => ({
          title: event.title,
          date: event.date?.when || "Date not available",
          start_date: event.date?.start_date || "Start date not available",

          description: event.description || "No description available",
        }));

        resolve(events);
      }
    );
  });
}

async function getWeather(city) {
  try {
    const response = await axios.get(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${process.env.WEATHER_API_KEY}`
    );

    const data = response.data;
    return {
      city: data.name,
      country: data.sys.country,
      weather: data.weather[0].description,
      temperature: (data.main.temp - 273.15).toFixed(1) + "°C",
      feels_like: (data.main.feels_like - 273.15).toFixed(1) + "°C",
      humidity: data.main.humidity + "%",
      pressure: data.main.pressure + " hPa",
      wind_speed: data.wind.speed + " m/s",
      visibility: data.visibility / 1000 + " km",
      sunrise: new Date(data.sys.sunrise * 1000).toLocaleTimeString(),
      sunset: new Date(data.sys.sunset * 1000).toLocaleTimeString(),
    };
  } catch (error) {
    console.error("Weather API Error:", error.response?.data || error.message);
    return { error: "Failed to fetch weather data." };
  }
}

async function getHotels(
  city,
  check_in,
  check_out,
  adults = 1,
  currency = "USD"
) {
  const today = dayjs();
  const checkInDate = dayjs(check_in);
  const checkOutDate = dayjs(check_out);

  let updatedCheckIn = check_in;
  let updatedCheckOut = check_out;

  if (
    checkInDate.isBefore(today) ||
    checkOutDate.isBefore(today) ||
    checkOutDate.isBefore(checkInDate)
  ) {
    updatedCheckIn = today.add(1, "day").format("YYYY-MM-DD");
    updatedCheckOut = today.add(2, "day").format("YYYY-MM-DD");
    console.log(
      `Adjusting dates to future: check-in=${updatedCheckIn}, check-out=${updatedCheckOut}`
    );
  }

  return new Promise((resolve, reject) => {
    getJson(
      {
        engine: "google_hotels",
        q: city,
        check_in_date: updatedCheckIn,
        check_out_date: updatedCheckOut,
        adults: adults,
        currency: currency,
        gl: "us",
        hl: "en",
        api_key: process.env.SERP_API,
      },
      (json) => {
        if (json && json.error) {
          return reject(json);
        }

        if (!json || !json.properties) {
          return reject("No hotels found.");
        }

        const hotels = json.properties.map((hotel) => {
          let priceDisplay = "Price not available";

          if (hotel.rate_per_night && hotel.rate_per_night.lowest) {
            priceDisplay = hotel.rate_per_night.lowest;
          } else if (hotel.prices && hotel.prices.length > 0) {
            const priceSource = hotel.prices[0];

            if (
              priceSource.rate_per_night &&
              priceSource.rate_per_night.lowest
            ) {
              priceDisplay = priceSource.rate_per_night.lowest;
            } else if (typeof priceSource === "string") {
              priceDisplay = priceSource;
            }
          }

          return {
            name: hotel.name,
            type: hotel.type || "Hotel",
            check_in_time: hotel.check_in_time || "N/A",
            check_out_time: hotel.check_out_time || "N/A",
            rating: hotel.overall_rating || "No rating",
            price: priceDisplay,
            hotel_class: hotel.hotel_class || "",
            description: hotel.description || "",
            source:
              hotel.prices && hotel.prices[0] && hotel.prices[0].source
                ? hotel.prices[0].source
                : "Unknown",
          };
        });

        resolve(hotels);
      }
    );
  });
}

const genAI = new GoogleGenerativeAI(process.env.API_KEY);
const generativeModel = genAI.getGenerativeModel({
  model: "gemini-1.5-flash",
  tools: [
    {
      function_declarations: [
        {
          name: "getWeather",
          description: "Fetches real-time weather for a given city.",
          parameters: {
            type: "object",
            properties: {
              city: {
                type: "string",
                description: "City name to get weather details.",
              },
            },
            required: ["city"],
          },
        },
        {
          name: "getHotels",
          description:
            "Fetches hotel details for a given location and date range.",
          parameters: {
            type: "object",
            properties: {
              city: { type: "string", description: "Location name." },
              check_in: {
                type: "string",
                description: "Check-in date (YYYY-MM-DD).",
              },
              check_out: {
                type: "string",
                description: "Check-out date (YYYY-MM-DD).",
              },
              adults: { type: "number", description: "Number of adults." },
              currency: {
                type: "string",
                description: "Currency (e.g., USD, EUR).",
              },
            },
            required: ["city", "check_in", "check_out"],
          },
        },
        {
          name: "getEvents",
          description: "Fetches real-time events details for a given location.",
          parameters: {
            type: "object",
            properties: {
              location: {
                type: "string",
                description: "Location name to get events details.",
              },
            },
            required: ["location"],
          },
        },
        {
          name: "getFlights",
          description:
            "Fetches real-time flight details based on departure and arrival cities along with travel dates.",
          parameters: {
            type: "object",
            properties: {
              departure: {
                type: "string",
                description:
                  "Name of the departure city (e.g., 'New York', 'London').",
              },
              arrival: {
                type: "string",
                description:
                  "Name of the arrival city (e.g., 'Paris', 'Tokyo').",
              },
              outd: {
                type: "string",
                format: "date-time",
                description: "Outbound departure date in YYYY-MM-DD format.",
              },
              retd: {
                type: "string",
                format: "date-time",
                description:
                  "Return date in YYYY-MM-DD format (optional for one-way trips).",
              },
            },
            required: ["departure", "arrival", "outd", "retd"],
          },
        },
      ],
    },
  ],
});

async function chatWithGemini(prompt) {
  try {
    const chat = generativeModel.startChat();
    const result = await chat.sendMessage(prompt, {
      tool_config: { function_calling_config: { mode: "auto" } },
    });

    console.log(" Raw Gemini Response:", JSON.stringify(result, null, 2));
    const functionCall =
      result.response?.candidates?.[0]?.content?.parts?.[0]?.functionCall;

    if (functionCall) {
      console.log("🔍 Detected Function Call:", functionCall);

      const { name, args } = functionCall;

      let apiResponse;
      try {
        if (name === "getWeather") {
          apiResponse = await getWeather(args.city);
        } else if (name === "getHotels") {
          apiResponse = await getHotels(
            args.city,
            args.check_in,
            args.check_out,
            args.adults,
            args.currency
          );
        } else if (name === "getEvents") {
          apiResponse = await getEvents(args.location);
        } else if (name === "getFlights") {
          apiResponse = await getFlight(
            args.departure,
            args.arrival,
            args.outd,
            args.retd
          );
        }
        if (Array.isArray(apiResponse)) {
          apiResponse = apiResponse.slice(0, 15);
        }

        console.log(`🌐 ${name} API Response:`, apiResponse);

        let formattedResponse;

        if (name === "getWeather") {
          if (apiResponse.error) {
            formattedResponse = {
              message: `Sorry, I couldn't get weather information for ${args.city}. ${apiResponse.error}`,
            };
          } else {
            formattedResponse = {
              message: `The current weather in ${apiResponse.city}, ${apiResponse.country} is ${apiResponse.weather}. Temperature: ${apiResponse.temperature}, feels like ${apiResponse.feels_like}. Humidity: ${apiResponse.humidity}. Wind speed: ${apiResponse.wind_speed}. Visibility: ${apiResponse.visibility}. Sunrise: ${apiResponse.sunrise}, Sunset: ${apiResponse.sunset}.`,
            };
          }
        } else if (name === "getHotels") {
          if (!apiResponse || !apiResponse.length) {
            formattedResponse = {
              message: `Sorry, I couldn't find any hotels in ${args.city} for your dates.`,
            };
          } else {
            const hotelListFormatted = apiResponse
              .map((h, index) => `${index + 1}. ${h.name} (${h.rating}⭐)`)
              .join("\n");

            console.log("Hotel list length:", hotelListFormatted.length);
            console.log(
              "First few hotels:",
              hotelListFormatted.substring(0, 200)
            );
            formattedResponse = {
              message: `Here are some hotels in ${args.city}:\n\n${apiResponse
                .map(
                  (h, index) => `${index + 1}. **${h.name}** (${h.rating}⭐)  
        💰 Price: ${h.price}  
        🏨 Type: ${h.type}  
        🏆 Class: ${h.hotel_class}  
        🕒 Check-in: ${h.check_in_time}, Check-out: ${h.check_out_time}  
        🔗 Source: ${h.source}  
        --------------------------------------------`
                )
                .join("\n")}`,
            };
          }
        } else if (name === "getEvents") {
          if (apiResponse.error) {
            formattedResponse = {
              message: `Sorry, I couldn't get events for ${args.location}. ${apiResponse.error}`,
            };
          } else if (!apiResponse.length) {
            formattedResponse = {
              message: `No events found for ${args.location}.`,
            };
          } else {
            const eventListFormatted = apiResponse
              .map(
                (e, index) =>
                  `${index + 1}. ${e.title} - ${e.start_date} - ${
                    e.description
                      ? e.description.substring(0, 50) + "..."
                      : "No description available"
                  }`
              )
              .join("\n");

            formattedResponse = {
              message: `Here are some events in ${
                args.location
              }:\n\n${eventListFormatted.substring(0, 200)}`,
            };
          }
        } else if (name === "getFlights") {
          if (apiResponse.error) {
            formattedResponse = {
              message: `Sorry, I couldn't fetch flight details from ${args.departure} to ${args.arrival}. ${apiResponse.error}`,
            };
          } else if (!apiResponse.length) {
            formattedResponse = {
              message: `No flights found from ${args.departure} to ${args.arrival} on ${args.outd}.`,
            };
          } else {
            const flightListFormatted = apiResponse
              .map(
                (flight, index) =>
                  `${index + 1}. ${flight.airline} ${flight.flight_number} - ${
                    flight.departure
                  } ➝ ${flight.arrival}, Duration: ${flight.duration}, Class: ${
                    flight.travel_class || "N/A"
                  }`
              )
              .join("\n");

            formattedResponse = {
              message: `Here are some flights from ${args.departure} to ${
                args.arrival
              } on ${args.outd}:\n\n${flightListFormatted.substring(0, 200)}`,
            };
          }
        }

        const result2 = await chat.sendMessage([
          {
            function_response: {
              name: functionCall.name,
              response: formattedResponse,
            },
          },
        ]);

        console.log(
          " Gemini Full Response:",
          JSON.stringify(result2, null, 200)
        );
        const finalResponse =
          result2.response?.candidates?.[0]?.content?.parts?.[0]?.text;
        console.log(" Gemini Final Response:", finalResponse);
        return finalResponse || "No valid response.";
      } catch (error) {
        console.error(`${name} API Error:`, error);

        const errorResponse = {
          message: `Sorry, I couldn't get the ${
            name === "getWeather" ? "weather information" : "hotel information"
          } for ${args.city}. ${error.message || JSON.stringify(error)}`,
        };

        const result2 = await chat.sendMessage([
          {
            function_response: {
              name: functionCall.name,
              response: errorResponse,
            },
          },
        ]);

        const finalResponse =
          result2.response?.candidates?.[0]?.content?.parts?.[0]?.text;
        return finalResponse || `Error: Failed to get ${name} data.`;
      }
    } else {
      console.log(
        " No function calls detected:",
        result.response?.candidates?.[0]?.content?.parts
      );
      return (
        result.response?.candidates?.[0]?.content?.parts?.[0]?.text ||
        "No valid response."
      );
    }
  } catch (error) {
    console.error("Gemini API Error:", error);
    return `Error: ${error.message}`;
  }
}
export default chatWithGemini;
