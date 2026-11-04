import { api }
from './api';

export async function
login(cpf: string, recaptchaToken: string) {

  const response =
    await api.post(
      '/auth/login',
      {
        cpf,
        recaptchaToken,
      }
    );

  return response.data;
}

export async function
register(
  cpf: string,
  nomeCompleto: string,
  recaptchaToken: string
) {

  const response =
    await api.post(
      '/auth/register',
      {
        cpf,
        nomeCompleto,
        recaptchaToken,
      }
    );

  return response.data;
}

export async function
checkCpf(
  cpf: string
) {

  const response =
    await api.post(
      '/auth/check-cpf',
      {
        cpf,
      }
    );

  return response.data;
}

export async function
loginAdmin(
  cpf: string,
  senha: string,
  recaptchaToken: string
) {

  const response =
    await api.post(
      '/auth/admin/login',
      {
        cpf,
        senha,
        recaptchaToken,
      }
    );

  return response.data;
}

export async function
getMe(token: string) {

  const response =
    await api.get(
      '/auth/me',
      {
        headers: {
          Authorization:
            `Bearer ${token}`,
        },
      }
    );

  return response.data;
}