import logger from "@adonisjs/core/services/logger";
import { Job } from "@adonisjs/queue";
import type { JobOptions } from "@adonisjs/queue/types";

interface WaterPlantsPayload {
	plantId: number;
	plantName: string;
}

export default class WaterPlants extends Job<WaterPlantsPayload> {
	static options: JobOptions = {
		queue: "default",
		maxRetries: 3,
		removeOnComplete: { age: "7d" },
	};

	async execute() {
		logger.info(this.payload, "Watering plant");
	}

	async failed(error: Error) {
		logger.error(this.payload, `WaterPlants failed: ${error.message}`);
	}
}
