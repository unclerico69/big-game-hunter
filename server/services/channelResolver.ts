import { db } from "../db";
import { channelMappings, tvProviders } from "@shared/schema";
import { eq } from "drizzle-orm";

/**
 * Channel Resolution Service
 * 
 * Resolves broadcast networks to channel numbers based on the venue's TV provider.
 * Handles graceful fallback when mappings are missing.
 */

// Network priority order for resolution (prefer national networks)
const NETWORK_PRIORITY = [
  "ESPN",
  "FOX",
  "TNT",
  "CBS",
  "NBC",
  "ABC",
  "ESPN2",
  "FS1",
  "TBS",
  "CBSSN",
  "NFL Network",
  "NBA TV",
  "MLB Network",
  "NHL Network"
];

export interface ResolvedChannel {
  network: string;
  channelNumber: string | null;
  resolved: boolean;
}

export interface ChannelResolutionResult {
  resolvedNetwork: string | null;
  resolvedChannelNumber: string | null;
  allMappings: ResolvedChannel[];
  explanation: string;
}

/**
 * Get all channel mappings for a provider
 */
export async function getProviderMappings(providerId: number): Promise<Map<string, string>> {
  const mappings = await db.select()
    .from(channelMappings)
    .where(eq(channelMappings.providerId, providerId));
  
  const map = new Map<string, string>();
  for (const m of mappings) {
    map.set(m.network.toUpperCase(), m.channelNumber);
  }
  return map;
}

/**
 * Normalize network name for matching
 */
function normalizeNetwork(network: string): string {
  return network.toUpperCase().trim();
}

/**
 * Resolve game broadcast networks to channel number
 * 
 * @param broadcastNetworks - Array of networks the game is on (e.g., ["ESPN", "ESPN2"])
 * @param providerId - The venue's TV provider ID (null if not set)
 * @returns Resolution result with channel number and explanation
 */
export async function resolveChannel(
  broadcastNetworks: string[],
  providerId: number | null
): Promise<ChannelResolutionResult> {
  // No provider set - can't resolve
  if (!providerId) {
    return {
      resolvedNetwork: broadcastNetworks[0] || null,
      resolvedChannelNumber: null,
      allMappings: broadcastNetworks.map(n => ({ network: n, channelNumber: null, resolved: false })),
      explanation: "No TV provider configured"
    };
  }
  
  // Get mappings for this provider
  const mappings = await getProviderMappings(providerId);
  
  if (mappings.size === 0) {
    return {
      resolvedNetwork: broadcastNetworks[0] || null,
      resolvedChannelNumber: null,
      allMappings: broadcastNetworks.map(n => ({ network: n, channelNumber: null, resolved: false })),
      explanation: "No channel mappings for provider"
    };
  }
  
  // Sort networks by priority
  const sortedNetworks = [...broadcastNetworks].sort((a, b) => {
    const aIndex = NETWORK_PRIORITY.indexOf(a.toUpperCase());
    const bIndex = NETWORK_PRIORITY.indexOf(b.toUpperCase());
    const aPriority = aIndex === -1 ? 999 : aIndex;
    const bPriority = bIndex === -1 ? 999 : bIndex;
    return aPriority - bPriority;
  });
  
  // Build resolution for all networks
  const allMappings: ResolvedChannel[] = sortedNetworks.map(network => {
    const normalized = normalizeNetwork(network);
    const channelNumber = mappings.get(normalized) || null;
    return {
      network,
      channelNumber,
      resolved: channelNumber !== null
    };
  });
  
  // Find first resolved network
  const firstResolved = allMappings.find(m => m.resolved);
  
  if (firstResolved) {
    return {
      resolvedNetwork: firstResolved.network,
      resolvedChannelNumber: firstResolved.channelNumber,
      allMappings,
      explanation: `Available on ${firstResolved.network} (Channel ${firstResolved.channelNumber})`
    };
  }
  
  // No mapping found
  return {
    resolvedNetwork: broadcastNetworks[0] || null,
    resolvedChannelNumber: null,
    allMappings,
    explanation: `${broadcastNetworks[0] || 'Network'} • Channel unavailable`
  };
}

/**
 * Get all TV providers
 */
export async function getAllProviders() {
  return await db.select().from(tvProviders).orderBy(tvProviders.name);
}

/**
 * Seed initial providers and channel mappings
 */
export async function seedProviderData() {
  // Check if already seeded
  const existing = await db.select().from(tvProviders);
  if (existing.length > 0) {
    console.log("[ChannelResolver] Providers already seeded");
    return;
  }
  
  console.log("[ChannelResolver] Seeding TV providers and channel mappings...");
  
  // Seed providers
  const providers = [
    { name: "Comcast Xfinity", country: "US" },
    { name: "DirecTV", country: "US" },
    { name: "Spectrum", country: "US" },
    { name: "YouTube TV", country: "US" }
  ];
  
  const insertedProviders = await db.insert(tvProviders).values(providers).returning();
  
  // Major network channel mappings by provider
  const networkMappings: Record<string, Record<string, string>> = {
    "Comcast Xfinity": {
      "ESPN": "206",
      "ESPN2": "209",
      "FOX": "12",
      "CBS": "3",
      "NBC": "10",
      "ABC": "6",
      "TNT": "215",
      "TBS": "217",
      "FS1": "219",
      "CBSSN": "221",
      "NFL Network": "402",
      "NBA TV": "403",
      "MLB Network": "404",
      "NHL Network": "405"
    },
    "DirecTV": {
      "ESPN": "206",
      "ESPN2": "209",
      "FOX": "4",
      "CBS": "2",
      "NBC": "5",
      "ABC": "7",
      "TNT": "245",
      "TBS": "247",
      "FS1": "219",
      "CBSSN": "221",
      "NFL Network": "212",
      "NBA TV": "216",
      "MLB Network": "213",
      "NHL Network": "215"
    },
    "Spectrum": {
      "ESPN": "33",
      "ESPN2": "34",
      "FOX": "5",
      "CBS": "2",
      "NBC": "4",
      "ABC": "7",
      "TNT": "47",
      "TBS": "48",
      "FS1": "68",
      "CBSSN": "69",
      "NFL Network": "98",
      "NBA TV": "99",
      "MLB Network": "100",
      "NHL Network": "101"
    },
    "YouTube TV": {
      "ESPN": "ESPN",
      "ESPN2": "ESPN2",
      "FOX": "FOX",
      "CBS": "CBS",
      "NBC": "NBC",
      "ABC": "ABC",
      "TNT": "TNT",
      "TBS": "TBS",
      "FS1": "FS1",
      "CBSSN": "CBSSN",
      "NFL Network": "NFL Network",
      "NBA TV": "NBA TV",
      "MLB Network": "MLB Network",
      "NHL Network": "NHL Network"
    }
  };
  
  // Insert channel mappings
  for (const provider of insertedProviders) {
    const mappings = networkMappings[provider.name];
    if (mappings) {
      const values = Object.entries(mappings).map(([network, channelNumber]) => ({
        providerId: provider.id,
        network,
        channelNumber
      }));
      await db.insert(channelMappings).values(values);
    }
  }
  
  console.log("[ChannelResolver] Seeded", insertedProviders.length, "providers with channel mappings");
}
