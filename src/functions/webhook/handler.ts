import "source-map-support/register";

import type { ValidatedEventAPIGatewayProxyEvent } from "@libs/apiGateway";
import { middyfy } from "@libs/lambda";
import { responseHandler } from "../../utils/lambda-response.util";
import ValidateMailgunWebhook from "../../utils/validateMailgun.util";
import database from "../../services/database.services";
import sns from "../../services/sns.services";
import { SnsMessageType } from "../../types/sns.types";
import schema from "./schema";
import config from "../../config/config.env";

const webhook: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (
	event
) => {
	try {
		if (!event.body) {
			return responseHandler(500, "Error: Provide a valid event body");
		}

		const eventBody = event.body;
		const { timestamp, token, signature } = eventBody.signature;

		const isValid: boolean = ValidateMailgunWebhook.isValid({
			timestamp,
			token,
			signature,
		});

		if (!isValid) {
			return responseHandler(
				500,
				"Error: Webhook with wrong credential not allowed"
			);
		}

		await database.save(eventBody);

		const snsPayload: SnsMessageType = {
			Provider: config.MESSAGE_PROVIDER,
			timestamp: eventBody["event-data"].timestamp,
			type: eventBody["event-data"].event,
		};

		await sns.publishToSns(snsPayload);

		return responseHandler(200, "Event received and published to sns");
	} catch (ex) {
		console.log({ ex });
		return responseHandler(500, ex.message);
	}
};

export const main = middyfy(webhook);
