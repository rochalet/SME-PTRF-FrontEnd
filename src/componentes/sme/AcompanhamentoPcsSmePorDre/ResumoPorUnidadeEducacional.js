import React, {useState, useEffect} from "react";
import useDataTemplate from "../../../hooks/Globais/useDataTemplate";
import {MsgImgLadoDireito} from "../../Globais/Mensagens/MsgImgLadoDireito";
import Img404 from "../../../assets/img/img-404.svg";
import {DataTable} from 'primereact/datatable';
import {visoesService} from "../../../services/visoes.service";
import {mantemEstadoAcompanhamentoDePcUnidade as meapcservice} from "../../../services/mantemEstadoAcompanhamentoDePcUnidadeEducacional.service";
import Loading from "../../../utils/Loading";

import {Column} from 'primereact/column';

export const ResumoPorUnidadeEducacional = ({unidadesEducacionais, loadingDataTable, dreUuid, setPaginaAtual, paginaAtual}) => {
    const dataTemplate = useDataTemplate()
    const rowsPerPage = 10

    const style = {
        fontFamily: 'Roboto',
        fontSize: '14px',
        fontWeight: '700',
        lineHeight: '20px',
        letterSpacing: '0em',
        width: '23%',
        textAlign: 'left',
        color: '#42474A'
    };

    const commonStyles = {
        fontFamily: 'Roboto',
        fontStyle: 'normal',
        fontWeight: '700',
        fontSize: '14px',
        lineHeight: '16px',
        display: 'flex',
        alignItems: 'center',
        letterSpacing: '0.01em'
    };

    const onPaginationClick = (event) => {
        setPaginaAtual(event.first);
        meapcservice.setAcompanhamentoPcUnidadePorUsuario(visoesService.getUsuarioLogin(), {[dreUuid]: {paginacao_atual: event.first}})
    }

    const getStyles = (color) => ({
        ... commonStyles,
        color
    });

    const stylesStatus = (rowData) => {
        if (rowData) {
            if (rowData.status === 'NAO_RECEBIDA' || rowData.status === 'NAO_APRESENTADA') {
                return getStyles('#B40C02');
            } else if (["APROVADA", "APROVADA_RESSALVA", "RECEBIDA"].includes(rowData.status)) {
                return getStyles('#297805');
            } else if (["EM_ANALISE", "DEVOLVIDA", "DEVOLVIDA_RETORNADA", "DEVOLVIDA_RECEBIDA"].includes(rowData.status)) {
                return getStyles('#F9A825');
            }
        }
    }

    const alteraColorETexto = (rowData) => {

        if (rowData === 'NAO_RECEBIDA') {
            return 'Não recebida'
        } else if (rowData === 'RECEBIDA') {
            return 'Recebida'
        } else if (rowData === 'DEVOLVIDA') {
            return 'Devolvida para acerto'
        } else if (rowData === 'EM_ANALISE') {
            return 'Em análise'
        } else if (rowData === 'APROVADA') {
            return 'Aprovada'
        } else if (rowData === 'APROVADA_RESSALVA') {
            return 'Aprovada com ressalva'
        } else if (rowData === 'REPROVADA') {
            return 'Reprovada'
        } else if (rowData === 'NAO_APRESENTADA') {
            return 'Não apresentada'
        } else if (rowData === 'DEVOLVIDA_RETORNADA') {
            return 'Apresentada após acertos'
        } else {
            return '-'
        }
    }

    const codigoEOLTemplate = (rowData) => {
        return rowData.unidade_eol ? rowData.unidade_eol : '-'
    }

    const nomeDaUnidadeTemplate = (rowData) => {
        return rowData?.unidade_nome ? rowData.unidade_tipo_unidade + " " + rowData.unidade_nome : '-'
    }

    const processoSeiTemplate = (rowData) => {
        return rowData?.processo_sei ? rowData.processo_sei : '-'
    }

    const dataDeRecebimentoTemplate = (rowData) => {
        return rowData?.data_recebimento ? dataTemplate(null, null, rowData.data_recebimento) : '-'
    }

    const ultimaAnaliseTemplate = (rowData) => {
        return rowData?.data_ultima_analise ? dataTemplate(null, null, rowData.data_ultima_analise) : '-'
    }

    const tecnicoResponsavelTemplate = (rowData) => {
        return rowData?.tecnico_responsavel ? rowData.tecnico_responsavel : '-'
    }

    const devolucaoTesouroTemplate = (rowData) => {
        return rowData?.devolucao_ao_tesouro ? rowData.devolucao_ao_tesouro : '-'
    }

    const statusTemplate = (rowData) => {
        return <span style={
            stylesStatus(rowData)
        }>
            {
            alteraColorETexto(rowData ?. status)
        }</span>
    }

    return (
        <> {
            loadingDataTable ? (
                <Loading corGrafico="black" corFonte="dark" marginTop="0" marginBottom="0"/>
            ) : <> {
                    unidadesEducacionais.length ? 
                    <DataTable value={unidadesEducacionais}
                        className="mt-3 datatable-footer-coad"
                        paginator={true}
                        rows={rowsPerPage}
                        paginatorTemplate="PrevPageLink PageLinks NextPageLink"
                        first={paginaAtual}
                        onPage={onPaginationClick}
                        >
                        <Column field='' header='Código EOL'
                            style={{width: '7%'}}
                            body={codigoEOLTemplate}/>
                        <Column field='' header='Nome da unidade'
                            style={style}
                            body={nomeDaUnidadeTemplate}/>
                        <Column field='' header='Processo SEI'
                            body={processoSeiTemplate}/> 
                        <Column field='' header='Data de recebimento'
                            body={dataDeRecebimentoTemplate}/>
                        <Column field='' header='Última análise'
                            body={ultimaAnaliseTemplate}/>
                        <Column field='' header='Técnico responsável'
                            body={tecnicoResponsavelTemplate}/>
                        <Column field='' header='Devolução ao tesouro'
                            body={devolucaoTesouroTemplate}/>
                        <Column field='status' header='Status'
                            body={statusTemplate}/>
                    </DataTable> : <MsgImgLadoDireito texto='Nenhuma prestação retornada. Tente novamente com outros filtros'
                        img={Img404}/>
                } </>
        } </>
    )
}
