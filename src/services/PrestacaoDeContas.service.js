import api from "./Api";
import {TOKEN_ALIAS} from "./auth.service";

const authHeader = {
    headers: {
        'Authorization': `JWT ${localStorage.getItem(TOKEN_ALIAS)}`,
        'Content-Type': 'application/json'
    }
}


export const getPeriodos = async () => {
    return (await api.get(`/api/periodos/lookup/`, authHeader)).data
}

export const getStatus = async (periodo_uuid, conta_uuid) => {
    return (await api.get(`/api/prestacoes-contas/por-conta-e-periodo/?conta_associacao_uuid=${conta_uuid}&periodo_uuid=${periodo_uuid}`, authHeader)).data
}