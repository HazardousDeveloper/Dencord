import * as Colors from "https://deno.land/std/fmt/colors.ts";

export function log(message: string) {
    console.log(Colors.green("[Dencord] ") + message);
}

export function warning(message: string) {
    console.log(Colors.yellow("[Dencord] ") + message);
}

export function error(message: string) {
    console.log(Colors.red("[Dencord] ") + message);
}