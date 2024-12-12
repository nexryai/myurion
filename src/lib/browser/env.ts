import { browser } from "$app/environment";

const browserIsSafari = browser ? /^((?!chrome|android).)*safari/i.test(navigator.userAgent) : false;

export function isSafari(): boolean {
    return browserIsSafari;
}
