import Link from "next/link";
import { Mail, MessageCircle, Globe } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-100 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-8 mb-12">
          <div className="md:col-span-1">
            <Link href="/" className="font-display font-bold text-2xl tracking-tighter text-gray-900 mb-4 block">
              STYLED.
            </Link>
            <p className="text-gray-500 text-sm leading-relaxed mb-6">
              Premium, minimal sneakers designed for the modern lifestyle. Step into comfort without compromising on style.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-brand-green transition-colors">
                <Mail className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-brand-green transition-colors">
                <MessageCircle className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-brand-green transition-colors">
                <Globe className="w-5 h-5" />
              </a>
            </div>
          </div>
          
          <div>
            <h4 className="font-bold text-gray-900 mb-4">Shop</h4>
            <ul className="space-y-3">
              <li><Link href="#" className="text-gray-500 hover:text-brand-green text-sm transition-colors">All Sneakers</Link></li>
              <li><Link href="#" className="text-gray-500 hover:text-brand-green text-sm transition-colors">New Arrivals</Link></li>
              <li><Link href="#" className="text-gray-500 hover:text-brand-green text-sm transition-colors">Bestsellers</Link></li>
              <li><Link href="#" className="text-gray-500 hover:text-brand-green text-sm transition-colors">Sale</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-bold text-gray-900 mb-4">About</h4>
            <ul className="space-y-3">
              <li><Link href="#" className="text-gray-500 hover:text-brand-green text-sm transition-colors">Our Story</Link></li>
              <li><Link href="#" className="text-gray-500 hover:text-brand-green text-sm transition-colors">Sustainability</Link></li>
              <li><Link href="#" className="text-gray-500 hover:text-brand-green text-sm transition-colors">Materials</Link></li>
              <li><Link href="#" className="text-gray-500 hover:text-brand-green text-sm transition-colors">Careers</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-bold text-gray-900 mb-4">Support</h4>
            <ul className="space-y-3">
              <li><Link href="#" className="text-gray-500 hover:text-brand-green text-sm transition-colors">FAQ</Link></li>
              <li><Link href="#" className="text-gray-500 hover:text-brand-green text-sm transition-colors">Shipping & Returns</Link></li>
              <li><Link href="#" className="text-gray-500 hover:text-brand-green text-sm transition-colors">Size Guide</Link></li>
              <li><Link href="#" className="text-gray-500 hover:text-brand-green text-sm transition-colors">Contact Us</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-100 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm mb-4 md:mb-0">
            &copy; {new Date().getFullYear()} Styled Sneakers. All rights reserved.
          </p>
          <div className="flex space-x-6 text-sm">
            <Link href="#" className="text-gray-400 hover:text-brand-green transition-colors">Privacy Policy</Link>
            <Link href="#" className="text-gray-400 hover:text-brand-green transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
