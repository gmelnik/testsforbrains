import Link from 'next/link'

export function Footer() {
  return (
    <footer className="bg-gray-50 border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="flex items-center gap-2">
              <span className="text-2xl">🧠</span>
              <span className="text-lg font-bold bg-gradient-to-r from-spark-500 to-brain-500 bg-clip-text text-transparent">
                BrainSpark
              </span>
            </Link>
            <p className="mt-4 text-sm text-gray-600">
              Making learning fun for kids ages 6-12. Play smart. Grow smarter.
            </p>
          </div>

          {/* Product */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-4">Product</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/play" className="text-sm text-gray-600 hover:text-spark-500">
                  Games
                </Link>
              </li>
              <li>
                <Link href="/pricing" className="text-sm text-gray-600 hover:text-spark-500">
                  Pricing
                </Link>
              </li>
              <li>
                <Link href="/parent" className="text-sm text-gray-600 hover:text-spark-500">
                  For Parents
                </Link>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-4">Categories</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/play?category=math" className="text-sm text-gray-600 hover:text-spark-500">
                  Math Games
                </Link>
              </li>
              <li>
                <Link href="/play?category=logic" className="text-sm text-gray-600 hover:text-spark-500">
                  Logic Puzzles
                </Link>
              </li>
              <li>
                <Link href="/play?category=cogat" className="text-sm text-gray-600 hover:text-spark-500">
                  CoGAT Prep
                </Link>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-4">Company</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/about" className="text-sm text-gray-600 hover:text-spark-500">
                  About
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-sm text-gray-600 hover:text-spark-500">
                  Contact
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-sm text-gray-600 hover:text-spark-500">
                  Privacy
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-gray-200">
          <p className="text-center text-sm text-gray-500">
            &copy; {new Date().getFullYear()} BrainSpark. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
