import { NextRequest, NextResponse } from "next/server";

export interface PostOfficeRaw {
  Name: string;
  Description: string | null;
  BranchType: string;
  DeliveryStatus: string;
  Circle: string;
  District: string;
  Division: string;
  Region: string;
  Block: string;
  State: string;
  Country: string;
  Pincode: string;
}

export interface IndiaPostResponse {
  Message: string;
  Status: "Success" | "Error";
  PostOffice: PostOfficeRaw[] | null;
}

// In-memory cache for pincode lookup (prevents hitting postal API repeatedly)
const pincodeCache = new Map<
  string,
  {
    timestamp: number;
    data: {
      success: boolean;
      pincode: string;
      city: string;
      district: string;
      state: string;
      country: string;
      postOffices: string[];
      isServiceable: boolean;
    };
  }
>();

const CACHE_TTL_MS = 1000 * 60 * 60 * 24; // 24 hours

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ pincode: string }> },
) {
  const { pincode } = await context.params;
  const cleanPin = pincode?.trim() || "";

  // 1. Strict numeric 6-digit validation
  if (!/^\d{6}$/.test(cleanPin)) {
    return NextResponse.json(
      {
        success: false,
        error: "Invalid pincode format. Exactly 6 digits required.",
      },
      { status: 400 },
    );
  }

  // 2. Check in-memory cache
  const cached = pincodeCache.get(cleanPin);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL_MS) {
    return NextResponse.json(cached.data, {
      headers: {
        "Cache-Control": "public, s-maxage=86400, stale-while-revalidate=604800",
        "X-Cache": "HIT",
      },
    });
  }

  // 3. Query India Post API
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 7000);

  try {
    const upstreamRes = await fetch(
      `https://api.postalpincode.in/pincode/${cleanPin}`,
      {
        signal: controller.signal,
        headers: {
          Accept: "application/json",
          "User-Agent": "VaultVogue-Storefront/1.0",
        },
      },
    );

    clearTimeout(timeoutId);

    if (!upstreamRes.ok) {
      return NextResponse.json(
        {
          success: false,
          error: `Upstream postal service returned HTTP ${upstreamRes.status}.`,
        },
        { status: 502 },
      );
    }

    const json: IndiaPostResponse[] = await upstreamRes.json();

    if (
      !Array.isArray(json) ||
      json.length === 0 ||
      json[0].Status !== "Success" ||
      !Array.isArray(json[0].PostOffice) ||
      json[0].PostOffice.length === 0
    ) {
      return NextResponse.json(
        {
          success: false,
          error: `No postal circles found for pincode ${cleanPin}.`,
        },
        { status: 404 },
      );
    }

    const postOfficesRaw = json[0].PostOffice;
    const primary = postOfficesRaw[0];

    // Deduplicate post office / locality names
    const postOffices = Array.from(
      new Set(
        postOfficesRaw
          .map((po) => po.Name?.trim())
          .filter((name): name is string => Boolean(name)),
      ),
    );

    const city = primary.District || primary.Division || primary.Block || "";
    const district = primary.District || city;
    const state = primary.State || "";
    const country = primary.Country || "India";

    const responseData = {
      success: true,
      pincode: cleanPin,
      city,
      district,
      state,
      country,
      postOffices,
      isServiceable: true,
    };

    // Cache result
    pincodeCache.set(cleanPin, {
      timestamp: Date.now(),
      data: responseData,
    });

    return NextResponse.json(responseData, {
      headers: {
        "Cache-Control": "public, s-maxage=86400, stale-while-revalidate=604800",
        "X-Cache": "MISS",
      },
    });
  } catch (err: unknown) {
    clearTimeout(timeoutId);
    const isTimeout =
      err instanceof Error &&
      (err.name === "AbortError" || err.message.includes("aborted"));

    return NextResponse.json(
      {
        success: false,
        error: isTimeout
          ? "Postal directory lookup timed out. Please try again."
          : "Failed to connect to postal directory.",
      },
      { status: 504 },
    );
  }
}
