import './globals.css'

export const metadata = {
  title: 'CourseCompass',
  description: 'Rate courses and professors at AWC',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}