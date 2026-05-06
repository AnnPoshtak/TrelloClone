import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { SideBar } from './SideBar';
import '@testing-library/jest-dom';

describe('SideBar Component', () => {
    const mockSetActiveTab = vi.fn();

    it("renders both navigation buttons", () => {
        render(<SideBar activeTab="Дошки" setActiveTab={mockSetActiveTab} />);
        
        expect(screen.getByRole('button', { name: /дошки/i })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /налаштування/i })).toBeInTheDocument();
    });

    it("applies active styles to the 'Дошки' button when it is active", () => {
        render(<SideBar activeTab="Дошки" setActiveTab={mockSetActiveTab} />);
        
        const boardsBtn = screen.getByRole('button', { name: /дошки/i });
        const settingsBtn = screen.getByRole('button', { name: /налаштування/i });

        expect(boardsBtn).toHaveClass('bg-white', 'shadow-sm', 'text-black');
        expect(settingsBtn).toHaveClass('text-gray-600');
    });

    it("applies active styles to the 'Налаштування' button when it is active", () => {
        render(<SideBar activeTab="Налаштування" setActiveTab={mockSetActiveTab} />);
        
        const settingsBtn = screen.getByRole('button', { name: /налаштування/i });
        const boardsBtn = screen.getByRole('button', { name: /дошки/i });

        expect(settingsBtn).toHaveClass('bg-white', 'shadow-sm', 'text-black');
        expect(boardsBtn).toHaveClass('text-gray-600');
    });

    it("calls setActiveTab with 'Дошки' when the button is clicked", () => {
        render(<SideBar activeTab="Налаштування" setActiveTab={mockSetActiveTab} />);
        
        const boardsBtn = screen.getByRole('button', { name: /дошки/i });
        fireEvent.click(boardsBtn);
        
        expect(mockSetActiveTab).toHaveBeenCalledWith("Дошки");
    });

    it("calls setActiveTab with 'Налаштування' when the button is clicked", () => {
        render(<SideBar activeTab="Дошки" setActiveTab={mockSetActiveTab} />);
        
        const settingsBtn = screen.getByRole('button', { name: /налаштування/i });
        fireEvent.click(settingsBtn);
        
        expect(mockSetActiveTab).toHaveBeenCalledWith("Налаштування");
    });

    it("has the correct layout classes for the sidebar container", () => {
        render(<SideBar activeTab="Дошки" setActiveTab={mockSetActiveTab} />);
        
        const navElement = screen.getByRole('navigation');
        expect(navElement).toHaveClass('w-70', 'h-screen', 'sticky', 'top-0');
    });

    it("calls setActiveTab with 'Налаштування' when the button is clicked", () => {
        render(<SideBar activeTab="Дошки" setActiveTab={mockSetActiveTab} />);
        
        const settingsBtn = screen.getByRole('button', { name: /налаштування/i });
        fireEvent.click(settingsBtn);
        
        expect(mockSetActiveTab).toHaveBeenCalledWith("Налаштування");
    });
});