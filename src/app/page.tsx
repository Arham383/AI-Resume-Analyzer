/*export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-slate-100">
      <h1 className="text-5xl font-bold text-blue-700">
        AI Resume Analyzer
      </h1>

      <p className="mt-4 text-lg text-gray-600">
        Analyze your resume with AI and improve your chances of getting hired.
      </p>

      <button className="mt-8 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
        Upload Resume
      </button>
    </main>
  );
}
  */
import UploadBox from "./components/UploadBox";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
export default function Home() {
  return (
    <>
    <Navbar />
    <main className="min-h-screen bg-gradient-to-br from-blue-100 to-white flex items-center justify-center">
      <div className="bg-white p-10 rounded-2xl shadow-xl max-w-2xl text-center">

        <Hero />

        <UploadBox />

      </div>
    </main>
    </>
  );
}