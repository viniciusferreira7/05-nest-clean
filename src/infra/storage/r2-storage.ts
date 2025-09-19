import { randomUUID } from "node:crypto";
import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import {
	Uploader,
	type UploadParams,
} from "@/domain/forum/application/storage/uploader";
import { EnvService } from "../env/env.service";

export class R2Storage implements Uploader {
	private client: S3Client;

	constructor(private readonly envService: EnvService) {
		const accountId = this.envService.get("CLOUDFLARE_ACCOUNT_ID");
		const accessKeyId = this.envService.get("AWS_ACCESS_KEY_ID");
		const secretAccessKey = this.envService.get("AWS_SECRETE_ACCESS_KEY_ID");

		this.client = new S3Client({
			endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
			region: "auto",
			credentials: {
				accessKeyId: accessKeyId,
				secretAccessKey: secretAccessKey,
			},
		});
	}

	async upload({
		fileName,
		fileType,
		body,
	}: UploadParams): Promise<{ url: string }> {
		const uploadId = randomUUID();
		const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
		const uniqueFile = `${uploadId}-${timestamp}-${fileName}`;

		const bucketName = this.envService.get("AWS_BUCKET_NAME");

		await this.client.send(
			new PutObjectCommand({
				Bucket: bucketName,
				Key: uniqueFile,
				ContentType: fileType,
				Body: body,
			}),
		);

		return { url: uniqueFile };
	}
}
