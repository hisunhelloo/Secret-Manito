import { useState } from 'react';
import type { User } from "firebase/auth";
import { doc, setDoc, updateDoc, arrayUnion, onSnapshot } from "firebase/firestore";
import { Users, Check, RefreshCw, UserPlus, Link as LinkIcon, AlertCircle } from 'lucide-react';
import { db, appId, COLLECTION_NAME } from '../config/firebase';
import type { Room, Member } from '../types';

interface Props {
    user: User;
    onBack: () => void;
}

export default function RoomAdmin({ user, onBack }: Props) {
    const [step, setStep] = useState<'CREATE' | 'MANAGE'>('CREATE');
    const [roomName, setRoomName] = useState('');
    const [adminName, setAdminName] = useState('');
    const [room, setRoom] = useState<Room | null>(null);
    const [newMemberName, setNewMemberName] = useState('');
    const [loading, setLoading] = useState(false);
    const [copiedId, setCopiedId] = useState<string | null>(null);

    // 방 생성
    const handleCreateRoom = async () => {
        if (!roomName.trim() || !adminName.trim()) return;
        setLoading(true);

        const roomId = Math.random().toString(36).substring(2, 10).toUpperCase();
        const adminMember: Member = {
            id: crypto.randomUUID(),
            name: adminName,
            token: Math.random().toString(36).substring(2, 12), // 짧은 토큰
        };

        const newRoom: Room = {
            id: roomId,
            roomName,
            adminId: user.uid,
            adminName,
            isAssigned: false,
            members: [adminMember],
            createdAt: Date.now()
        };

        try {
            const roomRef = doc(db, 'artifacts', appId, 'public', 'data', COLLECTION_NAME, roomId);
            await setDoc(roomRef, newRoom);

            setRoom(newRoom);
            setStep('MANAGE');

            // 실시간 구독 시작
            onSnapshot(roomRef, (doc) => {
                if (doc.exists()) setRoom(doc.data() as Room);
            });

        } catch (error) {
            console.error("Error creating room:", error);
            alert("방 생성 실패: " + (error as Error).message);
        }
        setLoading(false);
    };

    // 멤버 추가
    const handleAddMember = async () => {
        if (!newMemberName.trim() || !room) return;
        if (room.members.some(m => m.name === newMemberName.trim())) {
            alert("이미 존재하는 이름입니다.");
            return;
        }

        const newMember: Member = {
            id: crypto.randomUUID(),
            name: newMemberName.trim(),
            token: Math.random().toString(36).substring(2, 12),
        };

        try {
            const roomRef = doc(db, 'artifacts', appId, 'public', 'data', COLLECTION_NAME, room.id);
            await updateDoc(roomRef, {
                members: arrayUnion(newMember)
            });
            setNewMemberName('');
        } catch (e) {
            console.error(e);
            alert("멤버 추가 실패");
        }
    };

    // 멤버 삭제
    const handleDeleteMember = async (memberId: string) => {
        if (!room || room.isAssigned) return;
        const updatedMembers = room.members.filter(m => m.id !== memberId);
        try {
            const roomRef = doc(db, 'artifacts', appId, 'public', 'data', COLLECTION_NAME, room.id);
            await updateDoc(roomRef, {
                members: updatedMembers
            });
        } catch (e) {
            console.error(e);
            alert("멤버 삭제 실패");
        }
    };

    // 마니또 배정 (핵심 알고리즘)
    const runMatching = async () => {
        if (!room || room.members.length < 2) {
            alert("최소 2명 이상이어야 합니다.");
            return;
        }
        if (!confirm("마니또를 배정하시겠습니까? 배정 후에는 되돌릴 수 없으며, 대표자도 결과를 볼 수 없습니다.")) return;

        setLoading(true);

        // 1. 셔플 (Fisher-Yates)
        const shuffled = [...room.members];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }

        // 2. 원형 연결 (A->B->C->A)
        const updatedMembers = shuffled.map((member, index) => {
            const target = shuffled[(index + 1) % shuffled.length];
            return { ...member, targetName: target.name };
        });

        // 3. 저장
        try {
            const roomRef = doc(db, 'artifacts', appId, 'public', 'data', COLLECTION_NAME, room.id);
            await updateDoc(roomRef, {
                members: updatedMembers,
                isAssigned: true
            });
        } catch (e) {
            console.error(e);
            alert("배정 실패");
        }
        setLoading(false);
    };

    // 링크 복사
    const copyLink = (token: string, memberId: string) => {
        const url = `${window.location.origin}${window.location.pathname}?token=${token}`;
        const textToCopy = `[비밀 마니또]\n링크로 접속해서 결과를 확인하세요:\n${url}\n(또는 코드 입력: ${token})`;

        navigator.clipboard.writeText(textToCopy).then(() => {
            setCopiedId(memberId);
            setTimeout(() => setCopiedId(null), 2000);
        }).catch(() => prompt("링크를 복사해서 전달하세요:", textToCopy));
    };

    // STEP 1: 입력 폼
    if (step === 'CREATE') {
        return (
            <div className="max-w-md mx-auto bg-white p-8 rounded-2xl shadow-xl space-y-6 animate-slideUp">
                <div className="text-center mb-4">
                    <h2 className="text-2xl font-bold text-gray-900">방 만들기</h2>
                    <p className="text-gray-500 text-sm">모임 이름과 본인 이름을 입력하세요</p>
                </div>
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">방 이름</label>
                        <input
                            value={roomName}
                            onChange={(e) => setRoomName(e.target.value)}
                            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500 outline-none"
                            placeholder="예: 2025 신년회"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">대표자 이름</label>
                        <input
                            value={adminName}
                            onChange={(e) => setAdminName(e.target.value)}
                            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500 outline-none"
                            placeholder="본인 이름"
                        />
                    </div>
                    <button
                        onClick={handleCreateRoom}
                        disabled={loading || !roomName || !adminName}
                        className="w-full bg-indigo-600 text-white py-3 rounded-lg font-bold hover:bg-indigo-700 disabled:opacity-50"
                    >
                        {loading ? '생성 중...' : '시작하기'}
                    </button>
                    <button onClick={onBack} className="w-full py-2 text-gray-500 hover:text-gray-700">취소</button>
                </div>
            </div>
        );
    }

    // STEP 2: 관리 패널
    if (!room) return null;

    return (
        <div className="max-w-2xl mx-auto space-y-6 animate-fadeIn">
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                <div className="bg-indigo-600 p-6 text-white flex justify-between items-center">
                    <div>
                        <h2 className="text-xl font-bold">{room.roomName}</h2>
                        <div className="flex items-center space-x-2 text-indigo-200 text-sm mt-1">
                            <Users className="w-4 h-4" />
                            <span>{room.members.length}명 참여 중</span>
                        </div>
                    </div>
                    {room.isAssigned ? (
                        <span className="bg-green-400 text-green-900 px-3 py-1 rounded-full text-xs font-bold flex items-center">
                            <Check className="w-3 h-3 mr-1" /> 배정 완료
                        </span>
                    ) : (
                        <span className="bg-yellow-400 text-yellow-900 px-3 py-1 rounded-full text-xs font-bold flex items-center">
                            <RefreshCw className="w-3 h-3 mr-1" /> 대기 중
                        </span>
                    )}
                </div>

                <div className="p-6">
                    {/* 멤버 추가 영역 (배정 전만 가능) */}
                    {!room.isAssigned && (
                        <div className="flex space-x-2 mb-6">
                            <input
                                value={newMemberName}
                                onChange={(e) => setNewMemberName(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleAddMember()}
                                placeholder="참여자 이름 입력"
                                className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500 outline-none"
                            />
                            <button onClick={handleAddMember} className="bg-gray-100 text-gray-700 px-4 rounded-lg hover:bg-gray-200">
                                <UserPlus className="w-5 h-5" />
                            </button>
                        </div>
                    )}

                    {/* 멤버 리스트 */}
                    <div className="space-y-3 max-h-[50vh] overflow-y-auto pr-1">
                        {room.members.map((member) => (
                            <div key={member.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-100">
                                <div className="flex items-center space-x-3">
                                    <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold text-sm">
                                        {member.name[0]}
                                    </div>
                                    <span className="font-medium text-gray-800">
                                        {member.name}
                                        {room.adminName === member.name && <span className="ml-2 text-xs text-gray-400">(대표)</span>}
                                    </span>
                                </div>

                                <div className="flex items-center">
                                    {room.isAssigned ? (
                                        <button
                                            onClick={() => copyLink(member.token, member.id)}
                                            className={`flex items-center space-x-1 px-3 py-1.5 rounded text-sm transition-all ${copiedId === member.id
                                                ? 'bg-green-100 text-green-700 font-bold'
                                                : 'bg-white border border-indigo-200 text-indigo-600 hover:bg-indigo-50'
                                                }`}
                                        >
                                            {copiedId === member.id ? <Check className="w-3 h-3" /> : <LinkIcon className="w-3 h-3" />}
                                            <span>{copiedId === member.id ? '복사됨' : '링크 복사'}</span>
                                        </button>
                                    ) : (
                                        <button onClick={() => handleDeleteMember(member.id)} className="text-gray-300 hover:text-red-500 p-2">
                                            &times;
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* 액션 버튼 */}
                    <div className="mt-8 pt-6 border-t border-gray-100">
                        {!room.isAssigned ? (
                            <div className="space-y-4">
                                <div className="bg-orange-50 p-4 rounded-lg flex items-start space-x-3 text-sm text-orange-800">
                                    <AlertCircle className="w-5 h-5 text-orange-600 flex-shrink-0" />
                                    <p>
                                        <strong>주의사항:</strong> 배정을 시작하면 멤버를 추가하거나 삭제할 수 없습니다.
                                        대표자도 결과를 볼 수 없으니 신중하게 눌러주세요!
                                    </p>
                                </div>
                                <button
                                    onClick={runMatching}
                                    disabled={loading}
                                    className="w-full bg-indigo-600 text-white py-4 rounded-xl font-bold text-lg hover:bg-indigo-700 shadow-md transition transform active:scale-95"
                                >
                                    🎲 마니또 배정 시작하기
                                </button>
                            </div>
                        ) : (
                            <div className="text-center space-y-4">
                                <p className="text-gray-600">
                                    배정이 완료되었습니다!<br />
                                    각 멤버 옆의 <strong className="text-indigo-600">링크 복사</strong> 버튼을 눌러 개별적으로 전달해주세요.
                                </p>
                                <button onClick={onBack} className="text-gray-400 text-sm hover:underline">
                                    메인으로 돌아가기
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
