<script lang="ts">
    import '../app.css';
    let { children } = $props();

    import * as Sidebar from "$lib/components/ui/sidebar/index.js";

    import XWelcome from "$lib/components/XWelcome.svelte";
    import AuthDialog from "$lib/components/auth/AuthDialog.svelte";
    import { toast, Toaster } from "svelte-sonner";
    import { browser } from "$app/environment";
    import FatalErrorDialog from "$lib/components/error/FatalErrorDialog.svelte";
    import { signIn } from "$lib/browser/auth";

    import { type User } from "@prisma/client";
    import XSidebar from "$lib/components/XSidebar.svelte";

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
                description: `An error occurred while signing in. Please try again later.`,
            });
        }
    }

    const setUserInformation = async (res: Response) => {
        const user: User = await res.json();
        username = user.name ?? "User";
    }

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

{#if !isSignedIn}
    <XWelcome />
{:else }
    <Sidebar.Provider class="w-screen justify-center">
        <XSidebar username={username ?? "Loading..."} />
        <div class="w-full">
            {@render children()}
        </div>
    </Sidebar.Provider>

    <AuthDialog isOpen={tokenExpired} />
    <FatalErrorDialog isOpen={fatalErrorOccurred} errorDetails={errorDetails} />
{/if}

<Toaster />

<style>
    :global {
        @tailwind base;
        @layer base {
            :root {
                --background: 0 0% 100%;
                --foreground: 240 10% 3.9%;
                --card: 0 0% 100%;
                --card-foreground: 240 10% 3.9%;
                --popover: 0 0% 100%;;
                --popover-foreground: 240 10% 3.9%;
                --primary: 240 5.9% 10%;
                --primary-foreground: 0 0% 98%;
                --secondary: 240 4.8% 95.9%;
                --secondary-foreground: 240 5.9% 10%;
                --muted: 240 4.8% 95.9%;
                --muted-foreground: 240 3.8% 46.1%;
                --accent: 240 4.8% 95.9%;
                --accent-foreground: 240 5.9% 10%;
                --destructive: 0 72.22% 50.59%;
                --destructive-foreground: 0 0% 98%;
                --border: 240 5.9% 90%;
                --input: 240 5.9% 90%;
                --ring: 240 5.9% 10%;
                --radius: 0.5rem;

                --sidebar-background: 0 0% 100%;
                --sidebar-foreground: 240 5.3% 26.1%;
                --sidebar-primary: 240 5.9% 10%;
                --sidebar-primary-foreground: 0 0% 98%;
                --sidebar-accent: 0, 0%, 69%, 0.14;
                --sidebar-accent-foreground: 240 5.9% 10%;
                --sidebar-border: 220 13% 91%;
                --sidebar-ring: 217.2 91.2% 59.8%;
            }
            .dark {
                --background: 240 10% 3.9%;
                --foreground: 0 0% 98%;
                --card: 240 10% 3.9%;
                --card-foreground: 0 0% 98%;
                --popover: 240 10% 3.9%;
                --popover-foreground: 0 0% 98%;
                --primary: 0 0% 98%;
                --primary-foreground: 240 5.9% 10%;
                --secondary: 240 3.7% 15.9%;
                --secondary-foreground: 0 0% 98%;
                --muted: 240 3.7% 15.9%;
                --muted-foreground: 240 5% 64.9%;
                --accent: 240 3.7% 15.9%;
                --accent-foreground: 0 0% 98%;
                --destructive: 0 62.8% 30.6%;
                --destructive-foreground: 0 0% 98%;
                --border: 240 3.7% 15.9%;
                --input: 240 3.7% 15.9%;
                --ring: 240 4.9% 83.9%;

                --sidebar-background: 240 5.9% 10%;
                --sidebar-foreground: 240 4.8% 95.9%;
                --sidebar-primary: 224.3 76.3% 48%;
                --sidebar-primary-foreground: 0 0% 100%;
                --sidebar-accent: transparent;
                --sidebar-accent-foreground: 240 4.8% 95.9%;
                --sidebar-border: 240 3.7% 15.9%;
                --sidebar-ring: 217.2 91.2% 59.8%;
            }
        }

        @layer base {
            * {
                @apply border-border;
            }
            body {
                @apply bg-background text-foreground;
            }
        }

        .bg-sidebar {
            position: relative;
            background-color: rgba(255, 255, 255, 0.74);
        }

        .bg-sidebar:before {
            content: '';
            background-image: url('/photo-1660491630578-4299a3c09db0-navbar.webp');
            background-blend-mode: multiply, screen, overlay;
            background-size:cover;
            background-position:50%;
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            /*filter: blur(4px);*/
            z-index: -1;
        }
    }
</style>
