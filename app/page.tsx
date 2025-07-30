import { auth } from "@/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { ThemeToggle } from "@/components/ThemeToggle";

export default async function LandingPage() {
  const session = await auth();

  // If user is authenticated
  if (session) {
    // Redirect users to /books and admins to /admin
    if (session.user.role === 'ADMIN') {
      redirect("/admin");
    } else {
      redirect("/books");
    }
  }

  return (
    <div className="relative w-full h-screen overflow-hidden bg-dark-100">
      {/* Animated Background */}
      <div className="absolute inset-0 w-full h-full bg-gradient-to-br from-dark-100 via-dark-300 to-dark-400 animate-gradient" />
      
      {/* Video Background */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover"
      >
        <source
          src="/videos/library-background.mp4"
          type="video/mp4"
        />
      </video>

      {/* Dark Overlay for better text readability */}
      <div className="absolute inset-0 bg-dark-100 bg-opacity-60" />

      {/* Navigation */}
      <nav className="relative z-20 flex items-center justify-between px-5 py-6 xs:px-10 md:px-16">
        <div className="flex items-center gap-3">
          <Image
            src="/icons/logo.svg"
            alt="Library Logo"
            width={40}
            height={40}
            className="w-10 h-10"
          />
          <h1 className="text-2xl font-bebas-neue text-white">USIU Library</h1>
        </div>
        
        <div className="flex items-center gap-4">
          <ThemeToggle />
          <Link
            href="/about"
            className="px-4 py-2 text-light-100 hover:text-primary transition-colors duration-200 font-medium"
          >
            About
          </Link>
          <Link
            href="/contact"
            className="px-4 py-2 text-light-100 hover:text-primary transition-colors duration-200 font-medium"
          >
            Contact
          </Link>
          <Link
            href="/sign-in"
            className="px-6 py-2 text-light-100 hover:text-primary transition-colors duration-200 font-medium"
          >
            Sign In
          </Link>
          <Link
            href="/sign-up"
            className="px-6 py-3 bg-primary text-dark-100 hover:bg-primary/90 transition-colors duration-200 rounded-md font-semibold"
          >
            Sign Up
          </Link>
        </div>
      </nav>

      {/* Welcome Content */}
      <div className="relative z-10 flex items-center justify-center h-full">
        <div className="text-center px-6 max-w-4xl mx-auto">
          {/* Main Welcome Text */}
          <div className="welcome-container bg-dark-300 bg-opacity-80 backdrop-blur-sm rounded-2xl p-8 border border-dark-600 shadow-2xl">
            <h1 className="welcome-title text-white mb-4 tracking-wide">
              Welcome to
            </h1>
            <h2 className="library-name text-primary mb-6 tracking-wider">
              USIU Library
            </h2>
            <p className="welcome-description text-light-100 mb-8 max-w-2xl mx-auto leading-relaxed">
              Discover knowledge, explore resources, and unlock your potential in our modern learning environment
            </p>
            
            {/* Call to Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link
                href="/sign-up"
                className="cta-button bg-primary text-dark-100 px-8 py-3 rounded-full hover:bg-primary/90 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                Get Started
              </Link>
              <Link
                href="/sign-in"
                className="cta-button-secondary border-2 border-primary text-primary px-8 py-3 rounded-full hover:bg-primary hover:text-dark-100 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                Sign In
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="particle particle-1" />
        <div className="particle particle-2" />
        <div className="particle particle-3" />
        <div className="particle particle-4" />
        <div className="particle particle-5" />
      </div>

      {/* Decorative Elements */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10">
        <div className="flex space-x-2">
          <div className="w-2 h-2 bg-primary rounded-full opacity-60 animate-pulse" />
          <div className="w-2 h-2 bg-primary rounded-full opacity-60 animate-pulse" style={{ animationDelay: '0.5s' }} />
          <div className="w-2 h-2 bg-primary rounded-full opacity-60 animate-pulse" style={{ animationDelay: '1s' }} />
        </div>
      </div>

    </div>
  );
} 