import { vi, describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import Card from './Card';

vi.mock('lucide-react', () => ({
    Pencil: () => <div data-testid="pencil-icon" />,
    Trash2: () => <div data-testid="trash-icon" />,
}));

const mockProps = {
    title: "Test Card Task",
    cardId: 777,
    onDelete: vi.fn(),
    onEdit: vi.fn(),
};

describe('Card Component', () => {
    it('should render the card title', () => {
        render(<Card {...mockProps} />);
        expect(screen.getByText("Test Card Task")).toBeInTheDocument();
    });

    it('should call onEdit with correct id when edit button is clicked', () => {
        render(<Card {...mockProps} />);
        const editBtn = screen.getByRole('button', { name: /Edit card/i });
        fireEvent.click(editBtn);
        expect(mockProps.onEdit).toHaveBeenCalledWith(777);
    });

    it('should call onDelete with correct id when delete button is clicked', () => {
        render(<Card {...mockProps} />);
        const deleteBtn = screen.getByRole('button', { name: /Delete card/i });
        fireEvent.click(deleteBtn);
        expect(mockProps.onDelete).toHaveBeenCalledWith(777);
    });

    it('should stop event propagation when buttons are clicked', () => {
        const stopPropagationSpy = vi.spyOn(MouseEvent.prototype, 'stopPropagation');
        render(<Card {...mockProps} />);
        
        fireEvent.click(screen.getByRole('button', { name: /Edit card/i }));
        expect(stopPropagationSpy).toHaveBeenCalled();
        
        stopPropagationSpy.mockRestore();
    });
});