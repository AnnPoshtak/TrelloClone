interface ISettings {
    setThemeStatus: (theme: string) => void;
    themeStatus: string;
    setPersonalNote: (note: string) => void;
    personalNote: string;
    themeSettings: Record<string, { btn: string }>;
}

const Settings = ({ setThemeStatus, themeStatus, setPersonalNote, personalNote, themeSettings }: ISettings) => {
    const availableThemes = ["Небесна", "Нічна", "Персикова", "М’ятна", "Космос"];
    return (
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
                                className={`px-5 py-2.5 rounded-xl font-medium transition-all duration-300 border ${themeStatus === theme
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
    )
}

export { Settings } 