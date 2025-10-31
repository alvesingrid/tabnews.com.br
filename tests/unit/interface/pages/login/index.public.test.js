import { render, waitFor } from '@testing-library/react';
import { vi } from 'vitest';

const mocks = vi.hoisted(() => ({
  replaceSpy: vi.fn(),
  createErrorMessage: vi.fn(),
  useUser: vi.fn(),
}));

// === Mocks globais ===
vi.mock('next/router', () => ({
  useRouter: () => ({
    isReady: mocks.isReady,
    query: { redirect: mocks.redirect },
    replace: mocks.replaceSpy,
  }),
}));

vi.mock('pages/interface', () => ({
  useUser: () => mocks.useUser(),
  createErrorMessage: mocks.createErrorMessage,
}));

vi.mock('@tabnews/helpers', () => ({
  tryParseUrl: (redirect) => {
    try {
      if (redirect?.startsWith('/')) {
        return new URL(redirect, 'http://tabnews.local');
      }
      return new URL(redirect);
    } catch {
      return { origin: '', pathname: '/' };
    }
  },
}));

// === Importação dinâmica após mocks ===
let Login;

describe('pages/login/index.public', () => {
  const defaultRouter = {
    isReady: true,
    redirect: '/perfil',
  };

  beforeAll(async () => {
    // Define window.location padrão
    Object.defineProperty(window, 'location', {
      value: new URL('http://tabnews.local'),
      writable: false,
    });

    // Importa componente após configurar mocks
    Login = (await import('pages/login/index.public')).default;
  });

  beforeEach(() => {
    vi.clearAllMocks();
    mocks.isReady = defaultRouter.isReady;
    mocks.redirect = defaultRouter.redirect;
    mocks.useUser.mockReturnValue({ user: { id: 'user123' } });
  });

  // ========================
  // CT1 – Router não está pronto (C1=V, C2=F)
  // ========================
  it('CT1 - retorna quando router não está pronto', async () => {
    mocks.isReady = false;
    mocks.useUser.mockReturnValue({ user: { id: 'user123' } });

    render(<Login />);

    await waitFor(() => {
      expect(mocks.replaceSpy).not.toHaveBeenCalled();
    });
  });

  // ========================
  // CT2 – Usuário não autenticado (C1=F, C2=V)
  // ========================
  it('CT2 - retorna quando usuário não está autenticado', async () => {
    mocks.isReady = true;
    mocks.useUser.mockReturnValue({ user: null });

    render(<Login />);

    await waitFor(() => {
      expect(mocks.replaceSpy).not.toHaveBeenCalled();
    });
  });

  // ========================
  // CT3 – Router pronto e usuário autenticado (C1=F, C2=F)
  // ========================
  it('CT3 - executa redirecionamento quando router pronto e user logado', async () => {
    mocks.isReady = true;
    mocks.useUser.mockReturnValue({ user: { id: 'user123' } });

    render(<Login />);

    await waitFor(() => {
      expect(mocks.replaceSpy).toHaveBeenCalled();
    });
  });

  // ========================
  // CT4 – Redirecionamento interno (C3=V)
  // ========================
  it('CT4 - redireciona para URL interna', async () => {
    mocks.redirect = '/meu-perfil';
    mocks.useUser.mockReturnValue({ user: { id: 'user123' } });

    render(<Login />);

    await waitFor(() => {
      expect(mocks.replaceSpy).toHaveBeenCalledWith('/meu-perfil');
    });
  });

  // ========================
  // CT5 – Redirecionamento externo (C3=F)
  // ========================
  it('CT5 - redireciona para "/" quando origem é externa', async () => {
    mocks.redirect = 'https://externo.com/login';
    mocks.useUser.mockReturnValue({ user: { id: 'user123' } });

    render(<Login />);

    await waitFor(() => {
      expect(mocks.replaceSpy).toHaveBeenCalledWith('/');
    });
  });
});
