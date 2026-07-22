export default function Navbar() {
    return(
        <nav className="w-full flex justify-between items-centre px-8 py-4 bg-white shadow-md">
            <h2 className="text-2xl font-bold text-blue-700">
                AI Resume Analyzer
            </h2>

            <button className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-nlue-700">
                Login
            </button>
        </nav>
    );
}