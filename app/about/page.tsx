
export default function AboutPage() {
  return (
    <div className="min-h-screen bg-dark-100 p-6 md:p-12">
      <div className="max-w-4xl mx-auto">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bebas-neue text-white mb-4">
            About USIU Library
          </h1>
          <p className="text-light-100 max-w-2xl mx-auto">
            Welcome to the University of South Africa (USIU) Library System - your gateway to knowledge and academic excellence.
          </p>
        </div>

        {/* Library Overview */}
        <section className="mb-12">
          <h2 className="text-3xl font-bebas-neue text-white mb-6">Our Mission</h2>
          <div className="bg-dark-300/80 backdrop-blur-md rounded-2xl p-6">
            <p className="text-light-100 mb-4">
              At USIU Library, we are dedicated to providing students, faculty, and staff with access to a vast collection of academic resources, creating an environment that fosters learning, research, and intellectual growth.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
              {/* Services */}
              <div>
                <h3 className="text-xl font-semibold text-white mb-4">Our Services</h3>
                <ul className="space-y-3">
                  <li className="flex items-center gap-3">
                    <span className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                      <span className="text-dark-100">📚</span>
                    </span>
                    <span className="text-light-100">Comprehensive Book Collection</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                      <span className="text-dark-100">💻</span>
                    </span>
                    <span className="text-light-100">Online Resources</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                      <span className="text-dark-100">👥</span>
                    </span>
                    <span className="text-light-100">Study Spaces</span>
                  </li>
                </ul>
              </div>

              {/* Features */}
              <div>
                <h3 className="text-xl font-semibold text-white mb-4">Key Features</h3>
                <ul className="space-y-3">
                  <li className="flex items-center gap-3">
                    <span className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                      <span className="text-dark-100">🔍</span>
                    </span>
                    <span className="text-light-100">Advanced Search System</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                      <span className="text-dark-100">🔄</span>
                    </span>
                    <span className="text-light-100">Easy Book Borrowing</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                      <span className="text-dark-100">📱</span>
                    </span>
                    <span className="text-light-100">Mobile Access</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Library Hours */}
        <section className="mb-12">
          <h2 className="text-3xl font-bebas-neue text-white mb-6">Library Hours</h2>
          <div className="bg-dark-300/80 backdrop-blur-md rounded-2xl p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-semibold text-white mb-4">Weekdays</h3>
                <p className="text-light-100">8:00 AM - 9:00 PM</p>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-white mb-4">Weekends</h3>
                <p className="text-light-100">10:00 AM - 6:00 PM</p>
              </div>
            </div>
          </div>
        </section>

        {/* Contact Information */}
        <section>
          <h2 className="text-3xl font-bebas-neue text-white mb-6">Contact Us</h2>
          <div className="bg-dark-300/80 backdrop-blur-md rounded-2xl p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-semibold text-white mb-4">Address</h3>
                <p className="text-light-100">
                  University of South Africa<br />
                  Main Campus<br />
                  Nairobi, Kenya
                </p>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-white mb-4">Contact</h3>
                <p className="text-light-100">
                  Email: library@usiuniversity.ac.ke<br />
                  Phone: +254 700 123 456
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
