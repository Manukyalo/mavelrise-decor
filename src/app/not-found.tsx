import Link from "next/link";

export default function NotFound() {
  return (
    <html lang="en">
      <body className="bg-[#0A0B0D] text-[#FAF9F5] min-h-screen flex items-center justify-center p-6 font-sans">
        <div className="max-w-md text-center space-y-6">
          <div className="text-xs font-mono tracking-widest text-[#F25C05] uppercase">
            404 • Spatial Coordinates Not Found
          </div>
          <h1 className="text-4xl font-serif uppercase tracking-wider text-white">
            Page Relocated
          </h1>
          <p className="text-sm text-gray-400">
            The architectural drawing or page you requested does not exist or has been relocated within our atelier archives.
          </p>
          <div>
            <Link
              href="/en"
              className="inline-block px-6 py-3 bg-[#F25C05] text-white text-xs font-mono uppercase tracking-widest rounded-sm font-semibold hover:bg-[#D84F00] transition-colors"
            >
              Return to Atelier
            </Link>
          </div>
        </div>
      </body>
    </html>
  );
}

