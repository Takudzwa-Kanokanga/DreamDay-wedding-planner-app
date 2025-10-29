export default function Home({ onNavigate }: { onNavigate?: (page: string) => void }) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 to-white">
      <div className="max-w-7xl mx-auto px-6 py-20">
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-serif text-gray-900 mb-6">
            Plan Your Dream Wedding
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
            Everything you need to create your perfect day, all in one place. From budget tracking to guest management, we've got you covered.
          </p>
          <button
            onClick={() => onNavigate?.('dashboard')}
            className="px-8 py-4 bg-pink-300 text-white rounded-full font-medium hover:bg-pink-400 transition-colors text-lg"
          >
            Start Planning Now
          </button>
        </div>

        <div className="relative max-w-4xl mx-auto">
          <div className="aspect-video rounded-3xl overflow-hidden shadow-2xl">
            <img
              src="https://images.pexels.com/photos/169198/pexels-photo-169198.jpeg?auto=compress&cs=tinysrgb&w=1200"
              alt="Wedding ceremony setup"
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        <div className="mt-32 grid md:grid-cols-3 gap-12">
          <div className="text-center">
            <div className="w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-3xl">✓</span>
            </div>
            <h3 className="text-xl font-semibold mb-3">Easy Planning</h3>
            <p className="text-gray-600">
              Organize every detail with our intuitive planning tools and checklists.
            </p>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-3xl">💰</span>
            </div>
            <h3 className="text-xl font-semibold mb-3">Budget Management</h3>
            <p className="text-gray-600">
              Keep track of expenses and stay within budget with smart tracking features.
            </p>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-3xl">👥</span>
            </div>
            <h3 className="text-xl font-semibold mb-3">Guest Management</h3>
            <p className="text-gray-600">
              Manage RSVPs, seating arrangements, and guest information effortlessly.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
