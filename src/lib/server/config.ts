import { type PublisherConfig, PublisherRemoteType, PublisherMetadataType } from "$lib/types";


export function getPublisherConfigsFromEnv(): Map<number, PublisherConfig> {
    const configs: PublisherConfig[] = [];
    let index = 1;

    while (true) {
        const remoteUrl = process.env[`SPECTRO_REMOTE_URL_${index}`];
        const remoteName = process.env[`SPECTRO_REMOTE_NAME_${index}`];
        const metaTemplate = process.env[`SPECTRO_MARKDOWN_META_TEMPLATE_${index}`];

        if (!remoteUrl || !remoteName || !metaTemplate) {
            break; // Stop if any of the required variables are missing
        }

        let remoteType: PublisherRemoteType;
        switch (remoteName.split(":")[0]) {
            case "github":
                remoteType = PublisherRemoteType.GITHUB;
                break;
            default:
                throw new Error(`Unknown remote type: ${remoteName}`);
        }

        const metadata: PublisherConfig["metadata"] = {};
        const metaEntries = metaTemplate.split(",").map(entry => entry.trim());

        for (const entry of metaEntries) {
            const [key, typeDefault] = entry.split(":");
            const [type, defaultValue] = typeDefault.includes(":")
                ? typeDefault.split(":")
                : [typeDefault, undefined];

            metadata[key] = {
                type: type as PublisherMetadataType,
                default: defaultValue !== undefined ? JSON.parse(defaultValue) : undefined,
            };
        }

        configs.push({
            type: remoteType,
            url: remoteUrl,
            name: remoteName,
            metadata,
        });

        index++;
    }

    return new Map(configs.map((config, idx) => [idx + 1, config]));
}