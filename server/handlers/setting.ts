import { json } from "itty-router";
import { DEFAULT_SETTINGS } from "@/shared/types";
import type { AppSettings } from "@/shared/types";
const SETTINGS_KEY = "settings";

export async function handleGetSettings(request: Request, env: Env) {
  const stored = await env.SETTINGS_KV.get<AppSettings>(SETTINGS_KEY, "json");
  return json(stored ?? DEFAULT_SETTINGS);
}

export async function handlePutSettings(request: Request, env: Env) {
  const body = await request.json<Partial<AppSettings>>();
  const current =
    (await env.SETTINGS_KV.get<AppSettings>(SETTINGS_KEY, "json")) ??
    DEFAULT_SETTINGS;
  const updated: AppSettings = {
    download_threshold_mbps:
      body.download_threshold_mbps ?? current.download_threshold_mbps,
    poll_interval: body.poll_interval ?? current.poll_interval,
  };
  await env.SETTINGS_KV.put(SETTINGS_KEY, JSON.stringify(updated));
  return json(updated);
}
