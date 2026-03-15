import logger from "@adonisjs/core/services/logger";
import { Job } from "@adonisjs/queue";
import type { JobOptions } from "@adonisjs/queue/types";
import { Monocle, span } from "@monocle.sh/adonisjs-agent";

interface WaterPlantsPayload {
	plantId: number;
	plantName: string;
}

export default class WaterPlants extends Job<WaterPlantsPayload> {
	static options: JobOptions = {
		queue: "default",
		maxRetries: 1,
		removeOnComplete: { age: "7d" },
		removeOnFail: { age: "7d" },
	};

	@span({ name: "job:WaterPlants" })
	async execute() {
		if (Math.random() < 0.3) {
			throw new Error("Random watering failure");
		}

		logger.info(this.payload, "Watering plant");
	}

	async failed(error: Error) {
		logger.error(this.payload, `WaterPlants failed: ${error.message}`);
		Monocle.captureException(error, {
			// user: { id: "123", email: "user@example.com" },
			tags: { component: "job:WaterPlants" },
			extra: { payload: this.payload },
		});
	}
}
