<script lang="ts">
    import "../app.css";
    let { children } = $props();


    import { browser } from "$app/environment";

    import { toast, Toaster } from "svelte-sonner";

    import { signIn } from "$lib/browser/auth";
    import XSidebar from "$lib/components/XSidebar.svelte";
    import XWelcome from "$lib/components/XWelcome.svelte";
    import AuthDialog from "$lib/components/auth/AuthDialog.svelte";
    import FatalErrorDialog from "$lib/components/error/FatalErrorDialog.svelte";
    import * as Sidebar from "$lib/components/ui/sidebar/index.js";
    import { type User } from "@prisma/client";
    import { callApi } from "$lib/browser/api";

    // states
    let tokenExpired = $state(false);
    let fatalErrorOccurred = $state(false);
    let errorDetails = $state<string | undefined>(undefined);
    let username = $state<string | undefined>(undefined);

    const isSignedIn = browser ? localStorage.getItem("isLoggedIn") === "true" : true;

    const tryAuthenticate = async () => {
        try {
            await signIn();
            toast.success("Successfully signed in", {
                description: "You have successfully signed in.",
            });

            location.reload();
        } catch (error) {
            console.error(error);
            toast.error("Failed to sign in", {
                description: "An error occurred while signing in. Please try again later.",
            });
        }
    };

    const setUserInformation = async (res: Response) => {
        const user: User = await res.json();
        username = user.name ?? "User";
    };

    if (browser && isSignedIn) {
        // fetch user data
        fetch("/api/me").then((res) => {
            if (res.status === 401) {
                tokenExpired = true;
                tryAuthenticate();
            } else if (!res.ok) {
                throw new Error("Failed to fetch user data");
            }

            setUserInformation(res);
        }).catch((error) => {
            console.error(error);
            fatalErrorOccurred = true;
            errorDetails = "INITIAL_FETCH_FAILED";
        });
    }
</script>

<svelte:head>
    <title>Myurion Note</title>
</svelte:head>

{#if !isSignedIn}
    <XWelcome />
{:else }
    <Sidebar.Provider class="w-screen justify-center" id="myurion-app-sidebar">
        <XSidebar username={username ?? "Loading..."} />
        <div class="w-full">
            {@render children()}
        </div>
    </Sidebar.Provider>

    <AuthDialog isOpen={tokenExpired} />
    <FatalErrorDialog isOpen={fatalErrorOccurred} errorDetails={errorDetails} />
{/if}

<Toaster />
