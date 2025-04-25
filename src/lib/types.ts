
export enum PublisherRemoteType {
    GITHUB = "github",
}

export enum PublisherMetadataType {
    string = "string",
    number = "number",
    boolean = "boolean",
    stringArray = "string[]",
}

export type PublisherConfig = {
    type: PublisherRemoteType;
    url: string;
    name: string;
    metadata: {
        [key: string]: {
            type: PublisherMetadataType;
            default?: any;
        };
    };
}