import dotenv from "dotenv";
import { fileURLToPath } from "url";
import { dirname, resolve } from "path";
import dayjs from "dayjs";
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: resolve(__dirname, "../.env") });
import { getJson } from "serpapi";

export async function getHotels(
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
        console.log(json)
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
            reviews: hotel.reviews || 0,
            link: hotel.link || "Link not available",
            image: hotel.images && hotel.images.length > 0 ? hotel.images[0].thumbnail : "Image not available"
          };
        });

        resolve(hotels);
      }
    );
  });
}

