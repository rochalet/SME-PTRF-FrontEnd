import api from '../api'
import {TOKEN_ALIAS} from '../auth.service.js';
import {ASSOCIACAO_UUID} from "../auth.service";

const authHeader = {
    headers: {
        'Authorization': `JWT ${localStorage.getItem(TOKEN_ALIAS)}`,
        'Content-Type': 'application/json'
    }
};

export const getAssociacao = async () => {
    return (await api.get(`api/associacoes/${localStorage.getItem(ASSOCIACAO_UUID)}`, authHeader)).data
};

export const alterarAssociacao = async (payload) => {
    return api.put(`api/associacoes/${localStorage.getItem(ASSOCIACAO_UUID)}/`, payload, authHeader).then(response => {
        return response;
    }).catch(error => {
        return error.response;
    });
};

export const getPeriodoFechado = async (data_verificacao) => {
    return (await api.get(`/api/associacoes/${localStorage.getItem(ASSOCIACAO_UUID)}/status-periodo/?data=${data_verificacao}`, authHeader)).data
};

export const getMembrosAssociacao = async () => {
    return (await api.get(`/api/membros-associacao/?associacao_uuid=${localStorage.getItem(ASSOCIACAO_UUID)}`, authHeader)).data
};

export const criarMembroAssociacao = async (payload) => {
    return (await api.post(`api/membros-associacao/`, payload, authHeader))
};

export const editarMembroAssociacao = async (payload, uuid) => {
    return (await api.put(`/api/membros-associacao/${uuid}/?associacao_uuid=${localStorage.getItem(ASSOCIACAO_UUID)}`, payload, authHeader))
};

export const consultarRF = async (rf) => {
    return (await api.get(`/api/membros-associacao/codigo-identificacao/?rf=${rf}`, authHeader))
};

export const consultarCodEol = async (cod_eol) => {
    return (await api.get(`/api/membros-associacao/codigo-identificacao/?codigo-eol=${cod_eol}`, authHeader))
};

export const getContas = async () => {
    return (await api.get(`/api/associacoes/${localStorage.getItem(ASSOCIACAO_UUID)}/contas/`, authHeader)).data
};

export const salvarContas = async (payload) => {
    return (await api.post(`/api/associacoes/${localStorage.getItem(ASSOCIACAO_UUID)}/contas-update/`, payload, authHeader))
};

export const exportarDadosAssociacao = async () => {
    return api
            .get(`/api/associacoes/${localStorage.getItem(ASSOCIACAO_UUID)}/exportar`, {
                responseType: 'blob',
                timeout: 30000,
              })
            .then((response) => {
                const url = window.URL.createObjectURL(new Blob([response.data]));
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('download', 'associacao.xlsx');
                document.body.appendChild(link);
                link.click();
            }).catch(error => {
                return error.response;
            });
}

export const getPeriodosDePrestacaoDeContasDaAssociacao = async () => {
    return (await api.get(`/api/associacoes/${localStorage.getItem(ASSOCIACAO_UUID)}/periodos-para-prestacao-de-contas/`, authHeader)).data
};