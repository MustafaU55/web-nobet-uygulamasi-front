// app/components/user/UserInfo.js
import UpdateUserForm from './UpdateUserForm';

export default function UserInfo({ user }) {
    return (
        <div className="p-6 border-b">
            <p className="text-xl font-semibold text-gray-800 mb-4">
                Kullanıcı Bilgileri
            </p>
            <UpdateUserForm user={user} />
        </div>
    );
}