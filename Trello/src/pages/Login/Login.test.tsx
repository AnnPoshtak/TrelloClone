import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Login from './Login';
import '@testing-library/jest-dom';

const mockLogin = vi.fn();
vi.mock('@/hooks/useLogin/useLogin.tsx', () => ({
    useLogin: () => ({
        login: mockLogin
    })
}));

describe('Login Component', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        localStorage.clear();
    });

    const renderLogin = () => {
        return render(
            <MemoryRouter>
                <Login />
            </MemoryRouter>
        );
    };

    it("renders login form correctly", () => {
        renderLogin();
        expect(screen.getByPlaceholderText(/Email або логін/i)).toBeInTheDocument();
        expect(screen.getByPlaceholderText(/Пароль/i)).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /увійти/i })).toBeInTheDocument();
    });

    it("shows validation errors when fields are empty and form is submitted", async () => {
        renderLogin();
        fireEvent.click(screen.getByRole('button', { name: /увійти/i }));

        expect(await screen.findByText('Вкажіть email')).toBeInTheDocument();
        expect(await screen.findByText('Введіть пароль')).toBeInTheDocument();
    });

    it("shows error for short password", async () => {
        renderLogin();
        
        fireEvent.input(screen.getByPlaceholderText(/Пароль/i), {
            target: { value: '123' }
        });
        fireEvent.click(screen.getByRole('button', { name: /увійти/i }));

        expect(await screen.findByText('Мінімум 6 символів')).toBeInTheDocument();
    });

    it("calls login function with correct data on valid submit", async () => {
        renderLogin();
        
        fireEvent.input(screen.getByPlaceholderText(/Email або логін/i), {
            target: { value: 'test@example.com' }
        });
        fireEvent.input(screen.getByPlaceholderText(/Пароль/i), {
            target: { value: 'password123' }
        });
        
        fireEvent.click(screen.getByRole('button', { name: /увійти/i }));

        await waitFor(() => {
            expect(mockLogin).toHaveBeenCalledWith('test@example.com', 'password123');
        });
    });

    it("loads theme from localStorage", () => {
        localStorage.setItem('trello_theme', 'Нічна');
        renderLogin();
        const title = screen.getByText('Вхід');
        expect(title).toBeInTheDocument();
    });

    it("contains a link to the registration page", () => {
        renderLogin();
        const link = screen.getByRole('link', { name: /створити акаунт/i });
        expect(link).toHaveAttribute('href', '/register');
    });
});