import EntryCarousel from "../components/page-home/EntryCarousel";
import StellaSoraLogo from "../assets/stellasora-logo-white.webp";

function HomePage() {
  return (
    <div
      className="min-h-screen w-full flex flex-col items-center justify-center
      bg-gradient-to-br from-blue-600 to-sky-300 text-white
      [.dark_&]:bg-gradient-to-tr [.dark_&]:from-[#221129] [.dark_&]:to-[#113366]
      gap-8 px-8 py-4 overflow-hidden"
    >
      <img
        src={StellaSoraLogo}
        alt="Stella Sora Logo"
        className="max-h-[60px]"
      />
      <div
        className="flex-shrink novamodern font-extrabold text-center drop-shadow-lg"
        style={{ fontSize: "clamp(1rem, 9vw, 4rem)" }}
      >
        Nova Archive
      </div>
      <EntryCarousel />
    </div>
  );
}

export default HomePage;
