import { Facebook, Twitter, Instagram, Linkedin, Youtube } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200 mt-auto">
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-6 text-sm text-gray-600">
            <button className="hover:text-gray-900 transition-colors">About</button>
            <button className="hover:text-gray-900 transition-colors">Support</button>
            <button className="hover:text-gray-900 transition-colors">Legal</button>
          </div>

          
          <div className="flex items-center gap-4">
            <a
              href="#"
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              aria-label="Facebook"
            >
              <Facebook className="w-5 h-5 text-gray-600" />
            </a>
            <a
              href="#"
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              aria-label="Twitter"
            >
              <Twitter className="w-5 h-5 text-gray-600" />
            </a>
            <a
              href="#"
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              aria-label="Instagram"
            >
              <Instagram className="w-5 h-5 text-gray-600" />
            </a>
            <a
              href="#"
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              aria-label="LinkedIn"
            >
              <Linkedin className="w-5 h-5 text-gray-600" />
            </a>
            <a
              href="#"
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              aria-label="YouTube"
            >
              <Youtube className="w-5 h-5 text-gray-600" />
            </a> 
          </div>
        </div>


      </div>
    </footer>
  );
}
