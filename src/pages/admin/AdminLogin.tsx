import { useState } from 'react';
import { Lock } from 'lucide-react';

interface AdminLoginProps {
  onLogin: () => void;
}

export function AdminLogin({ onLogin }: AdminLoginProps) {
  const [pin, setPin] = useState('');
  const [error, setError] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (pin === '271302') {
      onLogin();
    } else {
      setError(true);
      setPin('');
    }
  };

  return (
    <div className="min-h-screen bg-[#0F4C5C] flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-2xl max-w-md w-full shadow-2xl">
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 bg-[#D4B483]/20 rounded-full flex items-center justify-center text-[#0F4C5C]">
            <Lock size={32} />
          </div>
        </div>
        <h1 className="text-2xl font-serif text-[#0F4C5C] text-center mb-2">Admin Access</h1>
        <p className="text-gray-500 text-center mb-8">Enter your PIN to access the dashboard</p>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <input
              type="password"
              value={pin}
              onChange={(e) => {
                setPin(e.target.value);
                setError(false);
              }}
              placeholder="Enter PIN"
              className={`w-full px-4 py-3 rounded-xl border ${error ? 'border-red-500 bg-red-50' : 'border-gray-200'} focus:outline-none focus:ring-2 focus:ring-[#D4B483] text-center text-2xl tracking-widest`}
              autoFocus
            />
            {error && <p className="text-red-500 text-sm text-center mt-2">Incorrect PIN</p>}
          </div>
          <button
            type="submit"
            className="w-full bg-[#0F4C5C] text-white py-4 rounded-xl font-medium hover:bg-[#0F4C5C]/90 transition-colors"
          >
            Access Dashboard
          </button>
        </form>
      </div>
    </div>
  );
}
