import type { IPublisher } from "./core";

export class GitHubPublisher implements IPublisher {
    publish(data: any): void {
        // GitHub publishing logic
        console.log("Publishing to GitHub:", data);
    }
}
