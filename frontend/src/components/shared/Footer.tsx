import { Input } from "@/src/components/ui/input";
import { Button } from "@/src/components/ui/button";
import { Send, Facebook, Twitter, Instagram, Linkedin } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-black text-gray-300 pt-16 pb-8">
      <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-5 gap-8">
        {/* Cột 1: Logo & Subscribe */}
        <div className="flex flex-col gap-4">
          <h3 className="text-2xl font-bold text-white">E-Commerce</h3>
          <p className="font-medium text-white">Subscribe</p>
          <p className="text-sm">Get 10% off your first order</p>
          <div className="relative">
            <Input
              type="email"
              placeholder="Enter your email"
              className="bg-black border border-gray-500 pr-10 text-white"
            />
            <Button variant="ghost" size="icon" className="absolute right-0 top-0 text-white">
              <Send size={20} />
            </Button>
          </div>
        </div>

        {/* Cột 2: Support */}
        <div className="flex flex-col gap-3">
          <h4 className="text-lg font-medium text-white">Support</h4>
          <p className="text-sm">111 Bijoy sarani, Dhaka, DH 1515, Bangladesh.</p>
          <p className="text-sm">exclusive@gmail.com</p>
          <p className="text-sm">+88015-88888-9999</p>
        </div>

        {/* Cột 3: Account */}
        <div className="flex flex-col gap-3">
          <h4 className="text-lg font-medium text-white">Account</h4>
          <a href="#" className="text-sm hover:underline">My Account</a>
          <a href="#" className="text-sm hover:underline">Login / Register</a>
          <a href="#" className="text-sm hover:underline">Cart</a>
          <a href="#" className="text-sm hover:underline">Wishlist</a>
          <a href="#" className="text-sm hover:underline">Shop</a>
        </div>

        {/* Cột 4: Quick Link */}
        <div className="flex flex-col gap-3">
          <h4 className="text-lg font-medium text-white">Quick Link</h4>
          <a href="#" className="text-sm hover:underline">Privacy Policy</a>
          <a href="#" className="text-sm hover:underline">Terms Of Use</a>
          <a href="#" className="text-sm hover:underline">FAQ</a>
          <a href="#" className="text-sm hover:underline">Contact</a>
        </div>

        {/* Cột 5: Download App */}
        <div className="flex flex-col gap-3">
          <h4 className="text-lg font-medium text-white">Download App</h4>
          <p className="text-xs text-gray-400">Save $3 with App New User Only</p>
          {/* QR Code và App Stores (Tạm thời để trống) */}
          <div className="flex gap-2">
            <div className="w-20 h-20 bg-gray-700 flex items-center justify-center text-xs">QR Code</div>
            <div className="flex flex-col gap-2">
              <div className="h-9 w-28 bg-gray-700 text-xs flex items-center justify-center">Google Play</div>
              <div className="h-9 w-28 bg-gray-700 text-xs flex items-center justify-center">App Store</div>
            </div>
          </div>
          <div className="flex gap-4 mt-2">
            <a href="#" aria-label="Facebook"><Facebook size={20} /></a>
            <a href="#" aria-label="Twitter"><Twitter size={20} /></a>
            <a href="#" aria-label="Instagram"><Instagram size={20} /></a>
            <a href="#" aria-label="LinkedIn"><Linkedin size={20} /></a>
          </div>
        </div>
      </div>

      {/* Copyright Bar */}
      <div className="text-center text-gray-600 border-t border-gray-800 mt-12 pt-6 text-sm">
        &copy; Copyright Rimel 2022. All right reserved
      </div>
    </footer>
  );
}