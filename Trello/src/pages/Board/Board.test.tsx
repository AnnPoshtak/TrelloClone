import { vi, describe, it, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Board from './Board.tsx';

// 1. Mocking hooks
vi.mock('@/hooks/useBoard/useBoard.tsx', () => ({
    useBoard: vi.fn()
}));
vi.mock('@/hooks/useList/useList.tsx', () => ({
    useList: vi.fn()
}));
vi.mock('@/hooks/useCard/useCard.tsx', () => ({
    useCard: vi.fn()
}));

import { useBoard } from '@/hooks/useBoard/useBoard.tsx';
import { useList } from '@/hooks/useList/useList.tsx';
import { useCard } from '@/hooks/useCard/useCard.tsx';

const mockBoardData = {
    id: 1,
    title: "My Test Board",
};

const mockLists = [
    { id: 1, title: "To Do", cards: [{ id: 1, title: "Test Card" }] }
];

describe('Board Component', () => {
    const defaultHooksValues = {
        board: mockBoardData,
        lists: mockLists,
        isLoading: false,
        isError: false,
        handleBoardDelete: vi.fn(),
        handleEditBoard: vi.fn(),
        handleCreateList: vi.fn(),
        handleListDelete: vi.fn(),
        handleEditList: vi.fn(),
        handleCreateCard: vi.fn(),
        handleCardDelete: vi.fn(),
        handleEditCard: vi.fn(),
        handleCardMove: vi.fn(),
    };

    beforeEach(() => {
        vi.clearAllMocks();
        (useBoard as any).mockReturnValue(defaultHooksValues);
        (useList as any).mockReturnValue(defaultHooksValues);
        (useCard as any).mockReturnValue(defaultHooksValues);
    });

    const renderBoard = () => render(
        <MemoryRouter>
            <Board />
        </MemoryRouter>
    );

    it('should match the snapshot', () => {
        const { asFragment } = renderBoard();
        expect(asFragment()).toMatchSnapshot();
    });

    it('should display the loader when loading', () => {
        (useBoard as any).mockReturnValue({ ...defaultHooksValues, isLoading: true });
        renderBoard();
        expect(screen.getByText(/Loading.../i)).toBeInTheDocument();
    });

    it('should display an error message if loading fails', () => {
        (useBoard as any).mockReturnValue({ ...defaultHooksValues, isError: true });
        renderBoard();
        expect(screen.getByText(/Error loading board/i)).toBeInTheDocument();
    });

    it('should render the board title and lists', () => {
        renderBoard();
        expect(screen.getByText("My Test Board")).toBeInTheDocument();
        expect(screen.getByText("To Do")).toBeInTheDocument();
        expect(screen.getByText("Test Card")).toBeInTheDocument();
    });

    it('should open the "Create List" modal when the button is clicked', async () => {
        renderBoard();
        const btn = screen.getByRole('button', { name: /\+ Список/i });
        fireEvent.click(btn);
        expect(screen.getByText('Новий список')).toBeInTheDocument();
    });

    it('should open the "Create Card" modal when the button is clicked', async () => {
        renderBoard();
        const btn = screen.getByRole('button', { name: /\+ Картка/i });
        fireEvent.click(btn);
        expect(screen.getByText('Нова картка')).toBeInTheDocument();
    });

    it('should open the "Edit Board" modal when the button is clicked', async () => {
        renderBoard();
        const btn = screen.getByRole('button', { name: /\Редагувати/i });
        fireEvent.click(btn);
        expect(screen.getByText('Редагувати дошку')).toBeInTheDocument();
    });

    it('should open the "Edit List" modal when the button is clicked', async () => {
        renderBoard();
        const btn = screen.getByRole('button', { name: /\Edit list/i });
        fireEvent.click(btn);
        expect(screen.getByText('Редагувати список')).toBeInTheDocument();
    });

    it('should open the "Edit Card" modal when the button is clicked', async () => {
        renderBoard();
        const btn = screen.getByRole('button', { name: /\Edit card/i });
        fireEvent.click(btn);
        expect(screen.getByText('Редагувати картку')).toBeInTheDocument();
    });

    it('should call handleBoardDelete when the delete button is clicked', () => {
        const deleteSpy = vi.fn();
        (useBoard as any).mockReturnValue({ ...defaultHooksValues, handleBoardDelete: deleteSpy });
        renderBoard();

        const deleteBtn = screen.getByText('Видалити');
        fireEvent.click(deleteBtn);

        expect(deleteSpy).toHaveBeenCalledTimes(1);
    });

    it('should call handleListDelete when the delete button is clicked', () => {
        const deleteSpy = vi.fn();
        (useList as any).mockReturnValue({ ...defaultHooksValues, handleListDelete: deleteSpy });
        renderBoard();

        const deleteBtn = screen.getByRole('button', { name: /\Delete list/i });
        fireEvent.click(deleteBtn);

        expect(deleteSpy).toHaveBeenCalledTimes(1);
    });

    it('should call handleCardDelete when the delete button is clicked', () => {
        const deleteSpy = vi.fn();
        (useCard as any).mockReturnValue({ ...defaultHooksValues, handleCardDelete: deleteSpy });
        renderBoard();

        const deleteBtn = screen.getByRole('button', { name: /\Delete card/i });
        fireEvent.click(deleteBtn);

        expect(deleteSpy).toHaveBeenCalledTimes(1);
    });

    it('should correctly display the back button to the boards list', () => {
        renderBoard();
        const link = screen.getByRole('link', { name: /← Дошки/i });
        expect(link).toHaveAttribute('href', '/');
    });
});