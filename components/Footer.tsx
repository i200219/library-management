import Link from "next/link";
import Image from "next/image";

const Footer = () => {
  return (
    <footer className="bg-dark-300/80 backdrop-blur-md  border-t border-dark-600 py-8 px-5 xs:px-10 md:px-16">
      <div className="flex flex-col md:flex-row justify-between items-center gap-8">
        <div className="flex flex-col items-center md:items-start gap-4">
          <div className="flex items-center gap-3">
            <Image
              src="/icons/logo.svg"
              alt="Library Logo"
              width={32}
              height={32}
              className="w-8 h-8"
            />
            <span className="text-light-100 text-sm">USIU Library</span>
          </div>
          <p className="text-light-100/80 text-sm">2024 USIU Library. All rights reserved.</p>
        </div>

        <div className="flex flex-col gap-2">
          <h3 className="text-light-100 text-sm font-medium">Quick Links</h3>
          <div className="flex gap-6">
            <Link href="/sign-in" className="text-light-100 hover:text-primary transition-colors text-sm">
              Sign In
            </Link>
            <Link href="/sign-up" className="text-light-100 hover:text-primary transition-colors text-sm">
              Sign Up
            </Link>
            <Link href="/about" className="text-light-100 hover:text-primary transition-colors text-sm">
              About Us
            </Link>
            <Link href="/contact" className="text-light-100 hover:text-primary transition-colors text-sm">
              Contact
            </Link>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <h3 className="text-light-100 text-sm font-medium">Connect With Us</h3>
          <div className="flex gap-4">
            <a href="https://www.facebook.com" className="text-light-100 hover:text-primary transition-colors">
              <span className="sr-only">Facebook</span>
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
              </svg>
            </a>
            <a href="https://www.twitter.com" className="text-light-100 hover:text-primary transition-colors">
              <span className="sr-only">Twitter</span>
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
              </svg>
            </a>
            <a href="https://www.instagram.com" className="text-light-100 hover:text-primary transition-colors">
              <span className="sr-only">Instagram</span>
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 12a5 5 0 015 5 5 5 0 01-5 5 5 5 0 01-5-5 5 5 0 015-5m0-2a7 7 0 00-7 7 7 7 0 007 7 7 7 0 007-7 7 7 0 00-7-7M17 7h3a2 2 0 012 2v3m-4 6h3a2 2 0 002-2V7" />
              </svg>
            </a>
            <a href="https://www.linkedin.com" className="text-light-100 hover:text-primary transition-colors">
              <span className="sr-only">LinkedIn</span>
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M19 3a2 2 0 012 2v14a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h14zm-5 14.255h.008v.008h-.008v-.008zm-4.255-7.263a1.75 1.75 0 11-3.5 0 1.75 1.75 0 013.5 0zm-9.737 1.737V12h3.329v-.042a9.365 9.365 0 01-3.329-.964z" />
              </svg>
            </a>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <h3 className="text-light-100 text-sm font-medium">Newsletter</h3>
          <p className="text-light-100/80 text-sm">Stay updated with our latest news and promotions</p>
          <form className="flex gap-2">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-2 bg-dark-200 text-light-100 rounded-lg"
            />
            <button
              type="submit"
              className="px-4 py-2 bg-primary text-dark-100 rounded-lg hover:bg-primary/90 transition-colors"
            >
              Subscribe
            </button>
          </form>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
