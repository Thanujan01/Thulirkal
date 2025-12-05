import { Trash2, Plus, Minus, ShoppingBag, AlertCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { useCart } from "@/hooks/useCart";
import { Link, useNavigate } from "react-router-dom";
import { getWhatsAppLinkForCart } from "@/lib/cart";

const Cart = () => {
  const { cart, removeFromCart, updateQuantity } = useCart();
  const navigate = useNavigate();
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  useEffect(() => {
    setSelectedIds((prev) => {
      const cartIds = cart.map((item) => item.id);
      const preserved = prev.filter((id) => cartIds.includes(id));
      const newOnes = cartIds.filter((id) => !prev.includes(id));
      return [...preserved, ...newOnes];
    });
  }, [cart]);

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((itemId) => itemId !== id) : [...prev, id]
    );
  };

  const selectedItems = cart.filter((item) => selectedIds.includes(item.id));
  const selectedSubtotal = selectedItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const selectedItemCount = selectedItems.reduce((sum, item) => sum + item.quantity, 0);
  const deliveryFee = selectedItems.length
    ? Math.max(...selectedItems.map((item) => item.deliveryFee ?? 0))
    : 0;
  const grandTotal = selectedItems.length ? selectedSubtotal + deliveryFee : 0;
  const hasSelection = selectedItems.length > 0;
  const truncateName = (name: string) => (name.length > 8 ? `${name.slice(0, 8)}...` : name);

  const handleClearCart = () => {
    cart.forEach((item) => removeFromCart(item.id));
    setShowClearConfirm(false);
  };

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-16 text-center">
          <ShoppingBag className="h-24 w-24 mx-auto text-muted-foreground mb-5" />
          <h1 className="text-3xl font-serif font-bold mb-4">Your Cart is Empty</h1>
          <p className="text-muted-foreground mb-8">
            Start adding some beautiful handmade products to your cart!
          </p>
          <div className="flex gap-4 justify-center">
            <Link to="/">
              <Button size="lg">Browse Products</Button>
            </Link>
            <Button variant="ghost" onClick={() => navigate(-1)} className="bg-accent text-accent-foreground">
              Back to Home
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="container mx-auto px-2 py-8 overflow-x-hidden">
        <h1 className="text-3xl md:text-4xl font-serif font-bold mb-7">Shopping Cart</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-2">
            {cart.map((item) => (
              <Card key={item.id} className="shadow-card">
                <CardContent className="p-4">
                  <div className="flex gap-2 items-start">
                    <Checkbox
                      checked={selectedIds.includes(item.id)}
                      onCheckedChange={() => toggleSelect(item.id)}
                      className="mt-10 h-5 w-5 rounded-none"
                    />
                    <div className="flex gap-4 items-start flex-1">
                      {/* Product Image */}
                      <Link to={`/product/${item.id}`} className="flex-shrink-0">
                        <img
                          src={item.images[0]}
                          alt={item.name}
                          className="w-24 h-24 object-cover rounded-lg hover:opacity-80 transition-opacity max-w-full"
                        />
                      </Link>

                      {/* Product Details */}
                      <div className="flex-1 min-w-0">
                        <Link to={`/product/${item.id}`}>
                          <h3
                            className="font-semibold text-lg mb-1 hover:text-primary transition-colors truncate"
                            title={item.name}
                          >
                            {truncateName(item.name)}
                          </h3>
                        </Link>
                        <p className="text-sm text-muted-foreground mb-2">
                          {item.category}
                        </p>
                        <p className="font-bold text-primary">Rs.{item.price.toFixed(2)}</p>
                      </div>

                      {/* Quantity Controls & Remove */}
                      <div className="flex flex-col items-end justify-start gap-3 pt-0">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => removeFromCart(item.id)}
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>

                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="icon"
                            className={`h-8 w-8 ${item.quantity <= 1 ? "opacity-50 cursor-not-allowed" : ""}`}
                            onClick={() => {
                              if (item.quantity > 1) updateQuantity(item.id, item.quantity - 1);
                            }}
                            disabled={item.quantity <= 1}
                          >
                            <Minus className="h-3 w-3" />
                          </Button>
                          <span className="w-8 text-center font-semibold">{item.quantity}</span>
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}

            {/* Clear Button */}
            <div className="flex justify-end mt-6">
              <Button
                variant="outline"
                className="bg-white text-destructive border border-black/30 shadow-sm hover:shadow-md hover:bg-white hover:text-destructive"
                onClick={() => setShowClearConfirm(true)}
              >
                Clear Cart
              </Button>
            </div>

          </div>

          {/* Cart Summary */}
          <div className="lg:col-span-1">
            <Card className="shadow-card lg:sticky lg:top-20">
              <CardContent className="p-6">
                <h2 className="text-2xl font-serif font-bold mb-6">Order Summary</h2>

                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-muted-foreground">
                    <span>Subtotal</span>
                    <span>{hasSelection ? `Rs.${selectedSubtotal.toFixed(2)}` : "—"}</span>
                  </div>
                  <div className="flex justify-between text-muted-foreground">
                    <span>Items</span>
                    <span>{hasSelection ? selectedItemCount : 0}</span>
                  </div>
                  <div className="flex justify-between text-muted-foreground">
                    <span>Delivery Fee</span>
                    <span>{hasSelection ? `Rs.${deliveryFee.toFixed(2)}` : "—"}</span>
                  </div>
                  <div className="border-t border-border pt-3 flex justify-between text-xl font-bold">
                    <span>Grand Total</span>
                    <span className="text-primary">
                      {hasSelection ? `Rs.${grandTotal.toFixed(2)}` : "—"}
                    </span>
                  </div>

                </div>

                <div className="mt-3">
                  <Button
                    className="w-full bg-green-500 hover:bg-green-600 text-white"
                    size="lg"
                    disabled={!hasSelection}
                    onClick={() => {
                      if (!hasSelection) return;
                      const baseUrl = window.location.origin;
                      const wa = getWhatsAppLinkForCart(selectedItems, baseUrl);
                      window.open(wa, "_blank");
                    }}
                  >
                    <span>Buy using WhatsApp</span>
                  </Button>
                </div>

                {/* Back to Home Button in Summary */}
                <div className="mt-6 pt-6 border-t border-border">
                  <Link to="/">
                    <Button
                      variant="ghost"
                      className="w-full bg-accent text-accent-foreground hover:bg-accent/90"
                    >
                      Back to Home
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Clear Cart Confirmation Dialog */}
      {showClearConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-sm shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-full bg-destructive/10 flex items-center justify-center">
                  <AlertCircle className="h-6 w-6 text-destructive" />
                </div>
                <h2 className="text-xl font-serif font-bold">Clear Cart?</h2>
              </div>
              <p className="text-muted-foreground mb-6">
                Are you sure you want to remove all items from your cart?...
              </p>
              <div className="flex gap-3 justify-end">
                <Button
                  variant="outline"
                  onClick={() => setShowClearConfirm(false)}
                >
                  Cancel
                </Button>
                <Button
                  variant="destructive"
                  onClick={handleClearCart}
                >
                  Clear Cart
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default Cart;