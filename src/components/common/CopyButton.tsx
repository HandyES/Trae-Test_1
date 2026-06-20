import React, { useState } from 'react';
import { Copy, Check } from 'lucide-react';
import { copyAddress } from '../../utils/copyAddress';
import { useAppStore } from '../../store/useAppStore';

interface CopyButtonProps {
  address: string;
}

export const CopyButton: React.FC<CopyButtonProps> = ({ address }) => {
  const [copied, setCopied] = useState(false);
  const setCopySuccess = useAppStore((state) => state.setCopySuccess);

  const handleCopy = async () => {
    const success = await copyAddress(address);
    if (success) {
      setCopied(true);
      setCopySuccess(true);
      setTimeout(() => {
        setCopied(false);
        setCopySuccess(false);
      }, 2000);
    }
  };

  return (
    <button
      onClick={handleCopy}
      className={`flex items-center gap-2 px-4 py-3 rounded-xl font-medium text-lg transition-all min-h-[48px] ${
        copied
          ? 'bg-green-500 text-white'
          : 'bg-[#2E8B9A] text-white hover:bg-[#247080] active:bg-[#1d6069]'
      }`}
    >
      {copied ? (
        <>
          <Check className="w-5 h-5" />
          <span>已复制</span>
        </>
      ) : (
        <>
          <Copy className="w-5 h-5" />
          <span>复制地址</span>
        </>
      )}
    </button>
  );
};
