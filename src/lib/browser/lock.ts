const beforeUnloadListener = (event: any) => {
    event.preventDefault();
    event.returnValue = "";
};

export function preventUnload() {
    // リスナーを追加
    window.addEventListener("beforeunload", beforeUnloadListener);
}

export function allowUnload() {
    // リスナーを削除
    window.removeEventListener("beforeunload", beforeUnloadListener);
}
