// src/components/Footer.tsx
import { Link } from 'react-router-dom'

const Footer = () => {
  return (
    <footer className="bg-white border-t border-gray-200 pt-16 pb-8">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Alamat Kami */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Alamat Kami</h3>
            <p className="text-gray-500 text-sm leading-relaxed">
              Jl. Meruyung Raya No.111<br />
              Kec. Limo, Kota Depok<br />
              Jawa Barat, 16514<br />
              Indonesia
            </p>
          </div>
          
          {/* Links */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Links</h3>
            <ul className="space-y-2">
              <li><Link to="/" className="text-gray-500 hover:text-gray-800 text-sm">Home</Link></li>
              <li><Link to="/products" className="text-gray-500 hover:text-gray-800 text-sm">Products</Link></li>
              <li><Link to="/contact" className="text-gray-500 hover:text-gray-800 text-sm">Contact</Link></li>
            </ul>
          </div>
          
          {/* Help */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Help</h3>
            <ul className="space-y-2">
              <li><Link to="/payment-options" className="text-gray-500 hover:text-gray-800 text-sm">Payment Options</Link></li>
              <li><Link to="/returns" className="text-gray-500 hover:text-gray-800 text-sm">Returns</Link></li>
              <li><Link to="/privacy" className="text-gray-500 hover:text-gray-800 text-sm">Privacy Policies</Link></li>
            </ul>
          </div>
          
          {/* Partnership */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Partnership Cooperation</h3>
            <p className="text-gray-500 text-sm mb-3">Enter your Email Address</p>
            <form className="flex gap-2">
              <input 
                type="email" 
                placeholder="Enter Your Email Address" 
                className="w-full px-4 py-2 text-sm border-b focus:outline-none focus:border-b-[.14rem] focus:ring-mustard"
              />
              <button className="text-gray-400 hover:text-gray-800 px-4 py-2 text-sm font-semibold border-b hover:border-b-[.14rem] cursor-pointer">
                SEND
              </button>
            </form>
          </div>
          
        </div>
        
        {/* Copyright */}
        <div className="mt-12 border-t border-gray-200 pt-8 text-center">
          <p className="text-gray-500 text-sm">
            © 2025 Mandiri Steel. All rights reserved
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer