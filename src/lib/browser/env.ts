import { browser } from "$app/environment";

export function isSafari() {
    return browser ? /^((?!chrome|android).)*safari/i.test(navigator.userAgent) : false;
}
