import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import type { IBoard } from "../../common/interfaces/IBoard.ts";
import BoardComponent from "./components/BoardComponent/BoardComponent.tsx";
import api from "../../api/request.ts";
import toast from "react-hot-toast";
import CreateModal from "../../components/CreateModal/CreateModal.tsx";
import { themeSettings } from "../../ThemeSettings.ts";
import InteractiveGarland from "../../components/InteractiveGarland/InteractiveGarland.tsx";

function Home() {
    const navigate = useNavigate();
    const [boards, setBoards] = useState<IBoard[]>([]);
    const [modalStatus, setModalStatus] = useState<boolean>(false);
    const [activeTab, setActiveTab] = useState<"Дошки" | "Налаштування">("Дошки");
    
    const [themeStatus, setThemeStatus] = useState(() => {
        return localStorage.getItem("trello_theme") || "Небесна";
    });
    
    const [personalNote, setPersonalNote] = useState(() => {
        return localStorage.getItem("trello_note") || "";
    });

    const currentTheme = themeSettings[themeStatus] || themeSettings["Небесна"];

    const availableThemes = ["Небесна", "Нічна", "Персикова", "М’ятна", "Космос"];

    useEffect(() => {
        localStorage.setItem("trello_note", personalNote);
    }, [personalNote]);

    useEffect(() => {
        localStorage.setItem("trello_theme", themeStatus);
    }, [themeStatus]);

    useEffect(() => {
        async function fetchBoards() {
            try {
                const response = await api.get('/board');
                setBoards(response.boards || response.data); 
            } catch (err: any) {
                if (err.response?.status === 401) {
                    navigate("/login");
                } else {
                    toast.error("Error loading boards");
                }
            }
        }
        fetchBoards();
    }, [navigate]);

    async function createBoard(title: string, color: string) {
        try {
            const response = await api.post('/board', {
                title: title,
                custom: { background: color }
            });

            const newBoard: IBoard = {
                id: response.id,
                title: title,
                custom: { background: color } as any 
            };

            setBoards([...boards, newBoard]);
            setModalStatus(false);
            toast.success("Created");
        } catch (err: any) {
            toast.error("Error");
        }
    }

    const logOut = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("refreshToken");
        navigate("/login");
    }

    return (
        <div className={`min-h-screen flex bg-gradient-to-br ${currentTheme.bg} transition-colors duration-700 text-gray-800 font-sans`}>
            
            <nav className="w-[280px] bg-white/80 backdrop-blur-xl border-r border-white/50 flex flex-col py-10 rounded-r-[40px] shadow-[4px_0_24px_rgba(0,0,0,0.02)] z-10 shrink-0 h-screen sticky top-0 justify-between">
                <div className="flex flex-col gap-2 px-4">
                    <button 
                        onClick={() => setActiveTab("Дошки")} 
                        className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl font-medium transition-all ${activeTab === "Дошки" ? "bg-white shadow-sm text-black" : "text-gray-600 hover:bg-white/50"}`}
                    >
                        Дошки
                    </button>
                    
                    <button 
                        onClick={() => setActiveTab("Налаштування")} 
                        className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl font-medium transition-all ${activeTab === "Налаштування" ? "bg-white shadow-sm text-black" : "text-gray-600 hover:bg-white/50"}`}
                    >
                        Налаштування
                    </button>
                </div>
            </nav>

            <main className="flex-1 flex flex-col p-8 h-screen overflow-hidden">
                <header className="flex justify-between items-center w-full mb-8 relative">
                    <div className="absolute left-1/2 -translate-x-1/2 bg-white/80 backdrop-blur-md px-6 py-2 rounded-2xl shadow-sm border border-white/50">
                        <h1 className="text-[1.25rem] font-bold text-gray-800">
                            {activeTab === "Дошки" ? "Твої дошки" : activeTab}
                        </h1>
                    </div>
                    
                    <div className="flex-1"></div>
                    
                    <div className="flex gap-4 relative z-10">
                        {activeTab === "Дошки" && (
                            <button 
                                onClick={() => setModalStatus(true)} 
                                className={`${currentTheme.btn} text-white px-6 py-2.5 rounded-[12px] font-medium shadow-md transition-all flex items-center gap-2 border border-white/20`}
                            >
                                Додати дошку
                            </button>
                        )}
                        <button 
                            onClick={logOut} 
                            className="bg-white/80 backdrop-blur-md text-gray-800 px-6 py-2.5 rounded-[12px] font-medium hover:bg-white transition-all shadow-sm border border-white/50 flex items-center gap-2"
                        >
                            Вийти
                        </button>
                    </div>
                </header>

                <div className="flex-1 bg-white/70 backdrop-blur-2xl border border-white/60 rounded-[32px] p-10 shadow-[0_8px_32px_rgba(0,0,0,0.08)] overflow-y-auto">
                    
                    {activeTab === "Дошки" && (
                        <>
                            <div className="flex flex-row items-center gap-20 flex-wrap">
                                {boards.map(board => (
                                    <BoardComponent
                                        key={board.id}
                                        title={board.title}
                                        custom={board.custom}
                                        board={board}
                                    />
                                ))}
                            </div>

                            <CreateModal
                                modalStatus={modalStatus}
                                onClose={() => setModalStatus(false)}
                                modalTitle="New board"
                                placeholder="Title"
                                withColorPicker={true} 
                                onSubmit={({ text, color }) => createBoard(text, color || "#6366f1")}
                            />
                        </>
                    )}

                    {activeTab === "Налаштування" && (
                        <div className="flex flex-col gap-8 h-full max-w-2xl mx-auto w-full pt-4 pb-10">
                            
                            <div className="bg-white/90 backdrop-blur-md border border-white/80 rounded-3xl p-6 shadow-sm flex flex-col gap-6">
                                <h3 className="text-lg font-bold text-gray-800 border-b border-gray-200/50 pb-3">
                                    Вигляд
                                </h3>
                                
                                <div className="flex flex-col gap-3">
                                    <span className="font-medium text-gray-700">Тема додатку</span>
                                    <div className="flex flex-wrap gap-3">
                                        {availableThemes.map(theme => (
                                            <button
                                                key={theme}
                                                onClick={() => setThemeStatus(theme)}
                                                className={`px-5 py-2.5 rounded-xl font-medium transition-all duration-300 border ${
                                                    themeStatus === theme 
                                                        ? `${themeSettings[theme].btn} text-white border-transparent shadow-md scale-105` 
                                                        : "bg-white text-gray-600 border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                                                }`}
                                            >
                                                {theme}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white/90 backdrop-blur-md border border-white/80 rounded-3xl p-6 shadow-sm flex flex-col gap-4">
                                <h3 className="text-lg font-bold text-gray-800 border-b border-gray-200/50 pb-3">
                                    Особисті нотатки
                                </h3>
                                <h4 className="text-grey-900">Запиши свою ідею, щоб вона не загубилася. Всі втох запис зберігаються у браузері і нікуди не зникнуть</h4>

                                <textarea 
                                    value={personalNote}
                                    onChange={(e) => setPersonalNote(e.target.value)}
                                    placeholder="Запиши сюди швидку ідею..."
                                    className="w-full h-32 bg-white/70 border border-white/80 rounded-2xl p-4 text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-400/50 resize-none transition-all shadow-inner"
                                />
                            </div>
                        </div>
                    )}

                </div>
            </main>
        </div>
    );
}

export default Home;