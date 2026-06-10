import React, { useState, useEffect } from "react";
import api from "@/app/loaders/baseApi";
import Loading from "../loading";

const ProfileCard = () => {
  const [userData, setUserData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [, setFormData] = useState({
    firstname: "",
    lastname: "",
    username: "",
    email: "",
    phoneNumber: "",
    profilePhotoUrl: ""
  });
  const [showMore, setShowMore] = useState(false);
  const [isScrollable, setIsScrollable] = useState(false);

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    setIsLoading(true);
    try {
      const response = await api.get("/api/userData");
      setUserData(response.data.data.userData);
      setFormData(response.data.data.userData); // Ensure this matches the structure of your API response

      if (response.data.data.userData.email.length > 32) {
        setIsScrollable(true);
      }
    } catch {
      setError("Veri alınırken bir hata oluştu.");

    } finally {
      setIsLoading(false);
    }
  };

  const LogoutButton = () => {
    const [loading, setLoading] = useState(false);

    const logout = async () => {
      setLoading(true);
      try {
        await api.post("/api/logout", { withCredentials: true });
        window.location.href = "/login";
      } catch {

      } finally {
        setLoading(false);
      }
    };

    return (
      <button
        onClick={logout}
        className="w-full text-white pt-2 rounded-md flex items-center justify-center transition hover:text-white duration-100 group"
        disabled={loading}
      >
        <svg
          fill="currentColor"
          width="24px"
          height="24px"
          viewBox="0 0 20 20"
          xmlns="http://www.w3.org/2000/svg"
          className="mr-2 group-hover:text-white"
        >
          <path d="M19 10l-6-5v3H6v4h7v3l6-5zM3 3h8V1H3c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h8v-2H3V3z"></path>
        </svg>
        {loading ? "Çıkış yapılıyor..." : "Çıkış Yap"}
      </button>
    );
  };

  if (error) {
    return <p className="text-red-500">{error}</p>;
  }

  return (
    <div className="max-w-sm mx-auto overflow-hidden xl:p-6">
      {isLoading ? (
        <Loading />
      ) : (
        <>
          <div className="flex items-center justify-center xl:mb-4 flex-col xl:flex-row ">
            <div className="flex items-center pl-[8vh] xl:mb-4 mr-2">
              <div>
                <h2 className="hidden xl:block text-2xl font-bold text-white pl-2 pt-2 text-center xl:text-left">
                  {userData?.firstname} {userData?.lastname}
                </h2>
              </div>
            </div>

            <button
              onClick={() => setShowMore(!showMore)}
              className="hidden xl:block text-[#9e9ed7] hover:text-blue-700 flex items-center"
            >
              <svg
                width="48px"
                height="48px"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M4 6H20M4 12H20M4 18H20"
                  stroke="#ffffff"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <span>{showMore ? "" : ""}</span>
            </button>
          </div>

          {showMore && (
            <div>
              <p
                className={`text-gray-300 ${isScrollable ? "scrollable" : ""}`}
                style={{ maxWidth: isScrollable ? "200px" : "none" }}
              >
                <strong className="text-white">Email:</strong> {userData.email}
              </p>
              <p className="text-gray-300"><strong className="text-white">Kullanıcı Adı:</strong> {userData?.username}</p>
              <p className="text-gray-300"><strong className="text-white">Telefon:</strong> {userData?.phoneNumber}</p>
            </div>
          )}

          <div className="hidden xl:block ">
            <LogoutButton />
          </div>
        </>
      )}
    </div>
  );
};

export default ProfileCard;