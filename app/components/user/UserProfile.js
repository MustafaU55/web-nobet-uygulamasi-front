// app/components/user/UserProfile.js
import Image from 'next/image';

export default function UserProfile({ user }) {
    return (
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-8 py-12">
            <div className="flex items-center space-x-6">
                <div className="relative w-[120px] h-[120px]">
                    <Image
                        src={user.photo || '/default-avatar.png'}
                        alt={user.name}
                        fill
                        sizes="120px"
                        style={{ objectFit: 'cover' }}
                        className="rounded-full border-4 border-white"
                    />
                </div>
                <div className="text-white">
                    <h1 className="text-3xl font-bold">{user.name}</h1>
                    <p className="text-blue-100 mt-1">{user.title || 'Ünvan Belirtilmemiş'}</p>
                </div>
            </div>
        </div>
    );
}