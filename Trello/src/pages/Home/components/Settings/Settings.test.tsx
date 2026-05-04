import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Settings } from './Settings';
import '@testing-library/jest-dom';

describe('Settings Component', () => {
    const mockThemeSettings: Record<string, { btn: string }> = {
        "Небесна": { btn: "bg-blue-500" },
        "Нічна": { btn: "bg-gray-900" },
        "Персикова": { btn: "bg-orange-400" },
    };

    const defaultProps = {
        setThemeStatus: vi.fn(),
        themeStatus: "Небесна",
        setPersonalNote: vi.fn(),
        personalNote: "Мій старий запис",
        themeSettings: mockThemeSettings
    };

    it("renders all available themes", () => {
        render(<Settings {...defaultProps} />);
        const themes = ["Небесна", "Нічна", "Персикова", "М’ятна", "Космос", "Сонячна", "Океан", "Лісова", "Кавова"];
        
        themes.forEach(theme => {
            expect(screen.getByText(theme)).toBeInTheDocument();
        });
    });

    it("highlights the active theme button", () => {
        render(<Settings {...defaultProps} themeStatus="Нічна" />);
        const activeBtn = screen.getByText("Нічна");
        
        expect(activeBtn).toHaveClass('bg-gray-900');
        expect(activeBtn).toHaveClass('scale-105');
        expect(activeBtn).toHaveClass('text-white');
    });

    it("calls setThemeStatus when a theme button is clicked", () => {
        render(<Settings {...defaultProps} />);
        const themeBtn = screen.getByText("Нічна");
        
        fireEvent.click(themeBtn);
        expect(defaultProps.setThemeStatus).toHaveBeenCalledWith("Нічна");
    });

    it("displays the correct initial value in textarea", () => {
        render(<Settings {...defaultProps} />);
        const textarea = screen.getByPlaceholderText(/Запиши сюди швидку ідею/i);
        
        expect(textarea).toHaveValue("Мій старий запис");
    });

    it("calls setPersonalNote when user types in textarea", () => {
        render(<Settings {...defaultProps} />);
        const textarea = screen.getByPlaceholderText(/Запиши сюди швидку ідею/i);
        
        fireEvent.change(textarea, { target: { value: 'Нова ідея' } });
        expect(defaultProps.setPersonalNote).toHaveBeenCalledWith('Нова ідея');
    });

    it("renders inactive themes with default styles", () => {
        render(<Settings {...defaultProps} themeStatus="Небесна" />);
        const inactiveBtn = screen.getByText("Персикова");
        
        expect(inactiveBtn).toHaveClass('bg-white');
        expect(inactiveBtn).toHaveClass('text-gray-600');
        expect(inactiveBtn).not.toHaveClass('scale-105');
    });
});