"use client";

import { useEffect, useMemo, useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useCart } from "../components/CartContext";
import { supabase } from "../lib/supabaseClient";

const WHATSAPP_NUMBER = "7989301401";

type Shipping = {
  fullName: string;
  email: string;
  phone: string;
  country: string;
  address1: string;
  address2: string;
  city: string;
  state: string;
  zip: string;
  deliveryNotes: string;
};

const STORAGE_KEY = "konaseema_shipping_v1";

function safeStr(v: any) {
  return String(v ?? "").trim();
}

/* ---------- TABLE FOR WHATSAPP ---------- */
function makeTable(headers: string[], rows: string[][]) {
  const widths = headers.map((h, i) =>
    Math.max(h.length, ...rows.map((r) => (r[i] ? r[i].length : 0)))
  );

  const line = (cols: string[]) =>
    cols
      .map((c, i) => c + " ".repeat(widths[i] - c.length))
      .join("  ");

  const sep = widths.map((w) => "-".repeat(w)).join("  ");
  return [line(headers), sep, ...rows.map(line)].join("\n");
}

export default function CheckoutPage() {
  const cart = useCart();

  /* ================= SHIPPING (UNCHANGED) ================= */
  const [shipping, setShipping] = useState<Shipping>({
    fullName: "",
    email: "",
    phone: "",
    country: "India",
    address1: "",
    address2: "",
    city: "",
    state: "",
    zip: "",
    deliveryNotes: "",
  });

  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  /* ================= COUPON ================= */
  const [coupon, setCoupon] = useState("");
  const [discount, setDiscount] = useState(0);
  const [couponMsg, setCouponMsg] = useState<string | null>(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setShipping((p) => ({ ...p, ...JSON.parse(raw) }));
    } catch {}
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(shipping));
    } catch {}
  }, [shipping]);

  /* ================= VALIDATION (UNCHANGED) ================= */
  const errors = useMemo(() => {
    const e: Record<string, string> = {};
    if (!shipping.fullName.trim()) e.fullName = "Full name is required";
    if (!shipping.email.trim()) e.email = "Email is required";
    if (!shipping.phone.trim()) e.phone = "Phone is required";
    if (!shipping.country.trim()) e.country = "Country is required";
    if (!shipping.address1.trim()) e.address1 = "Address is required";
    if (!shipping.city.trim()) e.city = "City is required";
    if (!shipping.state.trim()) e.state = "State is required";
    if (!shipping.zip.trim()) e.zip = "ZIP is required";
    return e;
  }, [shipping]);

  const isValid = useMemo(() => Object.keys(errors).length === 0, [errors]);

  /* ================= TOTALS ================= */
  const subtotal = cart.items.reduce(
    (s: number, it: any) => s + Number(it.price) * Number(it.qty),
    0
  );

  const shippingFee = 0;
  const total = Math.max(0, subtotal - discount + shippingFee);

  /* ================= APPLY COUPON ================= */
  const applyCoupon = async () => {
    setCouponMsg(null);
    setDiscount(0);

    if (!coupon.trim()) return;

    const { data } = await supabase
      .from("coupons")
      .select("*")
      .eq("code", coupon.trim().toUpperCase())
      .eq("is_active", true)
      .single();

    if (!data) {
      setCouponMsg("Invalid or expired coupon");
      return;
    }

    if (data.expires_at && new Date(data.expires_at) < new Date()) {
      setCouponMsg("Coupon expired");
      return;
    }

    if (subtotal < data.min_order_value) {
      setCouponMsg(`Minimum order ₹${data.min_order_value}`);
      return;
    }

    const d =
      data.type === "percent"
        ? Math.floor((subtotal * data.value) / 100)
        : data.value;

    setDiscount(d);
    setCouponMsg(`Coupon applied (-₹${d})`);
  };

  /* ================= WHATSAPP MESSAGE ================= */
  const buildWhatsAppMessage = (orderId: string) => {
    const deliveryRows = [
      ["Name", safeStr(shipping.fullName)],
      ["Email", safeStr(shipping.email)],
      ["Phone", safeStr(shipping.phone)],
      ["Country", safeStr(shipping.country)],
      ["Address 1", safeStr(shipping.address1)],
      ["Address 2", safeStr(shipping.address2 || "-")],
      ["City", safeStr(shipping.city)],
      ["State", safeStr(shipping.state)],
      ["ZIP", safeStr(shipping.zip)],
      ["Notes", safeStr(shipping.deliveryNotes || "-")],
    ];

    const itemsRows = cart.items.map((it: any, i: number) => [
      String(i + 1),
      safeStr(it.name),
      String(it.qty),
      `₹${it.price}`,
      `₹${it.price * it.qty}`,
    ]);

    const totalsRows = [
      ["Subtotal", `₹${subtotal}`],
      discount > 0 ? ["Discount", `-₹${discount}`] : null,
      ["Total", `₹${total}`],
    ].filter(Boolean) as string[][];

    return [
      `Order ID: ${orderId}`,
      "",
      "Delivery Details:",
      "```",
      makeTable(["Field", "Value"], deliveryRows),
      "```",
      "",
      "Order Items:",
      "```",
      makeTable(["#", "Item", "Qty", "Price", "Line"], itemsRows),
      "```",
      "",
      "Totals:",
      "```",
      makeTable(["Label", "Amount"], totalsRows),
      "```",
    ].join("\n");
  };

  /* ================= PLACE ORDER ================= */
  const onPlaceOrder = async () => {
    setTouched({
      fullName: true,
      email: true,
      phone: true,
      country: true,
      address1: true,
      city: true,
      state: true,
      zip: true,
    });

    if (!isValid) {
      setSaveError("Please fill all required fields.");
      return;
    }

    try {
      setSaving(true);
      setSaveError(null);

      const { data: user } = await supabase.auth.getUser();

      const { data: addr } = await supabase
        .from("addresses")
        .insert({
          user_id: user.user?.id,
          full_name: shipping.fullName,
          email: shipping.email,
          phone: shipping.phone,
          address_line1: shipping.address1,
          address_line2: shipping.address2 || null,
          city: shipping.city,
          state: shipping.state,
          postal_code: shipping.zip,
          country: shipping.country,
        })
        .select("id")
        .single();

      const { data: order } = await supabase
        .from("orders")
        .insert({
          user_id: user.user?.id,
          address_id: addr.id,
          subtotal,
          discount_amount: discount,
          coupon_code: coupon || null,
          shipping: shippingFee,
          total,
          status: "pending",
        })
        .select("id")
        .single();

      await supabase.from("order_items").insert(
        cart.items.map((i: any) => ({
          order_id: order.id,
          product_id: String(i.id),
          name: i.name,
          price: Number(i.price),
          qty: Number(i.qty),
        }))
      );

      cart.clear();

      const msg = buildWhatsAppMessage(order.id);
      window.open(
        `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`,
        "_blank"
      );

      setSuccessMsg(`Order placed successfully. Order ID: ${order.id}`);
    } catch (e: any) {
      setSaveError(e.message || "Failed to place order");
    } finally {
      setSaving(false);
    }
  };

  const inputBase =
    "w-full px-4 py-3 rounded-2xl border border-gold bg-[#fffaf2] focus:outline-none focus:ring-2 focus:ring-gold/40";
  const inputErr = "border-red-400 focus:ring-red-200";
  const showErr = (k: keyof Shipping) => touched[k] && errors[k];

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-cream pt-28 pb-16">
        <div className="max-w-6xl mx-auto px-5">
          <h1 className="text-4xl font-extrabold text-brown mb-8">Checkout</h1>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* ===== ORDER SUMMARY (COUPON ADDED) ===== */}
            <section className="card p-6">
              <h2 className="text-xl font-bold mb-4">Order Summary</h2>

              {cart.items.map((it: any) => (
                <div key={it.id} className="flex justify-between mb-2">
                  <span>
                    {it.name} × {it.qty}
                  </span>
                  <span>₹{it.qty * it.price}</span>
                </div>
              ))}

              <div className="mt-4">
                <label className="text-sm font-semibold">Coupon Code</label>
                <div className="flex gap-2 mt-1">
                  <input
                    className={inputBase}
                    value={coupon}
                    onChange={(e) => setCoupon(e.target.value)}
                  />
                  <button className="btn-secondary" onClick={applyCoupon}>
                    Apply
                  </button>
                </div>
                {couponMsg && <div className="text-sm mt-1">{couponMsg}</div>}
              </div>

              <div className="border-t mt-5 pt-4 space-y-2 font-semibold">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>₹{subtotal}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-green-700">
                    <span>Discount</span>
                    <span>-₹{discount}</span>
                  </div>
                )}
                <div className="flex justify-between text-lg">
                  <span>Total</span>
                  <span>₹{total}</span>
                </div>
              </div>
            </section>

            {/* ===== SHIPPING FORM (UNCHANGED FROM ZIP) ===== */}
            <section className="card p-6">
              <h2 className="text-xl font-bold mb-4">Shipping Details</h2>

              <div className="grid md:grid-cols-2 gap-4">
                <Field label="Full Name *" value={shipping.fullName} onChange={(v) => setShipping({ ...shipping, fullName: v })} className={`${inputBase} ${showErr("fullName") ? inputErr : ""}`} />
                <Field label="Email *" value={shipping.email} onChange={(v) => setShipping({ ...shipping, email: v })} className={`${inputBase} ${showErr("email") ? inputErr : ""}`} />
                <Field label="Phone *" value={shipping.phone} onChange={(v) => setShipping({ ...shipping, phone: v })} className={`${inputBase} ${showErr("phone") ? inputErr : ""}`} />
                <Field label="Country *" value={shipping.country} onChange={(v) => setShipping({ ...shipping, country: v })} className={`${inputBase} ${showErr("country") ? inputErr : ""}`} />
                <Field label="Address Line 1 *" value={shipping.address1} onChange={(v) => setShipping({ ...shipping, address1: v })} className={`${inputBase} ${showErr("address1") ? inputErr : ""}`} />
                <Field label="Address Line 2" value={shipping.address2} onChange={(v) => setShipping({ ...shipping, address2: v })} className={inputBase} />
                <Field label="City *" value={shipping.city} onChange={(v) => setShipping({ ...shipping, city: v })} className={`${inputBase} ${showErr("city") ? inputErr : ""}`} />
                <Field label="State *" value={shipping.state} onChange={(v) => setShipping({ ...shipping, state: v })} className={`${inputBase} ${showErr("state") ? inputErr : ""}`} />
                <Field label="ZIP / Postal *" value={shipping.zip} onChange={(v) => setShipping({ ...shipping, zip: v })} className={`${inputBase} ${showErr("zip") ? inputErr : ""}`} />

                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold mb-1">Delivery Notes</label>
                  <textarea
                    className={`${inputBase} min-h-[110px]`}
                    value={shipping.deliveryNotes}
                    onChange={(e) => setShipping({ ...shipping, deliveryNotes: e.target.value })}
                  />
                </div>
              </div>

              {saveError && <div className="mt-4 text-sm text-red-600">{saveError}</div>}
              {successMsg && <div className="mt-4 text-sm text-green-700">{successMsg}</div>}

              <button
                className="btn-primary mt-6 w-full"
                onClick={onPlaceOrder}
                disabled={saving || cart.items.length === 0}
              >
                {saving ? "Saving..." : `Place Order (₹${total})`}
              </button>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

function Field({
  label,
  value,
  onChange,
  className,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  className: string;
}) {
  return (
    <div>
      <label className="block text-sm font-semibold mb-1">{label}</label>
      <input className={className} value={value} onChange={(e) => onChange(e.target.value)} />
    </div>
  );
}
