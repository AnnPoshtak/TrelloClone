import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import BoardComponent from './BoardComponent';
import '@testing-library/jest-dom';
import type { IBoard } from '@/common/interfaces/IBoard';

const mockBoardWithCustomBg: IBoard = {
    id: 123,
    title: 'Моя тестова дошка',
    custom: {
        background: '#ff5500'
    }
};

const mockBoardDefault: IBoard = {
    id: 456,
    title: 'Дефолтна дошка',
    custom: {}
};

describe('BoardComponent', () => {
    const renderBoard = (board: IBoard) => {
        return render(
            <MemoryRouter>
                <BoardComponent 
                    board={board} 
                    title={board.title} 
                    custom={board.custom} 
                />
            </MemoryRouter>
        );
    };

    it("renders with correct title text", () => {
        renderBoard(mockBoardWithCustomBg);
        expect(screen.getByText('Моя тестова дошка')).toBeInTheDocument();
    });

    it("applies custom background color from props", () => {
        renderBoard(mockBoardWithCustomBg);
        const boardDiv = screen.getByText('Моя тестова дошка');
        expect(boardDiv).toHaveStyle({ backgroundColor: '#ff5500' });
    });

    it("applies default background color when custom background is missing", () => {
        renderBoard(mockBoardDefault);
        const boardDiv = screen.getByText('Дефолтна дошка');
        expect(boardDiv).toHaveStyle({ backgroundColor: '#6366f1' });
    });

    it("contains a link with the correct board ID in URL", () => {
        renderBoard(mockBoardWithCustomBg);
        const linkElement = screen.getByRole('link');
        expect(linkElement).toHaveAttribute('href', '/board/123');
    });

    it("has required Tailwind CSS classes for styling and transitions", () => {
        renderBoard(mockBoardWithCustomBg);
        const boardDiv = screen.getByText('Моя тестова дошка');
        expect(boardDiv).toHaveClass('w-[200px]', 'h-[100px]', 'rounded-lg', 'transition-all');
    });

    it("handles very long titles without crashing", () => {
        const longTitle = 'A'.repeat(100);
        const longBoard = { ...mockBoardWithCustomBg, title: longTitle };
        renderBoard(longBoard);
        expect(screen.getByText(longTitle)).toBeInTheDocument();
    });

    it("renders link as a block element with no underline", () => {
        renderBoard(mockBoardWithCustomBg);
        const linkElement = screen.getByRole('link');
        expect(linkElement).toHaveClass('no-underline', 'block');
    });
});