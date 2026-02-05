import { useState } from 'react';

export default function DonationAmountSelector({
  amounts,
  defaultAmount,
  isMonthly = false,
  onAmountChange,
}) {
  const [selectedAmount, setSelectedAmount] = useState(defaultAmount || amounts[2]);
  const [customAmount, setCustomAmount] = useState('');
  const [isCustom, setIsCustom] = useState(false);

  const handleAmountClick = (amount) => {
    if (amount === 'custom') {
      setIsCustom(true);
      setSelectedAmount(null);
    } else {
      setIsCustom(false);
      setSelectedAmount(amount);
      setCustomAmount('');
      onAmountChange?.(amount);
    }
  };

  const handleCustomChange = (e) => {
    const value = e.target.value.replace(/[^0-9]/g, '');
    setCustomAmount(value);
    if (value) {
      onAmountChange?.(parseInt(value, 10));
    }
  };

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-3 gap-2">
        {amounts.map((amount) => (
          <button
            key={amount}
            onClick={() => handleAmountClick(amount)}
            className={`py-3 px-4 rounded-lg font-semibold transition-all ${
              selectedAmount === amount && !isCustom
                ? 'bg-pub-green-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            ${amount}
            {isMonthly && '/mo'}
          </button>
        ))}
        <button
          onClick={() => handleAmountClick('custom')}
          className={`py-3 px-4 rounded-lg font-semibold transition-all ${
            isCustom
              ? 'bg-pub-green-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          Other
        </button>
      </div>

      {isCustom && (
        <div className="relative">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-medium">
            $
          </span>
          <input
            type="text"
            value={customAmount}
            onChange={handleCustomChange}
            placeholder="Enter amount"
            className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pub-green-500 focus:border-pub-green-500 outline-none"
            autoFocus
          />
        </div>
      )}
    </div>
  );
}
