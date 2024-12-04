<script lang="ts">
    import * as Dialog from "$lib/components/ui/dialog/index.js";
    import { Input } from "$lib/components/ui/input/index.js";
    import { Label } from "$lib/components/ui/label/index.js";
    import { Checkbox } from "$lib/components/ui/checkbox/index.js";
    import { Button } from "$lib/components/ui/button";
    import { startRegistration } from "@simplewebauthn/browser";

    let { isOpen = $bindable() } : {isOpen: boolean} = $props();

    let readyToSubmit = $state<boolean>(false);
    let name = $state<string>("");
    let terms = $state<boolean>(false);

    $effect(() => {
        readyToSubmit = name.length > 0 && terms;
    });

    async function register() {
        if (!readyToSubmit) {
            return;
        }

        const resp = await fetch("/auth/register-request", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ displayName: name })
        });

        const passkeyOptions = await resp.json();
        let attResp;
        try {
            // Pass the options to the authenticator and wait for a response
            attResp = await startRegistration({ optionsJSON: passkeyOptions });
        } catch (error) {
            alert("Error registering passkey");
            throw error;
        }

        const verificationResp = await fetch("/auth/verify-registration", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(attResp),
        });

        const verificationResult = await verificationResp.json();
        console.log(verificationResult);
    }


</script>

<Dialog.Root bind:open={isOpen}>
    <Dialog.Content class="sm:max-w-[500px]" escapeKeydownBehavior="ignore" interactOutsideBehavior="ignore">
        <Dialog.Header>
            <Dialog.Title>Sing Up to Goshenite</Dialog.Title>
            <Dialog.Description>
                Welcome to Goshenite! Sign up to start using the app.
            </Dialog.Description>
        </Dialog.Header>
        <div class="grid gap-4 py-4">
            <div class="grid grid-cols-4 items-center gap-4">
                <Label for="name" class="text-right">Display name</Label>
                <Input
                        id="name"
                        placeholder="Raiden"
                        class="col-span-3"
                        required
                        bind:value={name}
                />
            </div>
        </div>
        <div class="flex items-start">
            <Checkbox id="terms" bind:checked={terms}/>
            <Label for="terms" class="ml-2 text-indent-[-1.25rem] pl-5">
                I accept the software license and the following terms: THIS SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND.
            </Label>
        </div>
        <Dialog.Footer>
            <Button
                    disabled={!readyToSubmit}
                    type="submit"
                    onclick={() => {register();}}
            >
                Passkey to finish signing up
            </Button>
        </Dialog.Footer>
    </Dialog.Content>
</Dialog.Root>
