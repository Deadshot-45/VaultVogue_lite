import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Minus, Plus, ShoppingCart } from "lucide-react"
import { useState } from "react"

export default function ProductCard() {
  const [quantity, setQuantity] = useState(2)

  const decrease = () => {
    if (quantity > 1) setQuantity(quantity - 1)
  }

  const increase = () => {
    setQuantity(quantity + 1)
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-neutral-100">
      <Card className="w-[320px] rounded-2xl shadow-md">
        <CardContent className="p-4 space-y-4">
          {/* Image */}
          <img
            src="https://images.unsplash.com/photo-1605475128023-47c1f5b4a2c5"
            alt="Chocolate Cake"
            className="w-full h-40 object-cover rounded-xl"
          />

          {/* Title */}
          <div>
            <h2 className="text-lg font-semibold">
              Chocolate Layer Cake
            </h2>
            <p className="text-sm text-muted-foreground">
              Moist chocolate sponge cake with rich, smooth chocolate frosting between layers.
            </p>
          </div>

          {/* Tags */}
          <div className="flex gap-2 flex-wrap">
            <Badge variant="secondary">Cocoa</Badge>
            <Badge variant="secondary">Cream</Badge>
            <Badge variant="secondary">Chocolate</Badge>
          </div>

          {/* Quantity + Price */}
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-muted-foreground">Quantity</p>
              <div className="flex items-center gap-2 mt-1">
                <Button variant="outline" size="icon" onClick={decrease}>
                  <Minus size={14} />
                </Button>
                <span className="text-sm font-medium">{quantity}</span>
                <Button variant="outline" size="icon" onClick={increase}>
                  <Plus size={14} />
                </Button>
              </div>
            </div>

            <div className="text-right">
              <p className="text-xs text-muted-foreground">Total</p>
              <p className="text-lg font-semibold">₹{299 * quantity}</p>
            </div>
          </div>
        </CardContent>

        {/* Footer */}
        <CardFooter className="flex gap-2 p-4 pt-0">
          <Button variant="outline" size="icon">
            <ShoppingCart size={18} />
          </Button>
          <Button className="flex-1 bg-brown-600 hover:bg-brown-700 text-white">
            Order now
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}