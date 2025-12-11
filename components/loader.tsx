export default function Loader() {
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-transparent">
      <img
        src="/vercel.svg"
        alt="loading"
        className="w-75 animate-bounce"
      />
    </div>
  );
}