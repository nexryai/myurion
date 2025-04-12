<script lang="ts">
    import { startRegistration } from "@simplewebauthn/browser";
    import { LoaderCircle } from "lucide-svelte";
    import { toast } from "svelte-sonner";

    import { Button } from "$lib/components/ui/button";
    import { Checkbox } from "$lib/components/ui/checkbox/index.js";
    import * as Dialog from "$lib/components/ui/dialog/index.js";
    import { Input } from "$lib/components/ui/input/index.js";
    import { Label } from "$lib/components/ui/label/index.js";

    let { isOpen = $bindable() } : {isOpen: boolean} = $props();

    let readyToSubmit = $state<boolean>(false);
    let isLoading = $state<boolean>(false);
    let name = $state<string>("");
    let terms = $state<boolean>(false);

    $effect(() => {
        readyToSubmit = name.length > 0 && terms;
    });

    const register = async() => {
        if (!readyToSubmit) {
            return;
        }

        isLoading = true;
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
            toast.error("Failed to sign up", {description: `${error}`, duration: 5000});
            isLoading = false;
            throw error;
        }

        fetch("/auth/verify-registration", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(attResp),
        }).then((response) => {
            if (!response.ok) {
                toast.error("Failed to sign up", {description: "An error occurred while signing up. Please try again later.", duration: 5000});
            } else {
                toast.success("Successfully signed up", {description: "Please sign in to continue.", duration: 5000});
                isOpen = false;
            }

            isLoading = false;
        });
    };
</script>

<Dialog.Root bind:open={isOpen}>
    <Dialog.Content class="sm:max-w-[500px]" escapeKeydownBehavior="ignore" interactOutsideBehavior="ignore">
        <Dialog.Header>
            <Dialog.Title>Sign Up</Dialog.Title>
            <Dialog.Description>
                Welcome! Sign up to start using the app.
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
                    disabled={!readyToSubmit || isLoading}
                    type="submit"
                    id="sign-up-submit-button"
                    onclick={() => {register();}}
            >
                {#if isLoading}
                    <LoaderCircle class="mr-2 h-4 w-4 animate-spin" />
                {/if}
                Register with Passkey
            </Button>
        </Dialog.Footer>
    </Dialog.Content>
</Dialog.Root>
