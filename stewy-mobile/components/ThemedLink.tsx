import { ThemedText, ThemedTextProps } from "./ThemedText"
import { Href, Link, Slot } from "expo-router"

export type ThemedLinkProps = ThemedTextProps & {
    to: Href
}

export function ThemedLink({to, ...otherProps}: ThemedLinkProps) {
    return (
        <Link href={to}><ThemedText {...otherProps}></ThemedText></Link>
    )
}