import { useState, useEffect } from 'react';
import { signInAnonymously, onAuthStateChanged, type User } from "firebase/auth";
import { Gift } from 'lucide-react';
import { auth } from './config/firebase';
import Landing from './components/Landing';
import RoomAdmin from './components/RoomAdmin';
import ResultView from './components/ResultView';

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [view, setView] = useState<'HOME' | 'ADMIN' | 'RESULT'>('HOME');
  const [tokenToCheck, setTokenToCheck] = useState<string | null>(null);
  const [authError, setAuthError] = useState<string | null>(null);

  useEffect(() => {
    // 1. Auth Init
    const initAuth = async () => {
      try {
        await signInAnonymously(auth);
      } catch (e: any) {
        console.error("Auth failed", e);
        setAuthError(e.message || "Unknown Auth Error");
      }
    };
    initAuth();
    const unsubscribe = onAuthStateChanged(auth, setUser);

    // 2. URL Params Check
    const params = new URLSearchParams(window.location.search);
    const urlToken = params.get('token');
    if (urlToken) {
      setTokenToCheck(urlToken);
      setView('RESULT');
    }

    return () => unsubscribe();
  }, []);

  if (authError) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4 text-center">
        <h2 className="text-xl font-bold text-red-600 mb-2">로그인 오류가 발생했습니다.</h2>
        <p className="text-gray-700 bg-gray-100 p-4 rounded mb-4 max-w-lg break-all">{authError}</p>
        <p className="text-sm text-gray-500">
          1. Firebase Console &gt; Authentication &gt; Sign-in method &gt; <strong>Anonymous(익명)</strong>가 켜져 있는지 확인해주세요.<br />
          2. src/config/firebase.ts 의 설정값이 정확한지 확인해주세요.
        </p>
      </div>
    );
  }

  if (!user) return <div className="min-h-screen flex items-center justify-center text-gray-500">앱을 불러오는 중...</div>;

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-900 pb-10">
      <header className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-3xl mx-auto px-4 h-14 flex items-center justify-between">
          <button
            className="flex items-center space-x-2 text-indigo-600 hover:opacity-80 transition-opacity"
            onClick={() => {
              setView('HOME');
              window.history.pushState({}, '', window.location.pathname);
            }}
          >
            <Gift className="w-6 h-6" />
            <span className="font-bold text-lg">Secret Manito</span>
          </button>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-8">
        {view === 'HOME' && (
          <Landing
            onCreateRoom={() => setView('ADMIN')}
            onCheckResult={(token) => { setTokenToCheck(token); setView('RESULT'); }}
          />
        )}

        {view === 'ADMIN' && (
          <RoomAdmin
            user={user}
            onBack={() => setView('HOME')}
          />
        )}

        {view === 'RESULT' && tokenToCheck && (
          <ResultView
            token={tokenToCheck}
            onBack={() => {
              window.history.pushState({}, '', window.location.pathname);
              setView('HOME');
              setTokenToCheck(null);
            }}
          />
        )}
      </main>
    </div>
  );
}
