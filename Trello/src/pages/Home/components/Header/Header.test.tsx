import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Header } from './Header';
import '@testing-library/jest-dom';

describe('Header Component', () => {
    const mockProps = {
        activeTab: "Дошки" as const,
        setModalStatus: vi.fn(),
        logOut: vi.fn(),
        currentTheme: {
            bg: 'bg-blue-500',
            btn: 'bg-indigo-600'
        }
    };

    it("renders 'Твої дошки' title when activeTab is 'Дошки'", () => {
        render(<Header {...mockProps} />);
        expect(screen.getByText('Твої дошки')).toBeInTheDocument();
    });

    it("renders 'Налаштування' title when activeTab is 'Налаштування'", () => {
        render(<Header {...mockProps} activeTab="Налаштування" />);
        expect(screen.getByText('Налаштування')).toBeInTheDocument();
    });

    it("shows 'Додати дошку' button only on 'Дошки' tab", () => {
        const { rerender } = render(<Header {...mockProps} />);
        expect(screen.getByText('Додати дошку')).toBeInTheDocument();

        rerender(<Header {...mockProps} activeTab="Налаштування" />);
        expect(screen.queryByText('Додати дошку')).not.toBeInTheDocument();
    });

    it("calls setModalStatus(true) when add button is clicked", () => {
        render(<Header {...mockProps} />);
        const addButton = screen.getByText('Додати дошку');
        fireEvent.click(addButton);
        expect(mockProps.setModalStatus).toHaveBeenCalledWith(true);
    });

    it("calls logOut when exit button is clicked", () => {
        render(<Header {...mockProps} />);
        const logoutButton = screen.getByText('Вийти');
        fireEvent.click(logoutButton);
        expect(mockProps.logOut).toHaveBeenCalledTimes(1);
    });

    it("applies the theme button class to the add button", () => {
        render(<Header {...mockProps} />);
        const addButton = screen.getByText('Додати дошку');
        expect(addButton).toHaveClass('bg-indigo-600');
    });

    it("has basic layout classes for header", () => {
        render(<Header {...mockProps} />);
        const headerElement = screen.getByRole('banner'); 
        expect(headerElement).toHaveClass('flex', 'justify-between', 'items-center');
    });
});