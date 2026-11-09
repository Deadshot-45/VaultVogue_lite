import { NextRequest, NextResponse } from "next/server";

interface ReverseGeocodeRequest {
  latitude: number;
  longitude: number;
}

interface NominatimAddress {
  suburb?: string;
  neighbourhood?: string;
  residential?: string;
  city?: string;
  town?: string;
  village?: string;
  county?: string;
  state_district?: string;
  state?: string;
  postcode?: string;
  country?: string;
  country_code?: string;
}

interface NominatimResponse {
  address?: NominatimAddress;
  display_name?: string;
}

interface BigDataCloudResponse {
  locality?: string;
  city?: string;
  principalSubdivision?: string;
  postcode?: string;
  countryName?: string;
  countryCode?: string;
}

export async function POST(request: NextRequest) {
  try {
    const body: ReverseGeocodeRequest = await request.json();
    return await handleReverseGeocode(body.latitude, body.longitude);
  } catch {
    return NextResponse.json(
      { success: false, error: "Invalid JSON payload." },
      { status: 400 },
    );
  }
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const latStr = searchParams.get("lat") || searchParams.get("latitude");
  const lngStr =
    searchParams.get("lng") ||
    searchParams.get("lon") ||
    searchParams.get("longitude");

  if (!latStr || !lngStr) {
    return NextResponse.json(
      {
        success: false,
        error: "Missing latitude or longitude query parameters.",
      },
      { status: 400 },
    );
  }

  const lat = parseFloat(latStr);
  const lng = parseFloat(lngStr);

  return await handleReverseGeocode(lat, lng);
}

async function handleReverseGeocode(lat: number, lon: number) {
  // 1. Validate coordinates range
  if (
    typeof lat !== "number" ||
    typeof lon !== "number" ||
    Number.isNaN(lat) ||
    Number.isNaN(lon) ||
    lat < -90 ||
    lat > 90 ||
    lon < -180 ||
    lon > 180
  ) {
    return NextResponse.json(
      {
        success: false,
        error: "Invalid coordinates. Latitude must be -90..90 and longitude -180..180.",
      },
      { status: 400 },
    );
  }

  let postcode = "";
  let city = "";
  let district = "";
  let state = "";
  let locality = "";
  let country = "India";

  // 2. Try Nominatim (OpenStreetMap) with required User-Agent
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 6000);

  try {
    const nominatimRes = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lon}&zoom=18&addressdetails=1`,
      {
        signal: controller.signal,
        headers: {
          Accept: "application/json",
          "Accept-Language": "en",
          "User-Agent":
            "VaultVogueLuxuryStorefront/1.0 (client-serviceability@vaultvogue.atelier)",
        },
      },
    );

    if (nominatimRes.ok) {
      const nomData: NominatimResponse = await nominatimRes.json();
      const addr = nomData.address;
      if (addr) {
        postcode = addr.postcode?.trim().replace(/\s+/g, "") || "";
        city =
          addr.city ||
          addr.town ||
          addr.village ||
          addr.state_district ||
          addr.county ||
          "";
        district = addr.state_district || addr.county || city;
        state = addr.state || "";
        locality =
          addr.suburb ||
          addr.neighbourhood ||
          addr.residential ||
          addr.town ||
          "";
        country = addr.country || "India";
      }
    }
  } catch {
    // Fall back to secondary provider
  } finally {
    clearTimeout(timeoutId);
  }

  // 3. Fallback to BigDataCloud if postcode or city is missing
  if (!postcode || !city) {
    const bdcController = new AbortController();
    const bdcTimeout = setTimeout(() => bdcController.abort(), 5000);
    try {
      const bdcRes = await fetch(
        `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lon}&localityLanguage=en`,
        { signal: bdcController.signal },
      );
      if (bdcRes.ok) {
        const bdcData: BigDataCloudResponse = await bdcRes.json();
        if (!postcode && bdcData.postcode) {
          postcode = bdcData.postcode.trim().replace(/\s+/g, "");
        }
        if (!city && bdcData.city) {
          city = bdcData.city;
        }
        if (!state && bdcData.principalSubdivision) {
          state = bdcData.principalSubdivision;
        }
        if (!locality && bdcData.locality) {
          locality = bdcData.locality;
        }
      }
    } catch {
      // ignore
    } finally {
      clearTimeout(bdcTimeout);
    }
  }

  // 4. If we have a 6-digit Indian postcode, query India Post to get the official post offices list
  let postOffices: string[] = [];
  if (/^\d{6}$/.test(postcode)) {
    try {
      const postController = new AbortController();
      const postTimeout = setTimeout(() => postController.abort(), 4000);
      const postRes = await fetch(
        `https://api.postalpincode.in/pincode/${postcode}`,
        {
          signal: postController.signal,
          headers: { Accept: "application/json" },
        },
      );
      clearTimeout(postTimeout);

      if (postRes.ok) {
        const postJson = await postRes.json();
        if (
          Array.isArray(postJson) &&
          postJson[0]?.Status === "Success" &&
          Array.isArray(postJson[0]?.PostOffice)
        ) {
          const poList = postJson[0].PostOffice;
          postOffices = Array.from(
            new Set(
              poList
                .map((po: { Name?: string }) => po.Name?.trim())
                .filter((n: string | undefined): n is string => Boolean(n)),
            ),
          );
          if (!city && poList[0]?.District) {
            city = poList[0].District;
          }
          if (!district && poList[0]?.District) {
            district = poList[0].District;
          }
          if (!state && poList[0]?.State) {
            state = poList[0].State;
          }
        }
      }
    } catch {
      // Non-critical: continue with available fields
    }
  }

  if (locality && !postOffices.includes(locality)) {
    postOffices.unshift(locality);
  }

  if (!postcode && !city) {
    return NextResponse.json(
      {
        success: false,
        error:
          "Unable to resolve postal location from coordinates. Please enter your pincode manually.",
      },
      { status: 404 },
    );
  }

  return NextResponse.json(
    {
      success: true,
      pincode: postcode || undefined,
      city: city || district,
      district: district || city,
      state,
      locality: locality || (postOffices[0] ?? ""),
      postOffices,
      country,
      source: "current-location",
      isServiceable: true,
    },
    {
      headers: {
        "Cache-Control": "private, max-age=3600",
      },
    },
  );
}
