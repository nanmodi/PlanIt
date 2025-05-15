import dotenv from "dotenv";
import { fileURLToPath } from "url";
import { dirname, resolve } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: resolve(__dirname, "../.env") });
import { getJson } from "serpapi";

export async function getEvents(location) {
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

        const events = json.events_results.map((event) => {
          const venue = event.venue || {};
          return {
            title: event.title,
            image:event.thumbnail || "Image not available",
            date: event.date?.when || "Date not available",
            start_date: event.date?.start_date || "Start date not available",
            address: event.address || "Address not available",
            link: event.link || "Link not available",
            description: event.description || "No description available",
            venue: venue.name || "Venue not available",
            venue_rating: venue.rating || "Rating not available",
            venue_link: venue.link || "Link not available",
            event_location:
              event.event_location_map?.link || "Location not available",
          };
          
        });
        console.log('event process');
        console.log(events);
        resolve(events);
      }
    );
  });
}
