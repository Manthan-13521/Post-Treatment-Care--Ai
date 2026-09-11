import type { Metadata,Viewport } from "next";
import Link from "next/link";
import "./styles.css";
export const metadata: Metadata = { title: "CareShield AI", description: "Secure remote patient monitoring" };
export const viewport: Viewport = { themeColor:"#087e75",width:"device-width",initialScale:1 };
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body><a className="skip" href="#content">Skip to content</a><header><Link className="brand" href="/">CareShield <span>AI</span></Link><nav aria-label="Primary navigation"><Link href="/dashboard">Workspace</Link><Link href="/demo">Demo</Link><Link href="/sign-in">Sign in</Link></nav></header><main id="content">{children}</main></body></html>;
}
