// app/components/user/UserActions.js
import Link from 'next/link';
import DutyRequestForm from './DutyRequestForm';

export default function UserActions({ userId, userName }) {
    return (
        <div className="p-6 border-b">
            <div className="flex gap-4">
                <DutyRequestForm userId={userId} userName={userName} />
                <Link
                    href={`/users/${userId}/duties`}
                    className="flex items-center px-6 py-3 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors"
                >
                    <svg className="w-10 h-10 md:w-5 md:h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    Nöbet Programı
                </Link>
            </div>
        </div>
    );
}