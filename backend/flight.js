import dotenv from "dotenv";
dotenv.config();
import { getJson } from "serpapi";

const cityToIATAMap = {
  // USA
  "New York": "JFK",
  Newark: "EWR",
  "Los Angeles": "LAX",
  "San Francisco": "SFO",
  Chicago: "ORD",
  Atlanta: "ATL",
  Dallas: "DFW",
  Miami: "MIA",
  Boston: "BOS",
  "Las Vegas": "LAS",
  Seattle: "SEA",
  "Washington DC": "IAD",
  Houston: "IAH",

  // Canada
  Toronto: "YYZ",
  Vancouver: "YVR",
  Montreal: "YUL",
  Calgary: "YYC",

  // Europe
  London: "LHR",
  "London Gatwick": "LGW",
  Paris: "CDG",
  Frankfurt: "FRA",
  Munich: "MUC",
  Berlin: "BER",
  Zurich: "ZRH",
  Vienna: "VIE",
  Amsterdam: "AMS",
  Madrid: "MAD",
  Barcelona: "BCN",
  Rome: "FCO",
  Milan: "MXP",
  Copenhagen: "CPH",
  Stockholm: "ARN",
  Oslo: "OSL",
  Helsinki: "HEL",
  Lisbon: "LIS",
  Istanbul: "IST",
  Moscow: "SVO",

  // Asia
  Dubai: "DXB",
  "Abu Dhabi": "AUH",
  Doha: "DOH",
  Singapore: "SIN",
  "Tokyo Haneda": "HND",
  "Tokyo Narita": "NRT",
  Seoul: "ICN",
  "Hong Kong": "HKG",
  Beijing: "PEK",
  Shanghai: "PVG",
  Bangkok: "BKK",
  Jakarta: "CGK",
  "Kuala Lumpur": "KUL",
  Taipei: "TPE",
  Manila: "MNL",

  "New Delhi": "DEL",
  Mumbai: "BOM",
  Bangalore: "BLR",
  Chennai: "MAA",
  Hyderabad: "HYD",
  Kolkata: "CCU",
  Kochi: "COK",
  Pune: "PNQ",
  Ahmedabad: "AMD",
  Goa: "GOI",
  Jaipur: "JAI",
  Lucknow: "LKO",
  Thiruvananthapuram: "TRV",
  Varanasi: "VNS",
  Bhubaneswar: "BBI",
  Chandigarh: "IXC",
  Jammu: "IXJ",
  Srinagar: "SXR",
  Siliguri: "IXB",
  Patna: "PAT",
  Madurai: "IXM",
  Visakhapatnam: "VTZ",
  Guwahati: "GAU",
  Mangalore: "IXE",
  Nagpur: "NAG",
  Rajahmundry: "RJA",

  Sydney: "SYD",
  Melbourne: "MEL",
  Brisbane: "BNE",
  Auckland: "AKL",
  Wellington: "WLG",

  // South America
  "São Paulo": "GRU",
  "Rio de Janeiro": "GIG",
  "Buenos Aires": "EZE",
  Santiago: "SCL",
  Bogotá: "BOG",
  Lima: "LIM",
  "Mexico City": "MEX",

  Johannesburg: "JNB",
  "Cape Town": "CPT",
  Cairo: "CAI",
  Nairobi: "NBO",
  Lagos: "LOS",
  Casablanca: "CMN",

  Riyadh: "RUH",
  Jeddah: "JED",
  "Kuwait City": "KWI",
};

function getIATACode(city) {
  return cityToIATAMap[city] || "IATA code not found";
}
export function getFlight(departure, arrival, outd, retd) {
  return new Promise((resolve, reject) => {
    const dep = getIATACode(departure);
    const arr = getIATACode(arrival);
    console.log("Departure:", dep, "Arrival:", arr); // Debugging log
    if (dep === "IATA code not found" || arr === "IATA code not found") {
      return reject("Invalid departure or arrival city.");
    }

    if (!process.env.SERP_API) {
      return reject("API key missing.");
    }

    getJson(
      {
        engine: "google_flights",
        departure_id: dep,
        arrival_id: arr,
        outbound_date: outd,
        return_date: retd,
        currency: "USD",
        hl: "en",
        api_key: process.env.SERP_API,
      },
      (json) => {
        if (!json) {
          return reject("No response from API.");
        }

        if (json.error) {
          return reject(`API Error: ${json.error}`);
        }

        if (!Array.isArray(json.best_flights)) {
          return reject("Unexpected API response format.");
        }

        const flights = json.best_flights.map((flight) => {
          const firstLeg = flight.flights?.[0] || {};
          return {
            airline: firstLeg.airline || "Unknown Airline",
            flight_number: firstLeg.flight_number || "N/A",
            departure: firstLeg.departure_airport || "Unknown Airport",
            arrival: firstLeg.arrival_airport || "Unknown Airport",
            departure_time: firstLeg.departure_time || "Time not available",
            arrival_time: firstLeg.arrival_time || "Time not available",
            duration: firstLeg.duration || "Duration not available",

            price: flight.price || "Price not available",
          };
        });

        if (flights.length === 0) {
          return reject("No flight details available.");
        }

        resolve(flights);
      }
    );
  });
}
