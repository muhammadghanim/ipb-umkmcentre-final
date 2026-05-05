import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, User, AlignLeft, CheckCircle2 } from "lucide-react";
import Navbar from "../components/layout/Navbar";
import { Stepper } from "./Cart";

export default function Checkout() {
  const [step, setStep] = useState<2 | 3>(2);

  return (
    <div className="min-h-screen bg-brand-bg pb-20">
      <Navbar />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <button onClick={() => step === 3 ? setStep(2) : window.history.back()} className="inline-flex items-center text-sm font-semibold text-slate-600 hover:text-brand-green mb-8 transition-colors">
          <ArrowLeft className="w-4 h-4 mr-2" /> Back
        </button>

        <Stepper step={step} />

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight mb-2">
            {step === 2 ? "Almost there!" : "Select Payment Method"}
          </h1>
          <p className="text-slate-500">
            {step === 2 ? "Let's get your details sorted so we can prepare your order." : "Choose a payment method to proceed"}
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            
            {step === 2 && (
              <>
                <div className="bg-white rounded-2xl border border-slate-200 p-6 md:p-8">
                  <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                    <User className="w-5 h-5 text-brand-green" /> Contact Information
                  </h2>
                  <div className="grid md:grid-cols-2 gap-6 mb-6">
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-slate-900">Full Name</label>
                      <input type="text" defaultValue="Budi Santoso" className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:border-brand-green focus:ring-1 focus:ring-brand-green outline-none transition-colors" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-slate-900">Student ID (NIM)</label>
                      <input type="text" defaultValue="G64190001" className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:border-brand-green focus:ring-1 focus:ring-brand-green outline-none transition-colors" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-900">Phone Number (WhatsApp)</label>
                    <input type="tel" placeholder="e.g. 081234567890" className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:border-brand-green focus:ring-1 focus:ring-brand-green outline-none transition-colors" />
                    <p className="text-xs text-slate-500 mt-1">We'll message you when your food is ready.</p>
                  </div>
                </div>

                <div className="bg-white rounded-2xl border border-slate-200 p-6 md:p-8">
                  <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                    <AlignLeft className="w-5 h-5 text-brand-green" /> Order Notes (Optional)
                  </h2>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-900">Special Instructions</label>
                    <textarea 
                      placeholder="e.g. Extra spicy, less sugar, etc..." 
                      className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:border-brand-green focus:ring-1 focus:ring-brand-green outline-none transition-colors min-h-[120px] resize-none"
                    ></textarea>
                  </div>
                </div>
              </>
            )}

            {step === 3 && (
              <div className="space-y-4">
                <label className="bg-white rounded-2xl border-2 border-brand-green p-6 flex items-start gap-4 cursor-pointer hover:bg-emerald-50/30 transition-colors shadow-sm">
                  <input type="radio" name="payment" className="w-5 h-5 text-brand-green border-slate-300 focus:ring-brand-green mt-0.5" defaultChecked />
                  <div>
                    <h3 className="font-bold text-slate-900 mb-1 flex items-center gap-2">
                      QRIS & E-Wallets <CheckCircle2 className="w-4 h-4 text-brand-green" />
                    </h3>
                    <p className="text-sm text-slate-500">Scan QR code using your preferred e-wallet app.</p>
                  </div>
                </label>

                <label className="bg-white rounded-2xl border border-slate-200 p-6 flex items-start gap-4 cursor-pointer hover:border-slate-300 transition-colors">
                  <input type="radio" name="payment" className="w-5 h-5 text-brand-green border-slate-300 focus:ring-brand-green mt-0.5" />
                  <div>
                    <h3 className="font-bold text-slate-900 mb-1">Account Transfer</h3>
                    <p className="text-sm text-slate-500">Transfer from Mandiri, BNI, BRI, or BCA.</p>
                  </div>
                </label>
              </div>
            )}

          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl border border-slate-200 p-6 sticky top-24">
              <h3 className="text-xl font-bold text-slate-900 mb-6 border-b border-slate-100 pb-4">Order Summary</h3>
              
              <div className="space-y-4 mb-6 border-b border-slate-100 pb-6">
                <div className="flex gap-4 items-start">
                   <div className="w-12 h-12 bg-slate-100 rounded border border-slate-200 overflow-hidden shrink-0"><img src="https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?auto=format&fit=crop&q=80&w=100" className="w-full h-full object-cover" /></div>
                   <div>
                     <h4 className="font-semibold text-slate-900 text-sm mb-1">Ayam Geprek Level 5</h4>
                     <div className="text-xs text-slate-500 flex items-center gap-2">
                       <span>Qty: 1</span> <span className="w-1 h-1 bg-slate-300 rounded-full"></span> <span className="bg-emerald-50 text-emerald-700 px-1.5 rounded">Ayam Geprek Makmur</span>
                     </div>
                   </div>
                   <div className="ml-auto font-semibold text-slate-900 text-sm">Rp 22.000</div>
                </div>
                <div className="flex gap-4 items-start">
                   <div className="w-12 h-12 bg-slate-100 rounded border border-slate-200 overflow-hidden shrink-0"><img src="https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?auto=format&fit=crop&q=80&w=100" className="w-full h-full object-cover" /></div>
                   <div>
                     <h4 className="font-semibold text-slate-900 text-sm mb-1">Ayam Geprek Level 2</h4>
                     <div className="text-xs text-slate-500 flex items-center gap-2">
                       <span>Qty: 1</span> <span className="w-1 h-1 bg-slate-300 rounded-full"></span> <span className="bg-emerald-50 text-emerald-700 px-1.5 rounded">Ayam Geprek Makmur</span>
                     </div>
                   </div>
                   <div className="ml-auto font-semibold text-slate-900 text-sm">Rp 22.000</div>
                </div>
              </div>
              
              <div className="space-y-3 text-sm mb-6">
                <div className="flex justify-between">
                  <span className="text-slate-500">Subtotal</span>
                  <span className="font-medium text-slate-900">Rp 44.000</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Platform Fee</span>
                  <span className="font-medium text-slate-900">Rp 2.000</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Pickup Fee</span>
                  <span className="font-medium text-brand-green">Free</span>
                </div>
              </div>
              
              <div className="border-t border-slate-100 pt-4 mb-6 flex justify-between items-end">
                 <span className="font-bold text-slate-900 text-lg">Total Payment</span>
                 <span className="font-bold text-brand-green text-2xl">Rp 46.000</span>
              </div>
              
              {step === 2 ? (
                <button 
                  onClick={() => setStep(3)}
                  className="w-full bg-brand-orange hover:bg-brand-orange-dark text-white font-semibold py-4 px-6 rounded-xl transition-colors flex justify-center items-center"
                >
                  Continue to Payment &rarr;
                </button>
              ) : (
                <button 
                  onClick={() => alert("Order successfully placed!")}
                  className="w-full bg-brand-orange hover:bg-brand-orange-dark text-white font-semibold py-4 px-6 rounded-xl transition-colors flex justify-center items-center"
                >
                  Pay
                </button>
              )}
            </div>
          </div>

        </div>
      </main>
      
      {/* Footer */}
      <footer className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-t border-slate-200 text-sm py-8 flex flex-col sm:flex-row justify-between items-center text-slate-500 font-medium gap-4 mt-8">
        <div className="flex items-center gap-4">
          <span className="text-brand-green font-bold">IPB Food Hub</span>
        </div>
        <div className="flex gap-6">
           <span>&copy; 2024 IPB University - Food & UMKM Innovation Hub</span>
        </div>
      </footer>
    </div>
  );
}
