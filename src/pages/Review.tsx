import { Link } from "react-router-dom";
import { ArrowLeft, Star, ThumbsUp, Image as ImageIcon } from "lucide-react";
import Navbar from "../components/layout/Navbar";

export default function Review() {
  return (
    <div className="min-h-screen bg-brand-bg pb-20">
      <Navbar />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Link to="/home" className="inline-flex items-center text-sm font-semibold text-slate-600 hover:text-brand-green mb-6 transition-colors">
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to Orders
        </Link>

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight mb-2">Review & Rating</h1>
          <p className="text-slate-500">Share your experience to help the IPB community make better choices.</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Review Form */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white rounded-2xl border border-slate-200 p-4 flex gap-4 items-center">
              <div className="w-16 h-16 bg-slate-100 rounded-lg overflow-hidden shrink-0 border border-slate-100"></div>
              <div>
                <h3 className="font-semibold text-slate-900 text-sm">Paket Ayam Geprek Spesial</h3>
                <div className="text-xs text-slate-500 flex items-center gap-1 mt-1">
                  <span className="w-3 h-3 text-slate-400">🏪</span> Warung Makan Mahasiswa IPB
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 p-6">
              <div className="mb-6">
                <label className="text-sm font-bold text-slate-900 block mb-3">Overall Rating</label>
                <div className="flex gap-2">
                  {[1,2,3,4,5].map(i => (
                    <button key={i} className="text-slate-300 hover:text-amber-400 transition-colors">
                      <Star className="w-8 h-8" />
                    </button>
                  ))}
                </div>
              </div>

              <div className="mb-6">
                 <label className="text-sm font-bold text-slate-900 block mb-3">Write your feedback</label>
                 <textarea 
                   placeholder="What did you like or dislike? How was the taste and packaging?" 
                   className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:border-brand-green focus:ring-1 focus:ring-brand-green outline-none transition-colors min-h-[120px] resize-none"
                 ></textarea>
              </div>

              <div className="mb-6">
                 <label className="text-sm font-bold text-slate-900 block mb-3">Add Photos (Optional)</label>
                 <button className="w-full border-2 border-dashed border-slate-200 rounded-xl py-8 flex flex-col items-center justify-center text-slate-500 hover:bg-slate-50 hover:border-brand-green/50 transition-colors">
                   <ImageIcon className="w-6 h-6 mb-2 text-slate-400" />
                   <span className="text-sm font-medium">Click or drag images here</span>
                 </button>
              </div>

              <button className="w-full bg-brand-orange hover:bg-brand-orange-dark text-white font-semibold py-3.5 rounded-lg transition-colors flex justify-center items-center">
                Submit Review
              </button>
            </div>
          </div>

          {/* Community Reviews */}
          <div className="lg:col-span-2">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-slate-900">Community Reviews</h2>
              <div className="text-sm text-slate-500 font-medium cursor-pointer">Sort by: Most Helpful ⌄</div>
            </div>

            <div className="space-y-6">
              {/* Review 1 */}
              <div className="bg-white rounded-2xl border border-slate-200 p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex gap-3 items-center">
                    <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 font-bold flex items-center justify-center">S</div>
                    <div>
                      <div className="font-semibold text-slate-900 text-sm">Sarah K.</div>
                      <div className="text-xs text-slate-500 mt-0.5">2 days ago</div>
                    </div>
                  </div>
                  <div className="flex text-amber-400">
                    <Star className="w-4 h-4 fill-amber-400" /><Star className="w-4 h-4 fill-amber-400" /><Star className="w-4 h-4 fill-amber-400" /><Star className="w-4 h-4 fill-amber-400" /><Star className="w-4 h-4 fill-amber-400" />
                  </div>
                </div>
                <p className="text-slate-700 leading-relaxed text-sm mb-4">
                  Porsinya sangat mengenyangkan untuk harga segini! Sambalnya mantap banget, pedasnya pas. Packingnya juga rapi pakai kotak tebal, jadi aman buat dibawa ke asrama. Bakal langganan terus sih ini.
                </p>
                <div className="w-20 h-20 rounded-lg bg-slate-100 border border-slate-200 mb-4"></div>
                <div className="pt-4 border-t border-slate-100 flex">
                  <button className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-brand-green transition-colors">
                    <ThumbsUp className="w-4 h-4" /> Helpful (12)
                  </button>
                </div>
              </div>

               {/* Review 2 */}
              <div className="bg-white rounded-2xl border border-slate-200 p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex gap-3 items-center">
                    <div className="w-10 h-10 rounded-full bg-emerald-50 text-brand-green font-bold flex items-center justify-center">B</div>
                    <div>
                      <div className="font-semibold text-slate-900 text-sm">Budi P.</div>
                      <div className="text-xs text-slate-500 mt-0.5">1 week ago</div>
                    </div>
                  </div>
                  <div className="flex text-amber-400">
                    <Star className="w-4 h-4 fill-amber-400" /><Star className="w-4 h-4 fill-amber-400" /><Star className="w-4 h-4 fill-amber-400" /><Star className="w-4 h-4 fill-amber-400" /><Star className="w-4 h-4 text-slate-300" />
                  </div>
                </div>
                <p className="text-slate-700 leading-relaxed text-sm mb-4">
                  Rasa enak seperti biasa, tapi tumben pengirimannya agak lama hari ini. Mungkin karena jam makan siang jadi warungnya rame banget. Overal tetap rekomen buat mahasiswa.
                </p>
                <div className="pt-4 border-t border-slate-100 flex">
                  <button className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-brand-green transition-colors">
                    <ThumbsUp className="w-4 h-4" /> Helpful (12)
                  </button>
                </div>
              </div>

              <div className="text-center pt-2">
                <button className="font-semibold text-brand-green hover:underline">Load more reviews</button>
              </div>

            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
