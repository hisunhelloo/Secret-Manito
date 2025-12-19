import { useState } from 'react';
import { Gift, UserPlus } from 'lucide-react';

interface Props {
    onCreateRoom: () => void;
    onCheckResult: (token: string) => void;
}

export default function Landing({ onCreateRoom, onCheckResult }: Props) {
    const [inputToken, setInputToken] = useState('');

    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] p-6 text-center animate-fadeIn">
            <div className="bg-indigo-100 p-5 rounded-full mb-6 shadow-sm">
                <Gift className="w-16 h-16 text-indigo-600" />
            </div>
            <h1 className="text-4xl font-extrabold text-gray-900 mb-3 tracking-tight">비밀 마니또</h1>
            <p className="text-gray-500 mb-10 text-lg">두근두근 설레는 마니또 게임을 시작해보세요.</p>

            <div className="w-full max-w-sm space-y-6">
                <button
                    onClick={onCreateRoom}
                    className="w-full flex items-center justify-center space-x-2 bg-indigo-600 text-white py-4 px-6 rounded-xl hover:bg-indigo-700 transition-all shadow-lg hover:shadow-xl font-bold text-lg"
                >
                    <UserPlus className="w-6 h-6" />
                    <span>방 만들기 (대표자)</span>
                </button>

                <div className="relative py-2">
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-gray-200"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                        <span className="px-3 bg-gray-50 text-gray-400">또는 코드로 입장</span>
                    </div>
                </div>

                <div className="flex space-x-2">
                    <input
                        type="text"
                        placeholder="전달받은 토큰(코드) 입력"
                        value={inputToken}
                        onChange={(e) => setInputToken(e.target.value)}
                        className="flex-1 border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-indigo-500 focus:outline-none shadow-sm"
                    />
                    <button
                        onClick={() => inputToken && onCheckResult(inputToken)}
                        disabled={!inputToken}
                        className="bg-gray-800 text-white px-6 py-3 rounded-xl hover:bg-gray-900 disabled:opacity-50 font-medium transition-colors"
                    >
                        확인
                    </button>
                </div>
            </div>
        </div>
    );
}
