import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import type { IBoard } from "../../common/interfaces/IBoard.ts";
import BoardComponent from "./components/BoardComponent/BoardComponent.tsx";
import api from "../../api/request.ts";
import toast from "react-hot-toast";
import CreateModal from "../../components/CreateModal/CreateModal.tsx";
import Dropdown from '../../components/DropDown/DropDown.tsx';
import { themeSettings } from "../../ThemeSettings.ts";

function Home() {
    const navigate = useNavigate();
    const [boards, setBoards] = useState<IBoard[]>([]);
    const [modalStatus, setModalStatus] = useState<boolean>(false);
    const [activeTab, setActiveTab] = useState<"Дошки" | "Налаштування" | ":)">("Дошки");
    
    const [languagedStatus, setLanguagedStatus] = useState("Українська");
    
    const [themeStatus, setThemeStatus] = useState(() => {
        return localStorage.getItem("trello_theme") || "Світло-Синя";
    });
    
    const [personalNote, setPersonalNote] = useState(() => {
        return localStorage.getItem("trello_note") || "";
    });

    const currentTheme = themeSettings[themeStatus] || themeSettings["Світло-Синя"];

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
        <div className={`min-h-screen flex bg-gradient-to-br ${currentTheme.bg} transition-colors duration-700 text-[#2b2b2b] font-sans`}>
            
            <nav className="w-[280px] bg-white/80 backdrop-blur-xl border-r border-white/50 flex flex-col py-10 rounded-r-[40px] shadow-[4px_0_24px_rgba(0,0,0,0.02)] z-10 shrink-0 h-screen sticky top-0 justify-between">
                <div className="flex flex-col gap-2 px-4">
                    <button 
                        onClick={() => setActiveTab("Дошки")} 
                        className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl font-medium transition-all ${activeTab === "Дошки" ? "bg-white shadow-sm text-black" : "text-gray-600 hover:bg-white/50"}`}
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2"></path></svg>
                        Дошки
                    </button>
                    
                    <button 
                        onClick={() => setActiveTab("Налаштування")} 
                        className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl font-medium transition-all ${activeTab === "Налаштування" ? "bg-white shadow-sm text-black" : "text-gray-600 hover:bg-white/50"}`}
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                        Налаштування
                    </button>
                </div>

                <div className="px-4">
                    <button 
                        onClick={() => setActiveTab(":)")} 
                        className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl font-medium transition-all ${activeTab === "По приколу" ? "bg-white shadow-sm text-black" : "text-gray-600 hover:bg-white/50"}`}
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                        :)
                    </button>
                </div>
            </nav>

            <main className="flex-1 flex flex-col p-8 h-screen overflow-hidden">
                <header className="flex justify-between items-center w-full mb-8 relative">
                    <div className="absolute left-1/2 -translate-x-1/2 bg-white/80 backdrop-blur-md px-6 py-2 rounded-2xl shadow-sm border border-white/50">
                        <h1 className="text-[1.25rem] font-bold text-[#2b2b2b]">
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
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path></svg>
                                 Додати дошку
                            </button>
                        )}
                        <button 
                            onClick={logOut} 
                            className="bg-white/80 backdrop-blur-md text-[#2b2b2b] px-6 py-2.5 rounded-[12px] font-medium hover:bg-white transition-all shadow-sm border border-white/50 flex items-center gap-2"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path></svg>
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
                            <div className="bg-white/90 backdrop-blur-md border border-white/80 rounded-3xl p-6 shadow-sm flex flex-col gap-4">
                                <div className="flex items-center gap-3 border-b border-gray-200/50 pb-3">
                                    <svg className="w-5 h-5 text-[#4a81d4]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path></svg>
                                    <h3 className="text-lg font-bold text-[#2b2b2b]">Особисті нотатки</h3>
                                </div>
                                <p className="text-sm text-gray-500">
                                    Ці записи зберігаються локально у твоєму браузері. Вони не зникнуть після оновлення сторінки.
                                </p>
                                <textarea 
                                    value={personalNote}
                                    onChange={(e) => setPersonalNote(e.target.value)}
                                    placeholder="Запиши сюди швидку ідею, щоб не забути..."
                                    className="w-full h-32 bg-white/70 border border-white/80 rounded-2xl p-4 text-[#2b2b2b] placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#4a81d4]/50 resize-none transition-all shadow-inner"
                                ></textarea>
                            </div>

                            <div className="bg-white/90 backdrop-blur-md border border-white/80 rounded-3xl p-6 shadow-sm flex flex-col gap-6">
                                <h3 className="text-lg font-bold text-[#2b2b2b] border-b border-gray-200/50 pb-3">Вигляд та локалізація</h3>
                                
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                    <span className="font-medium text-gray-700">Мова інтерфейсу</span>
                                    <Dropdown 
                                        options={["Українська", "English", "Chinese"]} 
                                        selected={languagedStatus} 
                                        onSelect={setLanguagedStatus} 
                                        placeholder="Оберіть мову..."
                                    />
                                </div>

                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 ">
                                    <span className="font-medium text-gray-700">Тема додатку</span>
                                    <Dropdown 
                                        options={["Світло-Синя", "Темно-Синя", "Вогняна", "Лісова"]} 
                                        selected={themeStatus} 
                                        onSelect={setThemeStatus} 
                                        placeholder="Оберіть тему..."
                                    />
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === ":)" && (
                        <div className="flex flex-col items-center justify-center h-full gap-6">
                            <img 
                                src="https://i.pinimg.com/1200x/eb/5f/c5/eb5fc532a7435289a8f43e7c3788d74c.jpg" 
                                alt="Super cat" 
                                className="rounded-[24px] shadow-lg max-h-[400px] object-cover"
                            />
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}

export default Home;