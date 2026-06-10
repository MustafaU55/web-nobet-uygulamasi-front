import Logo from "./components/loadinglogo";

export default function Loading() {
  return (
    <div className="loading-container w-full min-h-screen flex items-center justify-center">
      <div className="loading-content page-wrapper flex flex-col items-center justify-center">
        <Logo/>
      </div>
    </div>
  );
}
