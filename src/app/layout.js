import { Plus_Jakarta_Sans, Caveat } from "next/font/google";
import { CartProvider } from "@/components/cart/CartProvider";
import "./globals.css";

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

const caveat = Caveat({
  variable: "--font-caveat",
  subsets: ["latin"],
  weight: ["600"],
});

export const metadata = {
  title: "HealthPlus — Better Health, Brighter Tomorrow",
  description:
    "Quality medicines, wellness products and expert care — all in one place. Genuine products, fast nationwide delivery and pharmacist support.",
};

export const viewport = {
  themeColor: "#06140f",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${jakarta.variable} ${caveat.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">
        {/* Shared across routes so the cart persists between pages (and reloads, via localStorage). */}
        <CartProvider>{children}</CartProvider>
      </body>
    </html>
  );
}
