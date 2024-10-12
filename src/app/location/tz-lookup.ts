export async function tzLookup(lat: number, lng: number): Promise<string> {
  const tzLookup = await import('@photostructure/tz-lookup');
  return tzLookup.default(lat, lng);
}
