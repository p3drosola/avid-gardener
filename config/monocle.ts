import { defineConfig } from "@monocle.sh/adonisjs-agent";
import env from "#start/env";

export default defineConfig({
	apiKey: env.get("MONOCLE_API_KEY"),

	serviceName: env.get("APP_NAME"),
	serviceVersion: env.get("APP_VERSION"),
	environment: env.get("APP_ENV"),

	// debug: true,
});
