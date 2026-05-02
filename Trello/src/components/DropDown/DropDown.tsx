import { useState, useRef, useEffect } from "react";

interface DropdownProps {
  options: string[];
  selected: string;
  onSelect: (value: string) => void;
  placeholder?: string;
}

const Dropdown = ({ options, selected, onSelect, placeholder = "Оберіть..." }: DropdownProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Логіка для закриття меню при кліку поза його межами
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative w-64" ref={dropdownRef}>
      {/* Кнопка-тригер */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-4 py-3 bg-white/60 backdrop-blur-md border border-white/80 rounded-2xl shadow-sm text-[#2b2b2b] font-medium hover:bg-white/80 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#4a81d4]/30"
      >
        <span className="truncate">{selected || placeholder}</span>
        
        {/* Іконка стрілочки, яка обертається */}
        <svg
          className={`w-5 h-5 text-gray-500 transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Саме випадаюче меню */}
      <div
        className={`absolute top-full left-0 w-full mt-2 bg-white/80 backdrop-blur-xl border border-white/60 rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.08)] overflow-hidden z-50 transition-all duration-300 origin-top ${
          isOpen ? "opacity-100 scale-y-100" : "opacity-0 scale-y-0 pointer-events-none"
        }`}
      >
        <ul className="py-2 flex flex-col gap-1">
          {options.map((option, index) => (
            <li
              key={index}
              onClick={() => {
                onSelect(option);
                setIsOpen(false);
              }}
              className={`px-4 py-2 mx-2 rounded-xl cursor-pointer transition-all duration-200 flex items-center gap-3 ${
                selected === option
                  ? "bg-[#4a81d4] text-white font-medium shadow-sm"
                  : "text-[#2b2b2b] hover:bg-white hover:shadow-sm"
              }`}
            >
              {/* Іконка галочки для обраного елемента */}
              <span className={`w-4 h-4 flex flex-shrink-0 items-center justify-center ${selected === option ? 'opacity-100' : 'opacity-0'}`}>
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" className="w-full h-full">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                </svg>
              </span>
              <span className="truncate">{option}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Dropdown;