import api from '../api'
import { TOKEN_ALIAS } from '../auth.service.js';
import {ASSOCIACAO_UUID} from "../auth.service";

const authHeader = {
    headers: {
        'Authorization': `JWT ${localStorage.getItem(TOKEN_ALIAS)}`,
        'Content-Type': 'application/json'
    }
};

export const getPrestacoesDeContas = async (periodo_uuid="",  nome="", associacao__unidade__tipo_unidade='', status="", tecnico_uuid="") => {
    return (await api.get(`/api/prestacoes-contas/?associacao__unidade__dre__uuid=${localStorage.getItem(ASSOCIACAO_UUID)}&periodo__uuid=${periodo_uuid}&nome=${nome}&associacao__unidade__tipo_unidade=${associacao__unidade__tipo_unidade}&status=${status}&tecnico=${tecnico_uuid}`, authHeader)).data
};

export const getQtdeUnidadesDre = async () => {
    return (await api.get(`/api/dres/${localStorage.getItem(ASSOCIACAO_UUID)}/qtd-unidades/`, authHeader)).data
};