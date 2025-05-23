import { sveltekit } from "@sveltejs/kit/vite";
import tailwindcss from "@tailwindcss/vite";
import MagicString from "magic-string";
import { defineConfig } from "vitest/config";

// see https://github.com/tabler/tabler-icons/issues/669#issuecomment-1993756128
function tablerSvelteImportOptimizer(): import("vite").Plugin {
    return {
        name: "tabler-svelte-optimizer",
        transform(code, id) {
            const ms = new MagicString(code, { filename: id });
            ms.replace(
                /([ \t]*)import\s+\{([^;]*?)}\s+from\s+['"]@tabler\/icons-svelte['"];?/g,
                (match, whitespace: string, importNames: string) => {
                    const hasSemi = match.endsWith(";");
                    const imports = importNames
                        .split(",")
                        .map((v) => v.trim())
                        .map((name) => {
                            // example: IconArrowRightBar
                            //old: import {IconArrowRightBar} from '@tabler/icons-svelte';
                            //new: import IconArrowRightBar from '@tabler/icons-svelte/icons/arrow-right-bar';

                            //IconArrowRightBar ---> arrow-right-bar
                            //IconAlignLeft2 ---> align-left-2
                            //IconBadge3dFill ---> badge-3d-fill
                            //IconNumber123 ---> number-123
                            const newName = name.replace(/([A-Z]|[0-9]+)/g, "-$1").toLowerCase().slice(6);
                            // console.log(`${name} ---> ${newName}`);
                            return `${whitespace}import ${name} from '@tabler/icons-svelte/icons/${newName}'${hasSemi ? ";" : ""}`;
                        });
                    return imports.join("\n");
                }
            );

            if (ms.hasChanged()) {
                return {
                    code: ms.toString(),
                    map: ms.generateMap()
                };
            }
        }
    };
}

export default defineConfig({
    plugins: [
        tablerSvelteImportOptimizer(),
        sveltekit(),
        tailwindcss(),
    ],

    test: {
        include: ["src/**/*.{test,spec}.{js,ts}"]
    }
});
