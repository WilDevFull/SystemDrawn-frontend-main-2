import { api }
from './api';

export async function
listarNotificacoes(
token: string
) {

const response =
await api.get(
'/notificacoes',
{
headers: {
Authorization:
`Bearer ${token}`,
},
}
);

return response.data.data;
}

export async function
contarNotificacoesNaoLidas(
token: string
) {

const response =
await api.get(
'/notificacoes/contador',
{
headers: {
Authorization:
`Bearer ${token}`,
},
}
);

return response.data.total;
}

export async function
marcarComoLida(
id: string,
token: string
) {

const response =
await api.patch(
`/notificacoes/${id}/lida`,
{},
{
headers: {
Authorization:
`Bearer ${token}`,
},
}
);

return response.data;
}

export async function
marcarTodasComoLidas(
token: string
) {

const response =
await api.patch(
'/notificacoes/todas/lidas',
{},
{
headers: {
Authorization:
`Bearer ${token}`,
},
}
);

return response.data;
}

export async function
removerNotificacao(
id: string,
token: string
) {

const response =
await api.delete(
`/notificacoes/${id}`,
{
headers: {
Authorization:
`Bearer ${token}`,
},
}
);

return response.data;
}