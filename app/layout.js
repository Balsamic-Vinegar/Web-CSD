import "./globals.css"

export const metadata = {
  title: "Web CSD prototype",
  description: "A web-based implementation of the consensus sleep diary",
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full">{children}</body>
    </html>
  )
}
