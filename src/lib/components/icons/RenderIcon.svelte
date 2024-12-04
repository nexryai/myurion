<script lang="ts">
    import { userSelectableIcons } from "./icons"; // アイコンリストをimport

    let {
        iconName,
        size
    }: {
        iconName: string;
        size: number;
    } = $props();

    const selectedIcon = userSelectableIcons.find(icon => icon.name === iconName);

    // innerHTML を設定するためのアクション
    function setHTML(node: HTMLElement, html: string) {
        node.innerHTML = html;
        return {
            update(newHTML: string) {
                if (newHTML !== html) {
                    html = newHTML;
                    node.innerHTML = html;
                }
            }
        };
    }
</script>

<div>
    {#if selectedIcon}
        <div
                class="rendered-icons"
                style="--icon-size: {size}px;"
                use:setHTML={selectedIcon.svg}
        ></div>
    {:else}
        <p class="hidden">アイコンが選択されていません。</p>
    {/if}
</div>

<style lang="scss">
    :global {
        .rendered-icons {
            > .icon {
                width: var(--icon-size, 24px);
                height: var(--icon-size, 24px);
            }
        }
    }
</style>
