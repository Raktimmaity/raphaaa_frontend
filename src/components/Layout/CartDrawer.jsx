import { IoIosClose } from "react-icons/io";
import CartContents from "../Cart/CartContents";
import { useNavigate } from "react-router-dom";

const CartDrawer = ({drawerOpen, toggleCartDrawer}) => {
  const navigate = useNavigate();
  const handleCheckout = () => {
    toggleCartDrawer();
    navigate("/checkout");
  }
  return (
    <div className={`fixed top-0 right-0 w-3/4 sm:w-1/2 md:w-[30rem] h-full bg-white backdrop-blur-md shadow-lg transform transition-transform duration-300 flex flex-col z-50 ${drawerOpen ? 'translate-x-0' : 'translate-x-full'}`}>
      {/* Close Button */}
      <div className="flex justify-end p-4">
        <button onClick={toggleCartDrawer} className="text-gray-600 hover:text-gray-800">
            <IoIosClose className='h-6 w-6 text-gray-600'/>
        </button>
      </div>
      {/* cart content with scrollable area */}
      <div className="flex-grow p-4 overflow-y-auto">
        <h2 className="text-xl font-semibold mb-4">Your Cart</h2>
        {/* Components for cart contents */}
        <CartContents/>
      </div>
      {/* checkout button fixed */}
      <div className="p-4 bg-white sticky bottom-0">
        <button onClick={handleCheckout} className="w-full bg-sky-600 text-white py-3 rounded-lg font-semibold hover:bg-sky-700">Checkout</button>
        <p className="text-sm tracking-tighter text-gray-500 mt-2 text-center">Shipping, taxes and discount codes calculated at checkout.</p>
      </div>
    </div>
  )
}

export default CartDrawer;
