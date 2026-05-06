import React from 'react';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Home from './Home';

import { useBoards } from '@/hooks/useBoards/useBoards.ts';
import { useLocalStorage } from '@/hooks/useLocalStorage/useLocalStorage.ts';

const mockNavigate = vi.fn();

vi.mock('react-router-dom', async () => {
    const actual = await vi.importActual('react-router-dom');
    return {
        ...actual,
        useNavigate: () => mockNavigate,
    };
});

vi.mock('@/hooks/useBoards/useBoards.ts', () => ({
    useBoards: vi.fn()
}));

vi.mock('@/hooks/useLocalStorage/useLocalStorage.ts', () => ({
    useLocalStorage: vi.fn()
}));

vi.mock('./components/BoardComponent/BoardComponent.tsx', () => ({
    default: ({ title }: any) => <div data-testid="board-item">{title}</div>
}));

vi.mock('./components/SideBar/SideBar.tsx', () => ({
    SideBar: ({ setActiveTab }: any) => (
        <div data-testid="sidebar">
            <button onClick={() => setActiveTab("Дошки")}>Дошки</button>
            <button onClick={() => setActiveTab("Налаштування")}>Налаштування</button>
        </div>
    )
}));

vi.mock('./components/Header/Header.tsx', () => ({
    Header: ({ activeTab, setModalStatus, logOut }: any) => (
        <div data-testid="header">
            {activeTab === "Дошки" && <button onClick={() => setModalStatus(true)}>Додати дошку</button>}
            <button onClick={logOut}>Вихід</button>
        </div>
    )
}));

vi.mock('./components/Settings/Settings.tsx', () => ({
    Settings: () => <div data-testid="settings">Вигляд додатку</div>
}));

vi.mock('@/components/CreateModal/CreateModal.tsx', () => ({
    default: ({ modalStatus, onClose, onSubmit }: any) => {
        if (!modalStatus) return null;
        const [text, setText] = React.useState('');
        return (
            <div data-testid="create-modal">
                <div>Нова дошка</div>
                <input placeholder="Title" value={text} onChange={(e) => setText(e.target.value)} />
                <button onClick={() => onSubmit({ text, color: '#6366f1' })}>Створити</button>
                <button onClick={onClose}>Скасувати</button>
            </div>
        );
    }
}));

vi.mock('@/ThemeSettings.ts', () => ({
    themeSettings: {
        "Небесна": { bg: "from-blue-400 to-blue-600" },
        "Темна": { bg: "from-gray-800 to-gray-900" }
    }
}));

const mockBoardsData = [
    { id: 1, title: "Board 1", custom: { color: "#fff" } },
    { id: 2, title: "Board 2", custom: { color: "#000" } }
];

describe('Home Component', () => {
    const mockCreateBoard = vi.fn().mockResolvedValue(true);
    const mockSetTheme = vi.fn();
    const mockSetNote = vi.fn();

    beforeEach(() => {
        vi.clearAllMocks();
        vi.spyOn(Storage.prototype, 'removeItem');

        (useBoards as any).mockReturnValue({
            boards: mockBoardsData,
            createBoard: mockCreateBoard,
        });

        (useLocalStorage as any).mockImplementation((key: string, initialValue: any) => {
            if (key === "trello_theme") return ["Небесна", mockSetTheme];
            if (key === "trello_note") return ["My note", mockSetNote];
            return [initialValue, vi.fn()];
        });
    });

    const renderPage = () => render(
        <MemoryRouter>
            <Home />
        </MemoryRouter>
    );

    it('should match the snapshot', () => {
        const { container } = renderPage();
        expect(container).toMatchSnapshot();
    });

    it("should render boards", () => {
        renderPage();
        const boardElements = screen.getAllByTestId("board-item");
        expect(boardElements).toHaveLength(mockBoardsData.length);
    });

    it("should render boards page by default", () => {
        renderPage();
        expect(screen.getByText("Board 1")).toBeInTheDocument();
    });

    it("should handle empty boards array correctly", () => {
        (useBoards as any).mockReturnValue({
            boards: [],
            createBoard: mockCreateBoard,
        });
        renderPage();
        expect(screen.queryByTestId("board-item")).not.toBeInTheDocument();
    });

    it("should apply correct theme background class based on localStorage", () => {
        const { container } = renderPage();
        expect(container.firstChild).toHaveClass("from-blue-400 to-blue-600");
    });

    it("should apply fallback theme if localStorage theme is invalid", () => {
        (useLocalStorage as any).mockImplementation((key: string) => {
            if (key === "trello_theme") return ["Неіснуюча Тема", mockSetTheme];
            return ["", vi.fn()];
        });
        const { container } = renderPage();
        expect(container.firstChild).toHaveClass("from-blue-400 to-blue-600");
    });

    it("should switch tabs correctly", () => {
        renderPage();
        
        const settingsTab = screen.getByRole('button', { name: "Налаштування" });
        fireEvent.click(settingsTab);
        expect(screen.getByText(/Вигляд додатку/i)).toBeInTheDocument();

        const boardsTab = screen.getByRole('button', { name: "Дошки" });
        fireEvent.click(boardsTab);
        expect(screen.getByText("Board 1")).toBeInTheDocument();
    });

    it("should logout user and navigate to login", () => {
        renderPage();
        const logoutButton = screen.getByRole('button', { name: /Вихід/i });
        fireEvent.click(logoutButton);
        expect(mockNavigate).toHaveBeenCalledWith('/login');
    });

    it("if user logged out, token from localStorage should be cleared", () => {
        renderPage();
        const logoutButton = screen.getByRole('button', { name: /Вихід/i });
        fireEvent.click(logoutButton);
        expect(localStorage.removeItem).toHaveBeenCalledWith('token');
        expect(localStorage.removeItem).toHaveBeenCalledWith('refreshToken');
    });

    it('should open the "Create Board" modal when the button is clicked', () => {
        renderPage();
        const btn = screen.getByRole('button', { name: /\Додати дошку/i });
        fireEvent.click(btn);
        expect(screen.getByText('Нова дошка')).toBeInTheDocument();
    });

    it("should close the modal without creating a board when cancel is clicked", async () => {
        renderPage();
        fireEvent.click(screen.getByRole('button', { name: /\Додати дошку/i }));
        
        const closeButton = screen.getByRole('button', { name: /Скасувати/i });
        fireEvent.click(closeButton);
        
        await waitFor(() => {
            expect(screen.queryByText('Нова дошка')).not.toBeInTheDocument();
        });
        expect(mockCreateBoard).not.toHaveBeenCalled();
    });

    it("should show create board button only in boards tab", () => {
        renderPage();
        expect(screen.getByRole('button', { name: /\Додати дошку/i })).toBeInTheDocument();

        const settingsTab = screen.getByRole('button', { name: "Налаштування" });
        fireEvent.click(settingsTab);
        expect(screen.queryByRole('button', { name: /\Додати дошку/i })).not.toBeInTheDocument();
    });

    it("should close create board modal when successfully created", async () => {
        renderPage();
        fireEvent.click(screen.getByRole('button', { name: /\Додати дошку/i }));
        
        const input = screen.getByPlaceholderText(/Title/i);
        fireEvent.change(input, { target: { value: 'Нова дошка' } });

        const createButton = screen.getByRole('button', { name: /Створити/i });
        fireEvent.click(createButton);

        await waitFor(() => {
            expect(screen.queryByText('Нова дошка')).not.toBeInTheDocument();
        });
    });

    it("should not close modal if board creation fails", async () => {
        mockCreateBoard.mockResolvedValueOnce(false);
        renderPage();
        
        fireEvent.click(screen.getByRole('button', { name: /\Додати дошку/i }));
        
        const input = screen.getByPlaceholderText(/Title/i);
        fireEvent.change(input, { target: { value: 'Нова дошка' } });

        const createButton = screen.getByRole('button', { name: /Створити/i });
        fireEvent.click(createButton);

        await waitFor(() => {
            expect(mockCreateBoard).toHaveBeenCalled();
        });
        expect(screen.getByText('Нова дошка')).toBeInTheDocument();
    });

    it("should call createBoard with correct data including default color", async () => {
        renderPage();
        fireEvent.click(screen.getByRole('button', { name: /\Додати дошку/i }));

        const input = screen.getByPlaceholderText(/Title/i);
        fireEvent.change(input, { target: { value: 'Нова дошка' } });

        const createButton = screen.getByRole('button', { name: /Створити/i });
        fireEvent.click(createButton);

        await waitFor(() => {
            expect(mockCreateBoard).toHaveBeenCalledWith('Нова дошка', '#6366f1');
        });
    });
});