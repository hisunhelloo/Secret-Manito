import { useState, useEffect } from 'react';
import { collection, onSnapshot } from "firebase/firestore";
import { Gift, Lock, Home, AlertCircle } from 'lucide-react';
import { db, appId, COLLECTION_NAME } from '../config/firebase';
import type { Room, Member } from '../types';

interface Props {
    token: string;
    onBack: () => void;
}

export default function ResultView({ token, onBack }: Props) {
    const [result, setResult] = useState<{ me: Member, roomName: string } | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [isRevealed, setIsRevealed] = useState(false);

    useEffect(() => {
        setLoading(true);
        // 컬렉션 경로: artifacts/appId/public/data/manito_rooms
        const q = collection(db, 'artifacts', appId, 'public', 'data', COLLECTION_NAME);

        const unsubscribe = onSnapshot(q, (snapshot) => {
            let found = false;
            snapshot.forEach((doc) => {
                const roomData = doc.data() as Room;
                const member = roomData.members.find(m => m.token === token);

                if (member) {
                    found = true;
                    if (roomData.isAssigned) {
                        setResult({ me: member, roomName: roomData.roomName });
                        setError('');
                    } else {
                        setError("아직 마니또 배정이 시작되지 않았습니다.");
                    }
                }
            });

            if (!found) {
                // 이미 에러가 설정된 상태가 아니라면 (배정 대기 중이 아닐 때)
                setResult((prev) => prev ? prev : null); // 결과가 있으면 유지
                if (!result) setError("유효하지 않은 토큰입니다.");
            }
            setLoading(false);
        }, (err) => {
            console.error(err);
            setError("데이터를 불러오는 중 오류가 발생했습니다.");
            setLoading(false);
        });

        return () => unsubscribe();
    }, [token]);

    if (loading && !result && !error) return <div className="flex justify-center p-10"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div></div>;

    if (error && !result) return (
        <div className="max-w-md mx-auto p-8 text-center bg-white rounded-2xl shadow-lg mt-10">
            <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <p className="text-gray-800 font-medium mb-6">{error}</p>
            <button onClick={onBack} className="bg-gray-100 px-6 py-2 rounded-lg text-gray-600 hover:bg-gray-200">홈으로</button>
        </div>
    );

    if (!result) return null;

    return (
        <div className="max-w-md mx-auto p-4 perspective-1000 mt-4">
            <div className="text-center mb-8 animate-fadeIn">
                <h3 className="text-gray-500 font-medium mb-1">{result.roomName}</h3>
                <h1 className="text-3xl font-bold text-gray-900">
                    안녕하세요, <span className="text-indigo-600">{result.me.name}</span>님!
                </h1>
            </div>

            <div
                className="relative w-full aspect-[4/5] cursor-pointer group"
                onClick={() => setIsRevealed(true)}
            >
                {!isRevealed ? (
                    <div className="absolute inset-0 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl shadow-2xl flex flex-col items-center justify-center text-white transition-transform transform hover:scale-[1.02] active:scale-95 duration-300">
                        <Gift className="w-24 h-24 mb-6 animate-bounce" />
                        <h2 className="text-2xl font-bold mb-2">마니또 확인하기</h2>
                        <p className="text-indigo-200 text-sm bg-white/20 px-3 py-1 rounded-full">카드를 눌러서 뒤집어보세요</p>
                    </div>
                ) : (
                    <div className="absolute inset-0 bg-white border-4 border-indigo-100 rounded-2xl shadow-2xl flex flex-col items-center justify-center p-6 animate-flipIn">
                        <div className="text-center space-y-2">
                            <p className="text-gray-400 text-sm uppercase tracking-wide">Your Manito Target</p>
                            <div className="w-24 h-24 bg-indigo-50 rounded-full flex items-center justify-center mx-auto mb-4 text-4xl font-black text-indigo-300">
                                {result.me.targetName![0]}
                            </div>
                            <h2 className="text-4xl font-extrabold text-gray-800 break-keep">
                                {result.me.targetName}
                            </h2>
                            <div className="w-10 h-1 bg-indigo-500 mx-auto my-4 rounded-full"></div>
                            <p className="text-gray-500 text-sm leading-relaxed">
                                당신은 <strong>{result.me.targetName}</strong>님의 수호천사입니다.<br />
                                들키지 않게 잘 챙겨주세요! 🤫
                            </p>
                        </div>

                        <div className="mt-8 bg-gray-50 px-4 py-2 rounded-lg flex items-center text-xs text-gray-400">
                            <Lock className="w-3 h-3 mr-1.5" />
                            <span>이 결과는 본인만 확인할 수 있습니다.</span>
                        </div>
                    </div>
                )}
            </div>

            {isRevealed && (
                <button
                    onClick={onBack}
                    className="w-full mt-6 py-3 text-gray-400 hover:text-gray-600 flex items-center justify-center space-x-2 text-sm transition-colors"
                >
                    <Home className="w-4 h-4" />
                    <span>메인으로 돌아가기</span>
                </button>
            )}
        </div>
    );
}
