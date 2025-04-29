"use client";

import { useState } from "react";
import { useCart } from "@/context/CartContext";
import { convertPrice } from "@/utils/currency";
import { useCurrency } from "@/context/CurrencyContext";

export default function CheckoutPage() {
  const { cartItems, clearCart } = useCart();
  const { currency } = useCurrency();

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    zip: "",
    country: "Thailand",
    note: "",
    marketing: false,
    agreeTerms: false,
  });

  const [submitted, setSubmitted] = useState(false);

  const requiredFields: (keyof typeof form)[] = [
    "firstName",
    "lastName",
    "email",
    "phone",
    "address",
    "city",
    "zip",
  ];

  const cartTotal = cartItems.reduce((acc, item) => {
    const price = typeof item.price === "object" ? item.price.sale : item.price;
    return acc + price * item.quantity;
  }, 0);

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    const { name, value, type } = e.target;
    const newValue =
      type === "checkbox" && "checked" in e.target
        ? (e.target as HTMLInputElement).checked
        : value;

    setForm((prev) => ({
      ...prev,
      [name]: newValue,
    }));
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!form.agreeTerms) {
      alert("You must agree to the terms and conditions to place the order.");
      return;
    }
    console.log("🧾 Order submitted:", form, cartItems);
    clearCart();
    setSubmitted(true);
  }

  return (
    <main className="min-h-screen pt-32 px-6 pb-20 text-[#f8fcdc] font-[Cinzel]">
      <h1 className="text-4xl font-bold text-center text-[#dc9e63] mb-10 uppercase tracking-wider">
        Checkout
      </h1>

      {submitted ? (
        <div className="text-center text-green-400 text-xl mt-10">
          ✅ Your order has been placed successfully!
        </div>
      ) : (
        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto"
        >
          <div className="flex flex-col gap-4">
            {(Object.keys(form) as (keyof typeof form)[])
              .filter((key) =>
                [
                  "firstName",
                  "lastName",
                  "email",
                  "phone",
                  "address",
                  "city",
                  "state",
                  "zip",
                ].includes(key)
              )
              .map((name) => (
                <label key={name} className="text-sm">
                  {name.charAt(0).toUpperCase() +
                    name.slice(1).replace(/([A-Z])/g, " $1")}
                  <input
                    name={name}
                    type={name === "email" ? "email" : "text"}
                    value={form[name] as string}
                    onChange={handleInputChange}
                    className="w-full p-2 bg-transparent border border-[#dc9e63] rounded-sm"
                    required={requiredFields.includes(name)}
                  />
                </label>
              ))}

            <label className="text-sm">
              Country
              <input
                name="country"
                value={form.country}
                onChange={handleInputChange}
                className="w-full p-2 bg-transparent border border-[#dc9e63] rounded-sm"
              />
            </label>
          </div>

          <div className="flex flex-col gap-6">
            <div className="bg-[#1e0e0e] p-4 border border-[#dc9e63] rounded-sm">
              <h2 className="text-xl font-bold mb-4 text-[#dc9e63]">Your Order</h2>
              {cartItems.map((item) => (
                <div
                  key={item.id}
                  className="flex justify-between text-sm border-b border-[#dc9e63]/30 py-2"
                >
                  <span>
                    {item.title} × {item.quantity}
                  </span>
                  <span>
                    {convertPrice(
                      (typeof item.price === "object"
                        ? item.price.sale
                        : item.price) * item.quantity,
                      currency
                    )}
                  </span>
                </div>
              ))}
              <div className="flex justify-between mt-4 font-semibold">
                <span>Total:</span>
                <span>{convertPrice(cartTotal, currency)}</span>
              </div>
            </div>

            <label className="text-sm">
              Order Note (optional)
              <textarea
                name="note"
                value={form.note}
                onChange={handleInputChange}
                className="w-full p-2 bg-transparent border border-[#dc9e63] rounded-sm"
              ></textarea>
            </label>

            <label className="text-xs flex items-start gap-2">
              <input
                type="checkbox"
                name="marketing"
                checked={form.marketing}
                onChange={handleInputChange}
              />
              I consent to receiving occasional email updates. You can unsubscribe at any time.
            </label>

            <label className="text-xs flex items-start gap-2">
              <input
                type="checkbox"
                name="agreeTerms"
                checked={form.agreeTerms}
                onChange={handleInputChange}
                required
              />
              I have read and agree to the website terms and conditions.
            </label>

            <button
              type="submit"
              className="bg-[#dc9e63] text-[#160000] font-bold py-3 rounded-sm hover:bg-[#f8cfa3] tracking-wide"
            >
              Place Order
            </button>
          </div>
        </form>
      )}
    </main>
  );
}