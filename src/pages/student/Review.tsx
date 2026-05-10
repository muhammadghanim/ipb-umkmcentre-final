import { useState } from 'react';
import { Star } from 'lucide-react';

export default function ReviewPage() {
  const [rating, setRating] = useState(0);
  const [hovered, setHovered] = useState(0);
  const [komentar, setKomentar] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Di sini Anda akan memanggil Axios: 
    // axios.post('/ulasan/mahasiswa/{mahasiswa_id}', { rating, komentar, id_menu: '...' })
    console.log({ rating, komentar });
    alert("Ulasan berhasil dikirim!");
  };

  return (
    <div className="max-w-2xl mx-auto bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
      <h1 className="text-2xl font-bold text-gray-900 mb-2">Review & Rating</h1>
      <p className="text-gray-500 mb-8">Share your experience to help the IPB community make better choices.</p>

      {/* Product Info */}
      <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-2xl mb-8">
        <div className="w-16 h-16 bg-gray-200 rounded-xl"></div>
        <div>
          <h3 className="font-bold text-gray-900">Paket Ayam Geprek Spesial</h3>
          <p className="text-sm text-gray-500">Warung Makan Mahasiswa IPB</p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        {/* Star Rating Input */}
        <div className="mb-8">
          <label className="block font-medium text-gray-900 mb-3">Overall Rating</label>
          <div className="flex gap-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className={`w-10 h-10 cursor-pointer transition-colors ${
                  star <= (hovered || rating) ? 'fill-amber-400 text-amber-400' : 'text-gray-300'
                }`}
                onMouseEnter={() => setHovered(star)}
                onMouseLeave={() => setHovered(0)}
                onClick={() => setRating(star)}
              />
            ))}
          </div>
        </div>

        {/* Text Area */}
        <div className="mb-8">
          <label className="block font-medium text-gray-900 mb-2">Write your feedback</label>
          <textarea
            rows={5}
            value={komentar}
            onChange={(e) => setKomentar(e.target.value)}
            placeholder="What did you like or dislike? How was the taste and packaging?"
            className="w-full p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-800 focus:border-green-800 outline-none resize-none"
            required
          ></textarea>
        </div>

        <button 
          type="submit" 
          disabled={rating === 0}
          className={`w-full py-4 rounded-xl font-medium transition-colors ${
            rating > 0 ? 'bg-green-800 text-white hover:bg-green-900' : 'bg-gray-200 text-gray-500 cursor-not-allowed'
          }`}
        >
          Submit Review
        </button>
      </form>
    </div>
  );
}