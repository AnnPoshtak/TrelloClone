import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Register from './Register';
import '@testing-library/jest-dom';

const mockRegisterUser = vi.fn();
vi.mock('@/hooks/useRegister/useRegister', () => ({
    useRegister: () => ({
        Register: mockRegisterUser
    })
}));

describe('Register Component', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        localStorage.clear();
    });

    const renderRegister = () => {
        return render(
            <MemoryRouter>
                <Register />
            </MemoryRouter>
        );
    };

    it("renders registration form fields", () => {
        renderRegister();
        expect(screen.getByPlaceholderText('Email')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('Пароль')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('Повторіть пароль')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /зареєструватися/i })).toBeInTheDocument();
    });

    it("shows error when passwords do not match", async () => {
        renderRegister();

        fireEvent.input(screen.getByPlaceholderText('Пароль'), {
            target: { value: 'password123' }
        });
        fireEvent.input(screen.getByPlaceholderText('Повторіть пароль'), {
            target: { value: 'different-password' }
        });

        fireEvent.click(screen.getByRole('button', { name: /зареєструватися/i }));

        expect(await screen.findByText('Паролі не співпадають')).toBeInTheDocument();
    });

    it("calls registerUser with correct data on successful validation", async () => {
        renderRegister();

        fireEvent.input(screen.getByPlaceholderText('Email'), {
            target: { value: 'newuser@example.com' }
        });
        fireEvent.input(screen.getByPlaceholderText('Пароль'), {
            target: { value: 'secret123' }
        });
        fireEvent.input(screen.getByPlaceholderText('Повторіть пароль'), {
            target: { value: 'secret123' }
        });

        fireEvent.click(screen.getByRole('button', { name: /зареєструватися/i }));

        await waitFor(() => {
            expect(mockRegisterUser).toHaveBeenCalledWith(
                'newuser@example.com',
                'secret123',
                'secret123'
            );
        });
    });

    it("has a link to login page", () => {
        renderRegister();
        const link = screen.getByRole('link', { name: /вже є акаунт/i });
        expect(link).toHaveAttribute('href', '/login');
    });
});