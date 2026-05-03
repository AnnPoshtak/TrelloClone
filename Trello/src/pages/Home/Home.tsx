import { useState } from "react";
import { useNavigate } from "react-router-dom";
import BoardComponent from "./components/BoardComponent/BoardComponent.tsx";
import CreateModal from "@/components/CreateModal/CreateModal.tsx";
import { themeSettings } from "@/ThemeSettings.ts";
import { SideBar } from "./components/SideBar/SideBar.tsx";
import { Header } from "./components/Header/Header.tsx";
import { Settings } from "./components/Settings/Settings.tsx";

import { useLocalStorage } from "@/hooks/useLocalStorage/useLocalStorage.ts";
import { useBoards } from "@/hooks/useBoards/useBoards.ts";

function Home() {
    const navigate = useNavigate();
    const [modalStatus, setModalStatus] = useState<boolean>(false);
    const [activeTab, setActiveTab] = useState<"Дошки" | "Налаштування">("Дошки");

    const [themeStatus, setThemeStatus] = useLocalStorage("trello_theme", "Небесна");
    const [personalNote, setPersonalNote] = useLocalStorage("trello_note", "");
    const currentTheme = themeSettings[themeStatus as keyof typeof themeSettings] || themeSettings["Небесна"];

    const { boards, createBoard } = useBoards();

    const handleCreateBoard = async (text: string, color: string) => {
        const success = await createBoard(text, color || "#6366f1");
        if (success) {
            setModalStatus(false);
        }
    };

    const logOut = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("refreshToken");
        navigate("/login");
    }

    return (
        <div className={`min-h-screen flex bg-gradient-to-br ${currentTheme.bg} transition-colors duration-700 text-gray-800 font-sans`}>
            <SideBar setActiveTab={setActiveTab} activeTab={activeTab} />

            <main className="flex-1 flex flex-col p-8 h-screen overflow-hidden">
                <Header activeTab={activeTab} setModalStatus={setModalStatus} logOut={logOut} currentTheme={currentTheme} />

                <div className="flex-1 bg-white/70 backdrop-blur-2xl border border-white/60 rounded-[32px] p-10 shadow-[0_8px_32px_rgba(0,0,0,0.08)] overflow-y-auto">
                    {activeTab === "Дошки" && (
                        <>
                            <div className="flex flex-row items-center gap-20 flex-wrap">
                                {boards.map(board => (
                                    <BoardComponent key={board.id} title={board.title} custom={board.custom} board={board}/>
                                ))}
                            </div>

                            <CreateModal modalStatus={modalStatus} onClose={() => setModalStatus(false)} modalTitle="Нова дошка" placeholder="Title" withColorPicker={true} onSubmit={({ text, color }) => handleCreateBoard(text, color)} />
                        </>
                    )}

                    {activeTab === "Налаштування" && (
                        <Settings setThemeStatus={setThemeStatus} themeStatus={themeStatus} setPersonalNote={setPersonalNote} personalNote={personalNote} themeSettings={themeSettings} />
                    )}

                </div>
            </main>
        </div>
    );
}

export default Home;