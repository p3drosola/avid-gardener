import db from "@adonisjs/lucid/services/db";
import { DateTime } from "luxon";
import type { HttpContext } from "@adonisjs/core/http";

function formatEpoch(ms: number | null): string {
	if (!ms) return "—";
	return DateTime.fromMillis(ms).toFormat("MMM d, yyyy HH:mm:ss");
}

export default class JobsController {
	async index({ view, request }: HttpContext) {
		const page = request.input("page", 1);
		const tab = request.input("tab", "scheduled");

		// these queries are not optimized for performance, but they work for demonstration purposes. In a real app, you would want to optimize these queries and paginate them properly.
		const schedules = await db
			.from("queue_schedules")
			.select("*")
			.orderBy("created_at", "desc");

		const completedJobs = await db
			.from("queue_jobs")
			.select("*")
			.where("status", "completed")
			.orderBy("finished_at", "desc")
			.paginate(page, 20);

		const failedJobs = await db
			.from("queue_jobs")
			.select("*")
			.where("status", "failed")
			.orderBy("finished_at", "desc")
			.paginate(page, 20);

		const pendingJobs = await db
			.from("queue_jobs")
			.select("*")
			.whereIn("status", ["pending", "active"])
			.orderBy("score", "desc")
			.paginate(page, 20);

		return view.render("pages/jobs/index", {
			schedules,
			completedJobs,
			failedJobs,
			pendingJobs,
			tab,
			formatEpoch,
		});
	}
}
