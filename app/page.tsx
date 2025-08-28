"use client";
import React, { useState, useEffect } from 'react';
import { Search, X, ShoppingCart, Menu, Bell, Plus, Minus, Trash2, Edit, Save } from 'lucide-react'


// Define the type for a Product
interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string; // Path to the image
  rating: number;
  dimensions: string;
  material: string;
  color: string;
}

// Define the type for a Cart Item
interface CartItem extends Product {
  quantity: number;
}

// Define the type for an Order
interface Order {
  id: string;
  items: CartItem[];
  customerName: string;
  customerPhoneNumber: string; // Changed from customerEmail
  customerAddress: string;
  total: number;
  orderDate: string;
}

// Define the type for a Notification
interface Notification {
  id: string;
  message: string;
  date: string;
  read: boolean;
}

// Dummy Product Data - This will now be dynamically managed via localStorage
const initialProducts: Product[] = [
  // Initial 4 Featured Products (Visible on Landing/Home)
  {
    id: '1',
    name: 'Polyester Navy',
    description: 'This comfortable L-shaped sectional sofa features a classic navy blue finish that brings a modern and elegant touch to any living space. Crafted with premium velvet fabric, it offers a smooth, luxurious feel that is both durable and easy to clean. The sofa includes high-density foam cushions that provide excellent comfort and support for long hours of lounging or entertaining. It comes with two matching bolster pillows for added style and ergonomic support. The solid wood frame and tapered wooden legs ensure strength and stability, while the chaise section allows you to stretch out and relax. Designed to comfortably seat 3 to 4 people, this sofa is the perfect combination of form and function. Assembly is quick and tool-free, making setup a breeze.',
    price: 190,
    image: '/navy polyester.png',
    rating: 4, dimensions: 'Overall Length: Approx. 250 cm\nSeat Depth: 55 cm\nChaise Length: 140 cm\nSeat Height: 45 cm', material: 'Polyester', color: 'Navy',
  },
  {
    id: '2',
    name: 'Polyester Cyan',
    description: 'A stylish and cozy polyester sofa in a vibrant cyan hue, perfect for adding a refreshing pop of color to your home. Its durable fabric and robust construction ensure longevity, while its modern design complements a variety of interiors. Ideal for families and entertaining.',
    price: 190,
    image: '/cyan polyester.png',
    rating: 4, dimensions: 'Overall Length: Approx. 250 cm\nSeat Depth: 55 cm\nChaise Length: 140 cm\nSeat Height: 45 cm', material: 'Polyester', color: 'Cyan',
  },
  {
    id: '3',
    name: 'Polyester Grey',
    description: 'A versatile polyester sofa in a modern grey, designed to seamlessly blend with any existing decor. This sofa offers exceptional comfort with its plush cushions and supportive backrest. Easy to maintain and built to last, it\'s an excellent choice for contemporary living spaces.',
    price: 190,
    image: '/grey polyester.png',
    rating: 5, dimensions: 'Overall Length: Approx. 250 cm\nSeat Depth: 55 cm\nChaise Length: 140 cm\nSeat Height: 45 cm', material: 'Polyester', color: 'Grey',
  },
  {
    id: '4',
    name: 'Polyester Yellow',
    description: 'A vibrant polyester sofa in sunny yellow, guaranteed to add a cheerful and inviting atmosphere to your living area. Its sturdy frame and high-quality upholstery provide lasting comfort and style. A perfect statement piece that is both practical and aesthetically pleasing.',
    price: 190,
    image: '/yellow polyester.png',
    rating: 3, dimensions: 'Overall Length: Approx. 250 cm\nSeat Depth: 55 cm\nChaise Length: 140 cm\nSeat Height: 45 cm', material: 'Polyester', color: 'Yellow',
  },
  // Additional Products (Visible on Full Product Grid Page)
  {
    id: '5',
    name: 'Velvet Pink',
    description: 'A luxurious velvet sofa in a soft pink, exuding elegance and sophistication. The plush velvet fabric provides an incredibly soft touch, making it a dream for relaxation. Its sturdy construction ensures longevity, while the chic design is perfect for adding a touch of glamour to any room.',
    price: 200,
    image: '/velvet pink.png',
    rating: 5, dimensions: 'Overall Length: Approx. 250 cm\nSeat Depth: 55 cm\nChaise Length: 140 cm\nSeat Height: 45 cm', material: 'Velvet', color: 'Pink',
  },
  {
    id: '6',
    name: 'Velvet Teal',
    description: 'A rich velvet sofa in deep teal, offering sophisticated comfort and a statement piece for your home. The soft, textured velvet is both inviting and durable. This sofa combines classic design elements with modern comfort, making it a timeless addition to any living space.',
    price: 200,
    image: '/velvet teal.png',
    rating: 4, dimensions: 'Overall Length: Approx. 250 cm\nSeat Depth: 55 cm\nChaise Length: 140 cm\nSeat Height: 45 cm', material: 'Velvet', color: 'Teal',
  },
  {
    id: '7',
    name: 'Velvet Yellow',
    description: 'A plush velvet sofa in a warm yellow, designed for a cozy and luxurious feel. The soft velvet material is incredibly comfortable, perfect for lounging. Its robust construction ensures durability, making it an ideal choice for both relaxation and entertaining in style.',
    price: 200,
    image: '/yellow velvet.png',
    rating: 4, dimensions: 'Overall Length: Approx. 250 cm\nSeat Depth: 55 cm\nChaise Length: 140 cm\nSeat Height: 45 cm', material: 'Velvet', color: 'Yellow',
  },
  {
    id: '8',
    name: 'Velvet Matcha',
    description: 'An elegant velvet sofa in a calming matcha green shade, bringing a sense of tranquility and style to your interior. The luxurious velvet fabric is soft to the touch and highly durable. This sofa offers a perfect blend of modern aesthetics and comfortable seating.',
    price: 200,
    image: '/matcha velvet.png',
    rating: 5, dimensions: 'Overall Length: Approx. 250 cm\nSeat Depth: 55 cm\nChaise Length: 140 cm\nSeat Height: 45 cm', material: 'Velvet', color: 'Matcha',
  },
];


// Helper for rendering stars
const StarRating: React.FC<{ rating: number }> = ({ rating }) => {
  return (
    <div className="flex text-yellow-400">
      {Array.from({ length: 5 }, (_, i) => (
        <span key={i}>{i < rating ? '★' : '☆'}</span>
      ))}
    </div>
  );
};

// --- Common Header Component ---
interface HeaderProps {
  isLoggedIn: boolean;
  isAdmin: boolean; // New prop for admin status
  cartItemsCount: number;
  unreadNotificationsCount: number; // New prop for notifications
  onHomeClick: () => void;
  onContactClick: () => void;
  onSignUpClick: () => void;
  onSignOutClick: () => void;
  onCartClick: () => void;
  onAdminClick: () => void; // New prop for admin panel navigation
  onNotificationsClick: () => void; // New prop for notifications
  onSearchClick: () => void; // New prop for search modal
}

const Header: React.FC<HeaderProps> = ({
  isLoggedIn,
  isAdmin,
  cartItemsCount,
  unreadNotificationsCount,
  onHomeClick,
  onContactClick,
  onSignUpClick,
  onSignOutClick,
  onCartClick,
  onNotificationsClick,
  onSearchClick,
}) => {
  return (
    <header className="bg-white border-b border-gray-200 fixed top-0 w-full z-10 shadow-md">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <a href="#" className="flex items-center space-x-2" onClick={onHomeClick}>
            <div className="w-8 h-8 bg-amber-700 rounded flex items-center justify-center">
              <div className="w-4 h-3 bg-amber-900 rounded"></div>
            </div>
            <span className="text-xl font-bold text-gray-900">Sofaholic</span>
          </a>

          {/* Search Bar - Now a button to open the modal */}
          <div className="flex-1 max-w-md mx-4 sm:mx-8">
            <button
              onClick={onSearchClick}
              className="w-full pl-10 pr-4 py-2 bg-gray-100 rounded-full border-0 focus:outline-none focus:ring-2 focus:ring-amber-500 text-left text-gray-500 relative"
            >
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 w-4 h-4" />
              Search
            </button>
          </div>

          {/* Navigation */}
          <div className="flex items-center space-x-4 sm:space-x-6">
            <button onClick={onHomeClick} className="text-gray-900 hover:text-gray-600 font-medium hidden md:block">
              Home
            </button>
            <span className="text-gray-400 hidden md:block">|</span>
            <button onClick={onContactClick} className="text-gray-900 hover:text-gray-600 font-medium hidden md:block">
              Contact
            </button>
            <span className="text-gray-400 hidden md:block">|</span>
            {isLoggedIn ? (
              <>
                {/* Conditional rendering for Cart based on isAdmin */}
                {!isAdmin && (
                  <a href="#" className="text-gray-900 hover:text-gray-600 font-medium flex items-center space-x-1" onClick={onCartClick}>
                    <ShoppingCart className="w-5 h-5" />
                    <span className="hidden sm:inline">Your Cart</span> ({cartItemsCount})
                  </a>
                )}
                <button onClick={onNotificationsClick} className="relative text-gray-900 hover:text-gray-600">
                  <Bell className="w-5 h-5" />
                  {unreadNotificationsCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                      {unreadNotificationsCount}
                    </span>
                  )}
                </button>
                <button onClick={onSignOutClick} className="text-gray-900 hover:text-gray-600 font-medium hidden md:block">
                  Sign Out
                </button>
              </>
            ) : (
              <button onClick={onSignUpClick} className="text-gray-900 hover:text-gray-600 font-medium hidden md:block">
                Sign Up
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};


// --- Modals ---

interface SignUpModalProps {
  onClose: () => void;
  onSignUpSuccess: (isAdmin: boolean) => void; // Pass admin status on success
}

const SignUpModal: React.FC<SignUpModalProps> = ({ onClose, onSignUpSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [selectedRole, setSelectedRole] = useState<'Admin' | 'User'>('User'); // State for role selection

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email && password) {
      onSignUpSuccess(selectedRole === 'Admin'); // Pass true if Admin selected
    } else {
      alert('Please enter both email and password.');
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl p-8 relative w-full max-w-sm flex flex-col items-center"> {/* Added flex flex-col items-center */}
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-900">
          <X className="w-6 h-6" />
        </button>

        {/* Sofaholic Logo and Text */}
        <div className="flex flex-col items-center mb-6"> {/* Center logo and text */}
          <div className="w-12 h-12 bg-amber-700 rounded-full flex items-center justify-center mb-2">
            <div className="w-6 h-5 bg-amber-900 rounded"></div>
          </div>
          <span className="text-2xl font-bold text-gray-900">Sofaholic</span>
        </div>

        {/* Admin/User Role Selection Buttons */}
        <div className="flex w-full mb-6 max-w-[200px] rounded-full overflow-hidden bg-gray-200"> {/* Styled container */}
          <button
            type="button"
            className={`flex-1 py-2 text-center text-sm font-medium rounded-full transition-colors duration-200 ${selectedRole === 'Admin' ? 'bg-gray-400 text-white' : 'text-gray-700 hover:bg-gray-300'}`}
            onClick={() => setSelectedRole('Admin')}
          >
            Admin
          </button>
          <button
            type="button"
            className={`flex-1 py-2 text-center text-sm font-medium rounded-full transition-colors duration-200 ${selectedRole === 'User' ? 'bg-gray-400 text-white' : 'text-gray-700 hover:bg-gray-300'}`}
            onClick={() => setSelectedRole('User')}
          >
            User
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 w-full"> {/* Full width form */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label> {/* Label above input */}
            <input
              type="email"
              className="mt-0 block w-full px-4 py-3 border border-gray-300 rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-base bg-gray-100 placeholder-gray-500" // Styled input
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label> {/* Label above input */}
            <input
              type="password"
              className="mt-0 block w-full px-4 py-3 border border-gray-300 rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-base bg-gray-100 placeholder-gray-500" // Styled input
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button
            type="submit"
            className="w-full flex justify-center py-3 px-4 mt-6 border border-transparent rounded-full shadow-sm text-lg font-medium text-white bg-amber-900 hover:bg-amber-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 transition transform hover:scale-105" // Styled button
          >
            Sign Up
          </button>
        </form>
      </div>
    </div>
  );
};

interface ContactModalProps {
  onClose: () => void;
}

const ContactModal: React.FC<ContactModalProps> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl p-8 relative w-full max-w-sm">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-900">
          <X className="w-6 h-6" />
        </button>
        <h2 className="text-2xl font-bold mb-4 text-center text-gray-900">Contact</h2>
        <div className="space-y-4">
          <a href="#" className="flex items-center space-x-4 p-4 rounded-md bg-gray-100 hover:bg-gray-200">
            {/* Replaced FaFacebook with text/SVG equivalent if desired */}
            <span className="w-6 h-6 text-blue-600">FB</span>
            <span className="font-medium text-gray-900">Facebook</span>
          </a>
          <a href="#" className="flex items-center space-x-4 p-4 rounded-md bg-gray-100 hover:bg-gray-200">
            {/* Replaced FaInstagram with text/SVG equivalent if desired */}
            <span className="w-6 h-6 text-pink-600">IG</span>
            <span className="font-medium text-gray-900">Instagram</span>
          </a>
          <a href="#" className="flex items-center space-x-4 p-4 rounded-md bg-gray-100 hover:bg-gray-200">
            {/* Replaced FaTiktok with text/SVG equivalent if desired */}
            <span className="w-6 h-6 text-gray-900">TT</span>
            <span className="font-medium text-gray-900">TikTok</span>
          </a>
        </div>
      </div>
    </div>
  );
};

interface NotificationCenterModalProps {
  notifications: Notification[];
  onClose: () => void;
  onMarkAsRead: (id: string) => void;
  onCheckOrder: (order: Order) => void; // New prop for checking order details
  orders: Order[]; // Pass orders to the notification center to enable linking
}

const NotificationCenterModal: React.FC<NotificationCenterModalProps> = ({ notifications, onClose, onMarkAsRead, onCheckOrder, orders }) => {
  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl p-8 relative w-full max-w-md">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-900">
          <X className="w-6 h-6" />
        </button>
        <h2 className="text-2xl font-bold mb-4 text-center text-gray-900">Notifications</h2>
        {notifications.length === 0 ? (
          <p className="text-center text-gray-600">No new notifications.</p>
        ) : (
          <div className="space-y-3 max-h-80 overflow-y-auto">
            {notifications.map((notification) => {
              // Assuming a notification message like "New Order: order-1701234567890"
              const isNewOrderNotification = notification.message.startsWith('New Order:');
              const orderIdFromNotification = isNewOrderNotification ? notification.message.split(': ')[1] : null;
              const associatedOrder = orders.find(order => order.id === orderIdFromNotification);

              return (
                <div
                  key={notification.id}
                  className={`p-3 rounded-md ${notification.read ? 'bg-gray-100' : 'bg-blue-50 font-semibold'} flex justify-between items-center`}
                >
                  <div>
                    <p className="text-sm text-gray-800">{notification.message}</p>
                    <p className="text-xs text-gray-500 mt-1">{new Date(notification.date).toLocaleString()}</p>
                  </div>
                  <div className="flex space-x-2">
                    {associatedOrder && (
                      <button
                        onClick={() => { onCheckOrder(associatedOrder); onClose(); }} // Navigate to order detail and close modal
                        className="px-3 py-1 bg-amber-500 text-white text-xs rounded-full hover:bg-amber-600"
                      >
                        Check
                      </button>
                    )}
                    {!notification.read && (
                      <button
                        onClick={() => onMarkAsRead(notification.id)}
                        className="px-3 py-1 bg-blue-500 text-white text-xs rounded-full hover:bg-blue-600"
                      >
                        Mark as Read
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

interface SendNotificationModalProps {
  onClose: () => void;
  onSend: (message: string) => void;
}

const SendNotificationModal: React.FC<SendNotificationModalProps> = ({ onClose, onSend }) => {
  const [message, setMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim()) {
      onSend(message);
      setMessage('');
      onClose();
    } else {
      alert('Notification message cannot be empty.');
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl p-8 relative w-full max-w-sm">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-900">
          <X className="w-6 h-6" />
        </button>
        <h2 className="text-2xl font-bold mb-4 text-center text-gray-900">Send Notification</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Message</label>
            <textarea
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-amber-500 focus:border-amber-500 sm:text-sm"
              rows={4}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              required
            ></textarea>
          </div>
          <button
            type="submit"
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-amber-900 hover:bg-amber-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500"
          >
            Send Notification
          </button>
        </form>
      </div>
    </div>
  );
};

interface SearchModalProps {
  onClose: () => void;
  products: Product[];
  onSelectProduct: (product: Product) => void;
}

const SearchModal: React.FC<SearchModalProps> = ({ onClose, products, onSelectProduct }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isCategoriesOpen, setIsCategoriesOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const availableCategories = Array.from(new Set(products.map(p => p.material)));

  const filteredProducts = products.filter(product => {
    const matchesSearch = searchQuery === '' || product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          product.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory ? product.material === selectedCategory : true;
    return matchesSearch && matchesCategory;
  });

  const handleCategoryClick = (category: string | null) => { // Allow null for 'All'
    setSelectedCategory(category);
    setIsCategoriesOpen(false); // Close categories after selection
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-75 flex items-start justify-center p-4 sm:p-6 lg:p-8 z-50 pt-16"> {/* Adjust padding top for header */}
      <div className="bg-white rounded-lg shadow-xl p-6 sm:p-8 relative w-full max-w-2xl">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-900">
          <X className="w-6 h-6" />
        </button>
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-900">Search Products</h2>

        {/* Search Input and Burger Button */}
        <div className="flex items-center mb-4 space-x-2">
          <div className="relative flex-grow">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 w-4 h-4" />
            <input
              type="text"
              placeholder="Search"
              className="w-full pl-10 pr-4 py-2 bg-gray-100 rounded-full border-0 focus:outline-none focus:ring-2 focus:ring-amber-500"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <button
            onClick={() => setIsCategoriesOpen(!isCategoriesOpen)}
            className="p-2 bg-gray-200 rounded-full hover:bg-gray-300 transition"
          >
            <Menu className="w-6 h-6" />
          </button>
        </div>

        {/* Categories Section (conditionally rendered) */}
        {isCategoriesOpen && (
          <div className="mb-4 p-4 bg-gray-50 rounded-lg shadow-inner">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Categories</h3>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => handleCategoryClick(null)}
                className={`px-4 py-2 rounded-full text-sm font-medium ${selectedCategory === null ? 'bg-amber-900 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
              >
                All
              </button>
              {availableCategories.map(category => (
                <button
                  key={category}
                  onClick={() => handleCategoryClick(category)}
                  className={`px-4 py-2 rounded-full text-sm font-medium ${selectedCategory === category ? 'bg-amber-900 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Search Results */}
        {filteredProducts.length === 0 ? (
          <p className="text-center text-gray-600">No products found matching your criteria.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 max-h-96 overflow-y-auto">
            {filteredProducts.map(product => (
              <div
                key={product.id}
                className="bg-white rounded-lg shadow-md overflow-hidden flex flex-col items-center cursor-pointer p-3 transition-transform hover:scale-105"
                onClick={() => {
                  onSelectProduct(product);
                  onClose(); // Close modal after selecting a product
                }}
              >
                <div className="relative w-full h-32 mb-2">
                  <img src={product.image} alt={product.name} className="object-cover rounded-md w-full h-full" />
                </div>
                <h4 className="font-semibold text-gray-900 text-center">{product.name}</h4>
                <p className="text-sm text-gray-600">${product.price.toFixed(2)}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};


// --- Page Components ---

interface CommonPageProps {
  isLoggedIn: boolean;
  isAdmin: boolean;
  openSignUpModal: (isAdmin: boolean) => void; // Now takes isAdmin
  openContactModal: () => void;
  handleSignOut: () => void;
  cartItemsCount: number;
  unreadNotificationsCount: number;
  onHomeClick: () => void;
  onCartClick: () => void;
  onAdminClick: () => void;
  onNotificationsClick: () => void;
  products: Product[]; // Pass products state down
  setProducts: React.Dispatch<React.SetStateAction<Product[]>>; // Pass setter down for admin changes
  orders: Order[]; // Pass orders state down
  setOrders: React.Dispatch<React.SetStateAction<Order[]>>; // Pass setter down for admin changes
  notifications: Notification[]; // Pass notifications state down
  setNotifications: React.Dispatch<React.SetStateAction<Notification[]>>; // Pass setter down
  onNavigate: (page: string) => void; // Added this line for the onNavigate prop
  openSearchModal: () => void; // Added for search modal
  onCheckOrder: (order: Order) => void; // Added for admin to check orders
  setProductToEdit: React.Dispatch<React.SetStateAction<Product | null>>; // Pass setter for product to edit
}

const HomeFeaturedPage: React.FC<CommonPageProps & { onShopNow: () => void; onViewAllProducts: () => void }> = ({
  onShopNow,
  onViewAllProducts,
  ...commonProps
}) => {
  const featuredProducts = commonProps.products.slice(0, 4); // Use products from props

  return (
    <div className="min-h-screen bg-white">
      <Header
        onHomeClick={commonProps.onHomeClick}
        onContactClick={commonProps.openContactModal}
        onSignUpClick={() => commonProps.openSignUpModal(false)} // Regular signup
        onSignOutClick={commonProps.handleSignOut}
        isLoggedIn={commonProps.isLoggedIn}
        isAdmin={commonProps.isAdmin}
        cartItemsCount={commonProps.cartItemsCount}
        unreadNotificationsCount={commonProps.unreadNotificationsCount}
        onCartClick={commonProps.onCartClick}
        onAdminClick={commonProps.onAdminClick}
        onNotificationsClick={commonProps.onNotificationsClick}
        onSearchClick={commonProps.openSearchModal}
      />

      {/* Hero Section */}
      <section className="relative h-[500px] bg-gray-100 flex items-center justify-center pt-16">
        <img
          src="\faimly landing.jpg"
          alt="Modern furniture lifestyle scene"
          className="object-cover w-full h-full absolute inset-0"
        />

        {/* Overlay Content */}
        <div className="absolute inset-0 flex flex-col justify-center items-start px-8 sm:px-16 text-white text-shadow-lg" style={{ backgroundColor: 'rgba(0,0,0,0.2)' }}>
          <div className="bg-amber-900 text-white px-6 py-4 rounded-lg shadow-lg cursor-pointer hover:bg-amber-800 transition transform hover:scale-105" onClick={onShopNow}>
            <div className="text-lg font-bold">SHOP</div>
            <div className="text-lg font-bold">NOW</div>
          </div>

          <div className="text-left mt-8 md:mt-0 md:absolute md:top-1/2 md:-translate-y-1/2 md:right-16">
            <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold text-amber-900 drop-shadow-lg leading-tight">
              MODERN<br />
              FURNITURE
            </h1>
          </div>
        </div>
      </section>

      {/* Single "View" Button above the featured products grid (visible only when logged in as user) */}
      {commonProps.isLoggedIn && !commonProps.isAdmin && (
        <div className="py-4 flex justify-end items-center max-w-6xl mx-auto px-4">
          <button
            className="flex items-center space-x-2 p-3 bg-gray-200 text-gray-700 rounded-lg shadow-md hover:bg-gray-300 transition duration-300 transform hover:scale-105"
            onClick={onViewAllProducts}
            title="View All Products"
          >
            <Menu className="w-6 h-6" />
          </button>
        </div>
      )}

      {/* Initial 4 Featured Products Grid (below hero on landing page) */}
      <section className="py-8 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map((product) => (
              <div
                key={product.id}
                className="bg-white rounded-xl shadow-lg overflow-hidden transition-transform duration-300 hover:scale-105 cursor-pointer flex flex-col items-center justify-center relative p-2"
                onClick={commonProps.isAdmin ? () => {commonProps.setProductToEdit(product); commonProps.onNavigate('edit-product');} : onShopNow} // Admins go to edit, users to shop
              >
                <div className="relative w-full aspect-square max-w-[200px] max-h-[200px] mb-4">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="object-cover rounded-md w-full h-full"
                  />
                </div>
                <p className="text-lg font-semibold text-gray-800 text-center">{product.name}</p>
                {commonProps.isAdmin && (
                  <button
                    className="mt-2 px-3 py-1 bg-gray-200 text-gray-700 text-sm rounded-full hover:bg-gray-300 transition"
                    onClick={(e) => { e.stopPropagation(); commonProps.setProductToEdit(product); commonProps.onNavigate('edit-product'); }}
                  >
                    Edit
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

const FullProductGridPage: React.FC<CommonPageProps & { onSelectProduct: (product: Product) => void; onBackToHome: () => void }> = ({
  onSelectProduct,
  onBackToHome,
  ...commonProps
}) => {
  const [filter, setFilter] = useState('All'); // State for material filter

  const filteredProducts = commonProps.products.filter(product =>
    filter === 'All' || product.material === filter
  );


  const materials = Array.from(new Set(commonProps.products.map(p => p.material)));


  return (
    <div className="min-h-screen bg-white">
      <Header
        onHomeClick={onBackToHome}
        onContactClick={commonProps.openContactModal}
        onSignUpClick={() => commonProps.openSignUpModal(false)}
        onSignOutClick={commonProps.handleSignOut}
        isLoggedIn={commonProps.isLoggedIn}
        isAdmin={commonProps.isAdmin}
        cartItemsCount={commonProps.cartItemsCount}
        unreadNotificationsCount={commonProps.unreadNotificationsCount}
        onCartClick={commonProps.onCartClick}
        onAdminClick={commonProps.onAdminClick}
        onNotificationsClick={commonProps.onNotificationsClick}
        onSearchClick={commonProps.openSearchModal}
      />

      {/* Filter Section (only for users) */}
      {!commonProps.isAdmin && (
        <section className="py-4 pt-20 bg-gray-50">
          <div className="max-w-6xl mx-auto px-4 flex justify-center space-x-4">
            <button
              onClick={() => setFilter('All')}
              className={`px-4 py-2 rounded-full text-sm font-medium ${filter === 'All' ? 'bg-amber-900 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
            >
              All
            </button>
            {materials.map(mat => (
              <button
                key={mat}
                onClick={() => setFilter(mat)}
                className={`px-4 py-2 rounded-full text-sm font-medium ${filter === mat ? 'bg-amber-900 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
              >
                {mat}
              </button>
            ))}
          </div>
        </section>
      )}


      {/* Full Product Grid Section */}
      <section className="py-8">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <div
                key={product.id}
                className="bg-white rounded-xl shadow-lg overflow-hidden flex flex-col cursor-pointer"
                onClick={() => onSelectProduct(product)}
              >
                <div className="relative w-full aspect-square">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="object-cover rounded-t-xl w-full h-full"
                  />
                </div>
                <div className="p-4 flex-grow flex flex-col justify-between">
                  <div className="mb-2">
                    <p className="text-xs text-gray-500 uppercase">{product.material}</p>
                    <h3 className="text-lg font-semibold text-gray-900">{product.name}</h3>
                  </div>
                  <div className="flex justify-between items-center mt-auto">
                    <p className="text-xl font-bold text-amber-700">${product.price}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

const ProductDetailPage: React.FC<CommonPageProps & { product: Product; onBack: () => void; onAddToCart: (product: Product) => void }> = ({
  product,
  onBack,
  onAddToCart,
  ...commonProps
}) => {
  if (!product) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
        <p className="text-xl text-gray-700 mb-4">Product not found. Please go back.</p>
        <button
          className="px-6 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400 transition"
          onClick={onBack}
        >
          Back
        </button>
      </div>
    );
  }

  const thumbnails = Array(4).fill(product.image); // Dummy thumbnails
  const dimensionsList = product.dimensions.split('\n');

  return (
    <div className="min-h-screen bg-gray-50">
      <Header
        onHomeClick={commonProps.onHomeClick}
        onContactClick={commonProps.openContactModal}
        onSignUpClick={() => commonProps.openSignUpModal(false)}
        onSignOutClick={commonProps.handleSignOut}
        isLoggedIn={commonProps.isLoggedIn}
        isAdmin={commonProps.isAdmin}
        cartItemsCount={commonProps.cartItemsCount}
        unreadNotificationsCount={commonProps.unreadNotificationsCount}
        onCartClick={commonProps.onCartClick}
        onAdminClick={commonProps.onAdminClick}
        onNotificationsClick={commonProps.onNotificationsClick}
        onSearchClick={commonProps.openSearchModal}
      />

      <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8 flex flex-col items-center pt-20">
        <div className="bg-white rounded-xl shadow-lg p-6 sm:p-8 lg:p-10 w-full max-w-5xl">
          <button
            className="mb-6 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
            onClick={onBack}
          >
            &larr; Back to Products Grid
          </button>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Column: Main Image & Thumbnails & Rating */}
            <div className="flex flex-col items-center">
              <div className="relative w-full aspect-square max-h-[450px] rounded-xl overflow-hidden shadow-md mb-4">
                <img
                  src={product.image}
                  alt={product.name}
                  className="object-cover object-center w-full h-full"
                />
              </div>
              <div className="grid grid-cols-4 gap-2 w-full max-w-md">
                {thumbnails.map((thumb, index) => (
                  <div key={index} className="relative w-full aspect-square rounded-md overflow-hidden cursor-pointer border-2 border-transparent hover:border-amber-500 transition">
                    <img
                      src={thumb}
                      alt={`${product.name} thumbnail ${index + 1}`}
                      className="object-cover w-full h-full"
                    />
                  </div>
                ))}
              </div>
              <div className="mt-4">
                <StarRating rating={product.rating} />
              </div>
            </div>

            {/* Right Column: Details, Price, Dimensions, Add to Cart */}
            <div className="flex flex-col justify-between">
              <div>
                <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">{product.name}</h2>
                <p className="text-lg text-gray-700 leading-relaxed mb-6">{product.description}</p>

                <div className="bg-gray-100 rounded-lg p-4 mb-6">
                  <h3 className="font-semibold text-xl text-gray-800 mb-2">Dimensions:</h3>
                  {dimensionsList.map((dim, index) => (
                    <p key={index} className="text-gray-700">{dim}</p>
                  ))}
                </div>

                <p className="text-3xl font-bold text-amber-700 mt-4 mb-6">${product.price}</p>

              </div>
              {!commonProps.isAdmin && ( // Only show Add to Cart for users
                <button
                  className="mt-auto w-full px-6 py-3 bg-amber-900 text-white text-lg font-semibold rounded-full shadow-lg hover:bg-amber-800 transition duration-300 transform hover:scale-105"
                  onClick={() => onAddToCart(product)}
                >
                  Add to Cart
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

interface CheckoutPageProps extends CommonPageProps {
  cartItems: CartItem[];
  onConfirmOrder: (contactName: string, contactPhoneNumber: string, contactAddress: string) => void; // Updated type
  onUpdateQuantity: (productId: string, newQuantity: number) => void;
  onRemoveItem: (productId: string) => void;
  onBack: () => void;
}

const CheckoutPage: React.FC<CheckoutPageProps> = ({ // Updated interface
  cartItems,
  onConfirmOrder,
  onUpdateQuantity,
  onRemoveItem,
  onBack,
  ...commonProps
}) => {
  const [contactName, setContactName] = useState('');
  const [contactPhoneNumber, setContactPhoneNumber] = useState(''); // Changed from contactEmail
  const [contactAddress, setContactAddress] = useState('');
  const [showContactForm, setShowContactForm] = useState(false); // State to toggle between cart and contact form

  const totalAmount = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactName || !contactPhoneNumber || !contactAddress) { // Updated validation
      alert('Please fill in all contact details (Name, Phone Number, and Delivery Address).');
      return;
    }
    if (cartItems.length === 0) {
      alert('Your cart is empty. Please add items before placing your order.');
      return;
    }
    onConfirmOrder(contactName, contactPhoneNumber, contactAddress); // Updated arguments
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header
        onHomeClick={commonProps.onHomeClick}
        onContactClick={commonProps.openContactModal}
        onSignUpClick={() => commonProps.openSignUpModal(false)}
        onSignOutClick={commonProps.handleSignOut}
        isLoggedIn={commonProps.isLoggedIn}
        isAdmin={commonProps.isAdmin}
        cartItemsCount={commonProps.cartItemsCount}
        unreadNotificationsCount={commonProps.unreadNotificationsCount}
        onCartClick={commonProps.onCartClick}
        onAdminClick={commonProps.onAdminClick}
        onNotificationsClick={commonProps.onNotificationsClick}
        onSearchClick={commonProps.openSearchModal}
      />

      <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8 flex flex-col items-center pt-20">
        <div className="bg-white rounded-xl shadow-lg p-6 sm:p-8 lg:p-10 w-full max-w-xl">
          <button
            className="mb-6 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
            onClick={onBack}
          >
            &larr; Back to Products Grid
          </button>

          {/* Conditional rendering for Your Order vs. Contact Information */}
          {!showContactForm ? (
            // "Your Order" section (Frame 5)
            <>
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6 text-center">Your Order</h2>

              {cartItems.length === 0 ? (
                <p className="text-center text-gray-600 text-lg">Your cart is empty.</p>
              ) : (
                <div className="space-y-4">
                  {cartItems.map((item) => (
                    <div key={item.id} className="flex justify-between items-center bg-gray-100 p-3 rounded-md shadow-sm">
                      <div className="flex items-center space-x-3">
                        {/* Image of item in cart */}
                        <div className="relative w-16 h-16 flex-shrink-0 rounded-md overflow-hidden">
                          <img src={item.image} alt={item.name} className="object-cover w-full h-full" />
                        </div>
                        <span className="text-gray-800 text-lg font-medium">{item.name}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                          disabled={item.quantity <= 1}
                          className="p-2 rounded-full bg-gray-200 hover:bg-gray-300 disabled:opacity-50 transition"
                        >
                          <Minus className="w-4 h-4 text-gray-700" />
                        </button>
                        <span className="font-semibold text-xl text-gray-900">{item.quantity}</span>
                        <button
                          onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                          className="p-2 rounded-full bg-gray-200 hover:bg-gray-300 transition"
                        >
                          <Plus className="w-4 h-4 text-gray-700" />
                        </button>
                        <button
                          onClick={() => onRemoveItem(item.id)}
                          className="p-2 rounded-full bg-red-100 text-red-600 hover:bg-red-200 transition"
                          title="Remove item"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                  <div className="pt-4 border-t-2 border-gray-200 flex justify-between items-center">
                    <span className="text-xl font-bold text-gray-900">Total:</span>
                    <span className="text-2xl font-bold text-amber-800">${totalAmount.toFixed(2)}</span>
                  </div>
                  <button
                    className="mt-6 w-full px-6 py-3 bg-amber-900 text-white text-lg font-semibold rounded-full shadow-lg hover:bg-amber-800 transition duration-300 transform hover:scale-105"
                    onClick={() => setShowContactForm(true)} // Transition to contact form
                  >
                    Proceed to Checkout
                  </button>
                </div>
              )}
            </>
          ) : (
            // "Checkout" section (Frame 7)
            <>
              <h2 className="text-2xl font-bold text-gray-900 mt-4 mb-5 text-center">Checkout</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-gray-700 text-sm font-bold mb-2">
                    Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    className="shadow appearance-none border rounded-lg w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-amber-400 bg-gray-100"
                    placeholder="Enter your name"
                    value={contactName}
                    onChange={(e) => setContactName(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    id="phoneNumber"
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-amber-500 focus:border-amber-500 sm:text-sm bg-gray-100"
                    placeholder="Enter your phone number"
                    value={contactPhoneNumber}
                    onChange={(e) => setContactPhoneNumber(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <label htmlFor="address" className="block text-gray-700 text-sm font-bold mb-2">
                    Delivery Address
                  </label>
                  <textarea
                    id="address"
                    rows={3}
                    className="shadow appearance-none border rounded-lg w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-amber-400 resize-none bg-gray-100"
                    placeholder="Enter your address"
                    value={contactAddress}
                    onChange={(e) => setContactAddress(e.target.value)}
                    required
                  ></textarea>
                </div>
                <div className="pt-4 flex justify-between items-center">
                  <span className="text-xl font-bold text-gray-900">Total:</span>
                  <span className="text-2xl font-bold text-amber-800">${totalAmount.toFixed(2)}</span>
                </div>

                <button
                  type="submit"
                  className="mt-6 w-full px-6 py-3 bg-amber-900 text-white text-lg font-semibold rounded-full shadow-lg hover:bg-amber-800 transition duration-300 transform hover:scale-105"
                >
                  Place the Order
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

const ConfirmOrderPage: React.FC<CommonPageProps & { onBackToHome: () => void }> = ({
  onBackToHome,
  ...commonProps
}) => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header
        onHomeClick={onBackToHome}
        onContactClick={commonProps.openContactModal}
        onSignUpClick={() => commonProps.openSignUpModal(false)}
        onSignOutClick={commonProps.handleSignOut}
        isLoggedIn={commonProps.isLoggedIn}
        isAdmin={commonProps.isAdmin}
        cartItemsCount={commonProps.cartItemsCount}
        unreadNotificationsCount={commonProps.unreadNotificationsCount}
        onCartClick={commonProps.onCartClick}
        onAdminClick={commonProps.onAdminClick}
        onNotificationsClick={commonProps.onNotificationsClick}
        onSearchClick={commonProps.openSearchModal}
      />
      <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8 flex flex-col items-center justify-center pt-20">
        <div className="bg-white rounded-xl shadow-lg p-10 sm:p-12 lg:p-16 text-center mt-12 mb-8">
          <div className="text-green-500 mb-6">
            <svg
              className="w-24 h-24 mx-auto"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
            </svg>
          </div>
          <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">Order Confirmed!</h2>
          <p className="text-lg text-gray-600 mb-8">Thank you for your purchase.</p>
          <button
            className="px-8 py-3 bg-amber-900 text-white text-lg font-semibold rounded-full shadow-lg hover:bg-amber-800 transition duration-300 transform hover:scale-105"
            onClick={onBackToHome}
          >
            Back to Home
          </button>
        </div>
      </div>
    </div>
  );
};

// --- Admin Panel Components ---

const AdminPanelPage: React.FC<CommonPageProps & { onNavigate: (page: string) => void }> = ({ // Added onNavigate here
  onNavigate,
  ...commonProps
}) => {
  if (!commonProps.isAdmin) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4 pt-20">
        <h2 className="text-3xl font-bold text-red-500 mb-4">Access Denied</h2>
        <p className="text-lg text-gray-700">You must be logged in as an administrator to access this page.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header
        onHomeClick={commonProps.onHomeClick}
        onContactClick={commonProps.openContactModal}
        onSignUpClick={() => commonProps.openSignUpModal(false)}
        onSignOutClick={commonProps.handleSignOut}
        isLoggedIn={commonProps.isLoggedIn}
        isAdmin={commonProps.isAdmin}
        cartItemsCount={commonProps.cartItemsCount}
        unreadNotificationsCount={commonProps.unreadNotificationsCount}
        onCartClick={commonProps.onCartClick} // This will be hidden for admin by Header logic
        onAdminClick={() => onNavigate('admin-panel')}
        onNotificationsClick={commonProps.onNotificationsClick}
        onSearchClick={commonProps.openSearchModal}
      />
      <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8 flex flex-col items-center pt-20">
        <h2 className="text-4xl font-bold text-gray-900 mb-8">Admin Panel</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-2xl">
          <button
            className="flex items-center justify-center p-6 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transition transform hover:scale-105 text-xl font-semibold"
            onClick={() => onNavigate('manage-products')}
          >
            Manage Products
          </button>
          <button
            className="flex items-center justify-center p-6 bg-green-600 text-white rounded-lg shadow-md hover:bg-green-700 transition transform hover:scale-105 text-xl font-semibold"
            onClick={() => onNavigate('manage-orders')}
          >
            Manage Orders
          </button>
          <button
            className="flex items-center justify-center p-6 bg-purple-600 text-white rounded-lg shadow-md hover:bg-purple-700 transition transform hover:scale-105 text-xl font-semibold"
            onClick={() => onNavigate('send-notification')}
          >
            Send Notification
          </button>
        </div>
      </div>
    </div>
  );
};


interface AddEditProductFormProps {
  product?: Product; // Optional, for editing
  onSave: (product: Product) => void;
  onCancel: () => void;
}

const AddEditProductForm: React.FC<AddEditProductFormProps> = ({ product, onSave, onCancel }) => {
  const [formData, setFormData] = useState<Product>(product || {
    id: '', name: '', description: '', price: 0, image: '', rating: 0, dimensions: '', material: '', color: ''
  });

  useEffect(() => {
    if (product) {
      setFormData(product);
    }
  }, [product]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const target = e.target as HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement;
    const { name, value } = target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'price' || name === 'rating' ? parseFloat(value) : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.price || !formData.image || !formData.material || !formData.color) {
      alert('Please fill in all required fields (Name, Price, Image, Material, Color).');
      return;
    }
    // Generate new ID if adding
    const savedProduct = { ...formData, id: formData.id || `prod-${Date.now()}` };
    onSave(savedProduct);
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 sm:p-8 w-full max-w-2xl">
      <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">{product ? 'Edit Product' : 'Add New Product'}</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Product Name</label>
          <input type="text" name="name" value={formData.name} onChange={handleChange} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Description</label>
          <textarea name="description" value={formData.description} onChange={handleChange} rows={3} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"></textarea>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Price ($)</label>
          <input type="number" name="price" value={formData.price} onChange={handleChange} required step="0.01" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Image URL</label>
          <input type="text" name="image" value={formData.image} onChange={handleChange} required placeholder="/images/new-product.png" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Rating (1-5)</label>
          <input type="number" name="rating" value={formData.rating} onChange={handleChange} min="1" max="5" step="1" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Dimensions (e.g., 200cm L x 90cm W x 80cm H)</label>
          <textarea name="dimensions" value={formData.dimensions} onChange={handleChange} rows={2} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"></textarea>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Material (e.g., Polyester, Velvet)</label>
          <input type="text" name="material" value={formData.material} onChange={handleChange} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Color (e.g., Navy, Teal)</label>
          <input type="text" name="color" value={formData.color} onChange={handleChange} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md" />
        </div>
        <div className="flex justify-end space-x-4 mt-6">
          <button type="button" onClick={onCancel} className="px-5 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100">Cancel</button>
          <button type="submit" className="px-5 py-2 bg-amber-900 text-white rounded-md hover:bg-amber-800 flex items-center space-x-2">
            <Save className="w-5 h-5" />
            <span>{product ? 'Save Changes' : 'Add Product'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};


const ManageProductsPage: React.FC<CommonPageProps & { onBack: () => void; onAddProduct: () => void; onEditProduct: (product: Product) => void; onDeleteProduct: (id: string) => void }> = ({
  onBack,
  onAddProduct,
  onEditProduct,
  onDeleteProduct,
  ...commonProps
}) => {
  if (!commonProps.isAdmin) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4 pt-20">
        <h2 className="text-3xl font-bold text-red-500 mb-4">Access Denied</h2>
        <p className="text-lg text-gray-700">You must be logged in as an administrator to access this page.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header
        onHomeClick={commonProps.onHomeClick}
        onContactClick={commonProps.openContactModal}
        onSignUpClick={() => commonProps.openSignUpModal(false)}
        onSignOutClick={commonProps.handleSignOut}
        isLoggedIn={commonProps.isLoggedIn}
        isAdmin={commonProps.isAdmin}
        cartItemsCount={commonProps.cartItemsCount}
        unreadNotificationsCount={commonProps.unreadNotificationsCount}
        onCartClick={commonProps.onCartClick}
        onAdminClick={() => commonProps.onAdminClick()}
        onNotificationsClick={commonProps.onNotificationsClick}
        onSearchClick={commonProps.openSearchModal}
      />
      <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8 flex flex-col items-center pt-20">
        <div className="w-full max-w-4xl bg-white rounded-xl shadow-lg p-6 sm:p-8">
          <div className="flex justify-between items-center mb-6">
            <button
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
              onClick={onBack}
            >
              &larr; Back to Admin Panel
            </button>
            <h2 className="text-3xl font-bold text-gray-900">Manage Products</h2>
            <button
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center space-x-2"
              onClick={onAddProduct}
            >
              <Plus className="w-5 h-5" />
              <span>Add New</span>
            </button>
          </div>

          {commonProps.products.length === 0 ? (
            <p className="text-center text-gray-600 text-lg">No products available. Add some!</p>
          ) : (
            <div className="space-y-4">
              {commonProps.products.map((product) => (
                <div key={product.id} className="flex flex-col sm:flex-row items-center bg-gray-50 p-4 rounded-lg shadow-sm">
                  <div className="relative w-20 h-20 flex-shrink-0 mr-4">
                    <img src={product.image} alt={product.name} className="object-cover rounded-md w-full h-full" />
                  </div>
                  <div className="flex-grow text-center sm:text-left mt-2 sm:mt-0">
                    <h3 className="text-lg font-semibold text-gray-900">{product.name}</h3>
                    <p className="text-gray-600 text-sm">${product.price.toFixed(2)} | {product.material} {product.color}</p>
                  </div>
                  <div className="flex space-x-2 mt-4 sm:mt-0">
                    <button
                      className="p-2 bg-yellow-500 text-white rounded-md hover:bg-yellow-600 transition"
                      onClick={() => onEditProduct(product)}
                      title="Edit Product"
                    >
                      <Edit className="w-5 h-5" />
                    </button>
                    <button
                      className="p-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition"
                      onClick={() => onDeleteProduct(product.id)}
                      title="Delete Product"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

interface AdminOrderDetailPageProps extends CommonPageProps {
  order: Order;
  onBack: () => void;
}

const AdminOrderDetailPage: React.FC<AdminOrderDetailPageProps> = ({ order, onBack, ...commonProps }) => {
  if (!commonProps.isAdmin || !order) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4 pt-20">
        <h2 className="text-3xl font-bold text-red-500 mb-4">Access Denied or Order Not Found</h2>
        <p className="text-lg text-gray-700">You must be logged in as an administrator or the order does not exist.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header
        onHomeClick={commonProps.onHomeClick}
        onContactClick={commonProps.openContactModal}
        onSignUpClick={() => commonProps.openSignUpModal(false)}
        onSignOutClick={commonProps.handleSignOut}
        isLoggedIn={commonProps.isLoggedIn}
        isAdmin={commonProps.isAdmin}
        cartItemsCount={commonProps.cartItemsCount}
        unreadNotificationsCount={commonProps.unreadNotificationsCount}
        onCartClick={commonProps.onCartClick}
        onAdminClick={commonProps.onAdminClick}
        onNotificationsClick={commonProps.onNotificationsClick}
        onSearchClick={commonProps.openSearchModal}
      />
      <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8 flex flex-col items-center pt-20">
        <div className="w-full max-w-2xl bg-white rounded-xl shadow-lg p-6 sm:p-8">
          <div className="flex justify-between items-center mb-6">
            <button
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
              onClick={onBack}
            >
              &larr; Back to Manage Orders
            </button>
            <h2 className="text-3xl font-bold text-gray-900">Order Details</h2>
          </div>

          <div className="space-y-4">
            <div className="bg-gray-100 p-4 rounded-md">
              <p className="font-bold text-gray-900 text-lg">Order ID: {order.id}</p>
              <p className="text-gray-700">Customer Name: {order.customerName}</p>
              <p className="text-gray-700">Phone Number: {order.customerPhoneNumber}</p>
              <p className="text-gray-700">Delivery Address: {order.customerAddress}</p>
              <p className="font-semibold text-amber-800 text-xl mt-2">Total: ${order.total.toFixed(2)}</p>
              <p className="text-sm text-gray-500">Order Date: {new Date(order.orderDate).toLocaleString()}</p>
            </div>

            <h3 className="font-bold text-gray-900 text-xl mt-6 mb-3">Items Ordered:</h3>
            <div className="space-y-3">
              {order.items.map(item => (
                <div key={item.id} className="flex items-center space-x-3 bg-gray-50 p-3 rounded-md shadow-sm">
                  <div className="relative w-16 h-16 flex-shrink-0 rounded-md overflow-hidden">
                    <img src={item.image} alt={item.name} className="object-cover w-full h-full" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{item.name}</p>
                    <p className="text-gray-700 text-sm">Quantity: {item.quantity}</p>
                    <p className="text-amber-700 font-semibold">${item.price.toFixed(2)} each</p>
                  </div>
                </div>
              ))}
            </div>
            <button
              className="mt-6 w-full px-6 py-3 bg-green-600 text-white text-lg font-semibold rounded-full shadow-lg hover:bg-green-700 transition duration-300 transform hover:scale-105"
              onClick={() => alert('Order confirmed by admin!')} // Placeholder for admin confirmation action
            >
              Confirm Order
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const ManageOrdersPage: React.FC<CommonPageProps & { onBack: () => void }> = ({
  onBack,
  ...commonProps
}) => {
  if (!commonProps.isAdmin) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4 pt-20">
        <h2 className="text-3xl font-bold text-red-500 mb-4">Access Denied</h2>
        <p className="text-lg text-gray-700">You must be logged in as an administrator to access this page.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header
        onHomeClick={commonProps.onHomeClick}
        onContactClick={commonProps.openContactModal}
        onSignUpClick={() => commonProps.openSignUpModal(false)}
        onSignOutClick={commonProps.handleSignOut}
        isLoggedIn={commonProps.isLoggedIn}
        isAdmin={commonProps.isAdmin}
        cartItemsCount={commonProps.cartItemsCount}
        unreadNotificationsCount={commonProps.unreadNotificationsCount}
        onCartClick={commonProps.onCartClick}
        onAdminClick={() => commonProps.onAdminClick()}
        onNotificationsClick={commonProps.onNotificationsClick}
        onSearchClick={commonProps.openSearchModal}
      />
      <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8 flex flex-col items-center pt-20">
        <div className="w-full max-w-4xl bg-white rounded-xl shadow-lg p-6 sm:p-8">
          <div className="flex justify-between items-center mb-6">
            <button
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
              onClick={onBack}
            >
              &larr; Back to Admin Panel
            </button>
            <h2 className="text-3xl font-bold text-gray-900">Manage Orders</h2>
          </div>

          {commonProps.orders.length === 0 ? (
            <p className="text-center text-gray-600 text-lg">No orders placed yet.</p>
          ) : (
            <div className="space-y-4">
              {commonProps.orders.map((order) => (
                <div key={order.id} className="bg-gray-50 p-4 rounded-lg shadow-sm flex justify-between items-center">
                  <div>
                    <p className="font-bold text-lg text-gray-900">New Order</p> {/* Changed to "New Order" */}
                    <p className="text-sm text-gray-500">From: {order.customerName}</p>
                    <p className="text-sm text-gray-500">Total: ${order.total.toFixed(2)}</p>
                  </div>
                  <button
                    onClick={() => commonProps.onCheckOrder(order)} // Use onCheckOrder from commonProps
                    className="px-4 py-2 bg-amber-500 text-white rounded-md hover:bg-amber-600 transition"
                  >
                    Check
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};


// Main Home Page Component (routes between the different sub-pages)
export default function HomePage() {
  const [isModalOpen, setIsModalOpen] = useState(false); // Sign-up modal
  const [isContactModalOpen, setIsContactModal] = useState(false); // Contact modal
  const [isNotificationsModalOpen, setIsNotificationsModalOpen] = useState(false); // Notifications modal
  const [isSendNotificationModalOpen, setIsSendNotificationModalOpen] = useState(false); // Admin Send Notification modal
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false); // New: Search modal state

  const [isLoggedIn, setIsLoggedIn] = useState(false); // User logged in state
  const [isAdmin, setIsAdmin] = useState(false); // Admin status

  // --- State for Data (Products, Cart, Orders, Notifications) ---
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);

  // State for page navigation
  const [currentPage, setCurrentPage] = useState<'home-featured' | 'full-products-grid' | 'productDetail' | 'checkout' | 'confirmOrder' | 'admin-panel' | 'manage-products' | 'add-product' | 'edit-product' | 'manage-orders' | 'admin-order-detail' | 'send-notification'>('home-featured');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [productToEdit, setProductToEdit] = useState<Product | null>(null); // For editing products
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null); // For admin order details

  // --- Load data from localStorage on component mount ---
  useEffect(() => {
    try {
      const storedProducts = localStorage.getItem('products');
      if (storedProducts) setProducts(JSON.parse(storedProducts));
    } catch (error) {
      console.error("Failed to load products from localStorage", error);
      setProducts(initialProducts); // Fallback to initial products
    }
    try {
      const storedOrders = localStorage.getItem('orders');
      if (storedOrders) setOrders(JSON.parse(storedOrders));
    } catch (error) {
      console.error("Failed to load orders from localStorage", error);
    }
    try {
      const storedNotifications = localStorage.getItem('notifications');
      if (storedNotifications) setNotifications(JSON.parse(storedNotifications));
    } catch (error) {
      console.error("Failed to load notifications from localStorage", error);
    }
    // Check login status (simplified, in a real app this would involve tokens)
    const loggedInStatus = localStorage.getItem('isLoggedIn') === 'true';
    const adminStatus = localStorage.getItem('isAdmin') === 'true';
    setIsLoggedIn(loggedInStatus);
    setIsAdmin(adminStatus);
  }, []);

  // --- Save data to localStorage on state changes ---
  useEffect(() => {
    localStorage.setItem('products', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('orders', JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem('notifications', JSON.stringify(notifications));
  }, [notifications]);

  useEffect(() => {
    localStorage.setItem('isLoggedIn', String(isLoggedIn));
    localStorage.setItem('isAdmin', String(isAdmin));
  }, [isLoggedIn, isAdmin]);


  // --- Modal handlers ---
  const openSignUpModal = (admin: boolean) => {
    setIsModalOpen(true);
    // You could set initial admin checkbox state here if desired
  };
  const closeSignUpModal = () => setIsModalOpen(false);
  const openContactModal = () => setIsContactModal(true);
  const closeContactModal = () => setIsContactModal(false);
  const openNotificationsModal = () => setIsNotificationsModalOpen(true);
  const closeNotificationsModal = () => setIsNotificationsModalOpen(false);
  const openSendNotificationModal = () => setIsSendNotificationModalOpen(true);
  const closeSendNotificationModal = () => setIsSendNotificationModalOpen(false);
  const openSearchModal = () => setIsSearchModalOpen(true); // New: open search modal
  const closeSearchModal = () => setIsSearchModalOpen(false); // New: close search modal


  // --- Auth handlers ---
  const handleSignUpSuccess = (admin: boolean) => {
    setIsLoggedIn(true);
    setIsAdmin(admin);
    closeSignUpModal();
    // Redirect after login/signup based on role
    if (admin) {
      setCurrentPage('admin-panel'); // Admin goes to admin panel
    } else {
      setCurrentPage('home-featured'); // User goes to featured home page
    }
  };
  const handleSignOut = () => {
    setIsLoggedIn(false);
    setIsAdmin(false);
    setCartItems([]);
    setSelectedProduct(null);
    setSelectedOrder(null); // Clear selected order on sign out
    setCurrentPage('home-featured');
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('isAdmin');
  };

  // --- Navigation handlers ---
  const navigateToFullProductsGrid = () => {
    if (isLoggedIn) {
      setCurrentPage('full-products-grid');
    } else {
      openSignUpModal(false);
    }
  };

  const handleViewAllProducts = () => {
    if (isLoggedIn) {
      setCurrentPage('full-products-grid');
    } else {
      openSignUpModal(false);
    }
  };

  const handleSelectProduct = (product: Product) => {
    setSelectedProduct(product);
    setCurrentPage('productDetail');
  };

  const handleHomeClick = () => {
    setCurrentPage('home-featured');
    setSelectedProduct(null);
    setSelectedOrder(null);
  };

  const handleAdminClick = () => {
    setCurrentPage('admin-panel');
  };

  // --- Cart & Order handlers ---
  const handleAddToCart = (product: Product) => {
    setCartItems(prevItems => {
      const existingItem = prevItems.find(item => item.id === product.id);
      if (existingItem) {
        return prevItems.map(item =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      } else {
        return [...prevItems, { ...product, quantity: 1 }];
      }
    });
    alert(`${product.name} added to cart!`);
  };

  const handleUpdateCartQuantity = (productId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      handleRemoveItemFromCart(productId);
    } else {
      setCartItems(prevItems =>
        prevItems.map(item =>
          item.id === productId ? { ...item, quantity: newQuantity } : item
        )
      );
    }
  };

  const handleRemoveItemFromCart = (productId: string) => {
    setCartItems(prevItems => prevItems.filter(item => item.id !== productId));
  };

  const handleConfirmOrder = (customerName: string, customerPhoneNumber: string, customerAddress: string) => { // Updated arguments
    const newOrder: Order = {
      id: `order-${Date.now()}`,
      items: cartItems,
      customerName,
      customerPhoneNumber, // Changed from customerEmail
      customerAddress,
      total: cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0),
      orderDate: new Date().toISOString(),
    };
    setOrders(prevOrders => [...prevOrders, newOrder]);
    setCartItems([]); // Clear cart after order

    // Add a notification for the admin about the new order
    setNotifications(prevNotifications => [{
      id: `notif-${Date.now()}-order`,
      message: `New Order: ${newOrder.id}`,
      date: new Date().toISOString(),
      read: false,
    }, ...prevNotifications]);

    setCurrentPage('confirmOrder');
  };

  // --- Admin Product Management Handlers ---
  const handleAddProduct = (newProduct: Product) => {
    setProducts(prevProducts => [...prevProducts, newProduct]);
    setCurrentPage('manage-products'); // Go back to product list
    alert('Product added successfully!');
  };

  const handleEditProduct = (updatedProduct: Product) => {
    setProducts(prevProducts =>
      prevProducts.map(p => (p.id === updatedProduct.id ? updatedProduct : p))
    );
    setCurrentPage('manage-products'); // Go back to product list
    alert('Product updated successfully!');
  };

  const handleDeleteProduct = (productId: string) => {
    if (window.confirm('Are you sure you want to delete this product?')) { // Using window.confirm for simplicity, replace with custom modal
      setProducts(prevProducts => prevProducts.filter(p => p.id !== productId));
      alert('Product deleted successfully!');
    }
  };

  // --- Notification Handlers ---
  const handleSendNotification = (message: string) => {
    const newNotification: Notification = {
      id: `notif-${Date.now()}`,
      message,
      date: new Date().toISOString(),
      read: false,
    };
    setNotifications(prevNotifications => [newNotification, ...prevNotifications]); // Add to the top
    alert('Notification sent!');
  };

  const handleMarkNotificationAsRead = (id: string) => {
    setNotifications(prevNotifications =>
      prevNotifications.map(n => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const handleCheckOrder = (order: Order) => {
    setSelectedOrder(order);
    setCurrentPage('admin-order-detail');
  };

  const unreadNotificationsCount = notifications.filter(n => !n.read).length;


  // --- Common props for all pages ---
  const commonPageProps = {
    isLoggedIn,
    isAdmin,
    openSignUpModal,
    openContactModal,
    handleSignOut,
    cartItemsCount: cartItems.length,
    unreadNotificationsCount,
    onHomeClick: handleHomeClick,
    onCartClick: () => setCurrentPage('checkout'),
    onAdminClick: handleAdminClick,
    onNotificationsClick: openNotificationsModal,
    products, // Pass products state
    setProducts, // Pass products setter
    orders, // Pass orders state
    setOrders, // Pass orders setter
    notifications, // Pass notifications state
    setNotifications, // Pass notifications setter
    openSearchModal: openSearchModal, // Added for search modal
    onCheckOrder: handleCheckOrder, // Added for admin to check orders
    setProductToEdit // Passing the setter for product to edit
  };

  // --- Conditional rendering of the main content based on currentPage ---
  const renderPageContent = () => {
    switch (currentPage) {
      case 'home-featured':
        return <HomeFeaturedPage onNavigate={function (page: string): void {
          throw new Error('Function not implemented.');
        } } onShopNow={navigateToFullProductsGrid} onViewAllProducts={handleViewAllProducts} {...commonPageProps} />;
      case 'full-products-grid':
        return <FullProductGridPage onNavigate={function (page: string): void {
          throw new Error('Function not implemented.');
        } } onSelectProduct={handleSelectProduct} onBackToHome={handleHomeClick} {...commonPageProps} />;
      case 'productDetail':
        return selectedProduct && (
          <ProductDetailPage
            product={selectedProduct}
            onBack={() => setCurrentPage('full-products-grid')}
            onAddToCart={handleAddToCart}
            onNavigate={(page: string) => setCurrentPage(page as typeof currentPage)}
            {...commonPageProps}
          />
        );
      case 'checkout':
        return (
          <CheckoutPage
            onNavigate={function (page: string): void {
              throw new Error('Function not implemented.');
            } } cartItems={cartItems}
            onConfirmOrder={handleConfirmOrder}
            onUpdateQuantity={handleUpdateCartQuantity}
            onRemoveItem={handleRemoveItemFromCart}
            onBack={() => setCurrentPage('full-products-grid')}
            {...commonPageProps}          />
        );
      case 'confirmOrder':
        return <ConfirmOrderPage onBackToHome={handleHomeClick} onNavigate={(page: string) => setCurrentPage(page as typeof currentPage)} {...commonPageProps} />;
      case 'admin-panel':
        return <AdminPanelPage onNavigate={(page: string) => setCurrentPage(page as typeof currentPage)} {...commonPageProps} />;
      case 'manage-products':
        return (
          <ManageProductsPage
            onBack={() => setCurrentPage('admin-panel')}
            onAddProduct={() => { setProductToEdit(null); setCurrentPage('add-product'); }}
            onEditProduct={(product) => { setProductToEdit(product); setCurrentPage('edit-product'); }}
            onDeleteProduct={handleDeleteProduct}
            onNavigate={(page: string) => setCurrentPage(page as typeof currentPage)}
            {...commonPageProps}
          />
        );
      case 'add-product':
        return (
          <div className="min-h-screen bg-gray-50 flex items-center justify-center pt-20 pb-8">
            <AddEditProductForm onSave={handleAddProduct} onCancel={() => setCurrentPage('manage-products')} />
          </div>
        );
      case 'edit-product':
        return (
          <div className="min-h-screen bg-gray-50 flex items-center justify-center pt-20 pb-8">
            {productToEdit && (
              <AddEditProductForm product={productToEdit} onSave={handleEditProduct} onCancel={() => setCurrentPage('manage-products')} />
            )}
          </div>
        );
      case 'manage-orders':
        return <ManageOrdersPage onNavigate={function (page: string): void {
          throw new Error('Function not implemented.');
        } } onBack={() => setCurrentPage('admin-panel')} {...commonPageProps} />;
      case 'admin-order-detail':
        return selectedOrder && (
          <AdminOrderDetailPage
            onNavigate={function (page: string): void {
              throw new Error('Function not implemented.');
            } } order={selectedOrder}
            onBack={() => setCurrentPage('manage-orders')}
            {...commonPageProps}          />
        );
      case 'send-notification':
        return (
          <div className="min-h-screen bg-gray-50 flex items-center justify-center pt-20 pb-8">
            <SendNotificationModal onSend={handleSendNotification} onClose={() => setCurrentPage('admin-panel')} />
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-white font-sans antialiased text-gray-900">
      <main>
        {renderPageContent()}
      </main>

      {/* Modals are rendered here so they overlay all page content */}
      {isModalOpen && <SignUpModal onClose={closeSignUpModal} onSignUpSuccess={handleSignUpSuccess} />}
      {isContactModalOpen && <ContactModal onClose={closeContactModal} />}
      {isNotificationsModalOpen && <NotificationCenterModal notifications={notifications} onClose={closeNotificationsModal} onMarkAsRead={handleMarkNotificationAsRead} onCheckOrder={handleCheckOrder} orders={orders} />}
      {isSearchModalOpen && <SearchModal onClose={closeSearchModal} products={products} onSelectProduct={handleSelectProduct} />}
    </div>
  );
}
