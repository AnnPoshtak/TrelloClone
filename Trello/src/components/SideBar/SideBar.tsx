import React from "react";

interface SideBarProps {
    activeTab: "Дошки" | "Налаштування";
    setActiveTab: React.Dispatch<React.SetStateAction<"Дошки" | "Налаштування">>;
}

export const SideBar = ({ activeTab, setActiveTab }: SideBarProps) => {
    return (
        <nav className="w-[280px] bg-white/80 backdrop-blur-xl border-r border-white/50 flex flex-col py-10 rounded-r-[40px] shadow-[4px_0_24px_rgba(0,0,0,0.02)] z-10 shrink-0 h-screen sticky top-0 justify-between">
            <div className="flex flex-col gap-2 px-4">
                <button 
                    onClick={() => setActiveTab("Дошки")} 
                    className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl font-medium transition-all ${
                        activeTab === "Дошки" ? "bg-white shadow-sm text-black" : "text-gray-600 hover:bg-white/50"
                    }`}
                >
                    Дошки
                </button>
                
                <button 
                    onClick={() => setActiveTab("Налаштування")} 
                    className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl font-medium transition-all ${
                        activeTab === "Налаштування" ? "bg-white shadow-sm text-black" : "text-gray-600 hover:bg-white/50"
                    }`}
                >
                    Налаштування
                </button>
            </div>
        </nav>
    );
};