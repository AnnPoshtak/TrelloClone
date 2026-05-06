interface HeaderProps {
    activeTab: "Дошки" | "Налаштування";
    setModalStatus: React.Dispatch<React.SetStateAction<boolean>>;
    logOut: () => void;
    currentTheme: {
        bg: string;
        btn: string;
    };
}

const Header = ({ activeTab, setModalStatus, logOut, currentTheme }: HeaderProps) => {
    return (
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
    )
}

export { Header }