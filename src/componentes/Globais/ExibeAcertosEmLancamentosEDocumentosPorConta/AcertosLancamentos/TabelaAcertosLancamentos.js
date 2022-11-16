import React, {useEffect, useMemo, useState} from "react";
import {Column} from "primereact/column";
import {DataTable} from "primereact/datatable";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCheckCircle} from "@fortawesome/free-solid-svg-icons";
import {
    ModalCheckNaoPermitidoConfererenciaDeLancamentos,
} from "../../../dres/PrestacaoDeContas/DetalhePrestacaoDeContas/ConferenciaDeLancamentos/Modais/ModalCheckNaoPermitidoConfererenciaDeLancamentos";
import {
    ModalJustificarNaoRealizacao
} from "../../../dres/PrestacaoDeContas/DetalhePrestacaoDeContas/ConferenciaDeLancamentos/Modais/ModalJustificarNaoRealizacao";
import {
    ModalJustificadaApagada
} from "../../../dres/PrestacaoDeContas/DetalhePrestacaoDeContas/ConferenciaDeLancamentos/Modais/ModalJustificadaApagada";
import {visoesService} from "../../../../services/visoes.service";

import '../scss/tagJustificativaLancamentos.scss';

const tagColors = {
    'JUSTIFICADO': '#086397',
    'JUSTIFICADO_PARCIALMENTE': '#C65D00',
    'REALIZADO': '#447801',
    'REALIZADO_JUSTIFICADO': 'yellow',
    'REALIZADO_PARCIALMENTE': '#198459',
    'REALIZADO_JUSTIFICADO_PARCIALMENTE': '#C65D00',
}

export const TabelaAcertosLancamentos = ({
                                             lancamentosAjustes,
                                             limparStatus,
                                             marcarComoRealizado,
                                             prestacaoDeContas,
                                             justificarNaoRealizacao,
                                             opcoesJustificativa,
                                             setExpandedRowsLancamentos,
                                             expandedRowsLancamentos,
                                             rowExpansionTemplateLancamentos,
                                             rowsPerPageAcertosLancamentos,
                                             dataTemplate,
                                             numeroDocumentoTemplate,
                                             valor_template,
                                             lancamentosSelecionados,
                                             status,
                                             selecionarTodosItensDosLancamentos,
                                             selecionarTodosItensDoLancamento,
                                             limparLancamentos,
                                             tituloModalCheckNaoPermitido,
                                             textoModalCheckNaoPermitido,
                                             showModalCheckNaoPermitido,
                                             setShowModalCheckNaoPermitido,
                                         }) => {


    const [showModalJustificarNaoRealizacao, setShowModalJustificarNaoRealizacao] = useState(false)
    const [showModalJustificadaApagada, setShowModalJustificadaApagada] = useState(false)
    const [isConfirmadoJustificado, setIsConfirmadoJustificado] = useState(false)
    const [textoConfirmadoJustificado, setTextoConfirmadoJustificado] = useState('')

    const [tipoAcao, setTipoAcao] = useState('')

    const tagJustificativa = (rowData) => {
        let status = '-'

        let statusId = rowData.analise_lancamento.status_realizacao

        if (statusId && statusId !== 'PENDENTE') {
            let nomeStatus = opcoesJustificativa.status_realizacao.find(justificativa => justificativa.id === statusId)

            status = nomeStatus?.nome ?? '-'
        }

        return (
            <div className="tag-justificativa"
                 style={{
                     backgroundColor: statusId ? tagColors[statusId] : 'none',
                     color: statusId === 'PENDENTE' ? '#000' : '#fff'
                 }}
            >
                {status}
            </div>
        )
    }

    useEffect(() => {
        console.log("lancamentosSelecionados: ", lancamentosSelecionados);
    }, [lancamentosSelecionados]);


    const montagemSelecionarBotaoStatusRealizado = () => {
        return (
            <>
                <button
                    className="float-right btn btn-link btn-montagem-selecionar"
                    onClick={() => limparLancamentos({rowData: null, categoria: null})}
                    style={{textDecoration: "underline", cursor: "pointer"}}
                >
                    <FontAwesomeIcon
                        style={{color: "white", fontSize: '15px', marginRight: "3px"}}
                        icon={faCheckCircle}
                    />
                    <strong>Cancelar</strong>
                </button>
                <div className="float-right" style={{padding: "0px 10px"}}>|</div>
                <button
                    className="float-right btn btn-link btn-montagem-selecionar"
                    onClick={() => {
                        setShowModalJustificarNaoRealizacao(true)
                    }}
                    style={{textDecoration: "underline", cursor: "pointer"}}
                >
                    <FontAwesomeIcon
                        style={{color: "white", fontSize: '15px', marginRight: "3px"}}
                        icon={faCheckCircle}
                    />
                    <strong>Justificar não realização</strong>
                </button>
                <div className="float-right" style={{padding: "0px 10px"}}>|</div>
                <button
                    className="float-right btn btn-link btn-montagem-selecionar"
                    onClick={() => limparStatus()}
                    style={{textDecoration: "underline", cursor: "pointer"}}
                >
                    <FontAwesomeIcon
                        style={{color: "white", fontSize: '15px', marginRight: "3px"}}
                        icon={faCheckCircle}
                    />
                    <strong>Limpar Status</strong>
                </button>
            </>
        )
    }

    const montagemSelecionarBotoaoStatusJustificado = () => {
        return (
            <>
                <button
                    className="float-right btn btn-link btn-montagem-selecionar"
                    onClick={() => limparLancamentos({rowData: null, categoria: null})}
                    style={{textDecoration: "underline", cursor: "pointer"}}
                >
                    <FontAwesomeIcon
                        style={{color: "white", fontSize: '15px', marginRight: "3px"}}
                        icon={faCheckCircle}
                    />
                    <strong>Cancelar</strong>
                </button>
                <div className="float-right" style={{padding: "0px 10px"}}>|</div>
                <button
                    className="float-right btn btn-link btn-montagem-selecionar"
                    onClick={() => verificaApagadaJustificada( 'marcar_como_realizado')}
                    style={{textDecoration: "underline", cursor: "pointer"}}
                >
                    <FontAwesomeIcon
                        style={{color: "white", fontSize: '15px', marginRight: "3px"}}
                        icon={faCheckCircle}
                    />
                    <strong>Marcar como realizado</strong>
                </button>
                <div className="float-right" style={{padding: "0px 10px"}}>|</div>
                <button
                    className="float-right btn btn-link btn-montagem-selecionar"
                    onClick={() => verificaApagadaJustificada( 'limpar_status')}
                    style={{textDecoration: "underline", cursor: "pointer"}}
                >
                    <FontAwesomeIcon
                        style={{color: "white", fontSize: '15px', marginRight: "3px"}}
                        icon={faCheckCircle}
                    />
                    <strong>Limpar Status</strong>
                </button>
            </>
        )
    }

    const montagemSelecionarBotoaoStatusPendente = () => {
        return (
            <>
                <button
                    className="float-right btn btn-link btn-montagem-selecionar"
                    onClick={() => limparLancamentos({rowData: null, categoria: null})}
                    style={{textDecoration: "underline", cursor: "pointer"}}
                >
                    <FontAwesomeIcon
                        style={{color: "white", fontSize: '15px', marginRight: "3px"}}
                        icon={faCheckCircle}
                    />
                    <strong>Cancelar</strong>
                </button>
                <div className="float-right" style={{padding: "0px 10px"}}>|</div>
                <button
                    className="float-right btn btn-link btn-montagem-selecionar"
                    onClick={() => marcarComoRealizado()}
                    style={{textDecoration: "underline", cursor: "pointer"}}
                >
                    <FontAwesomeIcon
                        style={{color: "white", fontSize: '15px', marginRight: "3px"}}
                        icon={faCheckCircle}
                    />
                    <strong>Marca como realizado</strong>
                </button>
                <div className="float-right" style={{padding: "0px 10px"}}>|</div>
                <button
                    className="float-right btn btn-link btn-montagem-selecionar"
                    onClick={() => setShowModalJustificarNaoRealizacao(true)}
                    style={{textDecoration: "underline", cursor: "pointer"}}
                >
                    <FontAwesomeIcon
                        style={{color: "white", fontSize: '15px', marginRight: "3px"}}
                        icon={faCheckCircle}
                    />
                    <strong>Justificar não realizado</strong>
                </button>
            </>
        )
    }

    const montagemSelecionar = () => {
        const quantidadeSelecionada = lancamentosSelecionados.length

        return (
            <div className="row">
                <div className="col-12" style={{background: "#00585E", color: 'white', padding: "15px", margin: "0px 15px", flex: "100%"}}>
                    <div className="row">
                        <div className="col-5">
                            {quantidadeSelecionada} {quantidadeSelecionada === 1 ? "lançamento selecionado" : "lançamentos selecionados"} / {totalDeAcertosLancamentos} totais
                        </div>
                        <div className="col-7">
                            {status === "REALIZADO" &&
                                montagemSelecionarBotaoStatusRealizado()
                            }
                            {status === "JUSTIFICADO" &&
                                montagemSelecionarBotoaoStatusJustificado()
                            }
                            {status === "PENDENTE" &&
                                montagemSelecionarBotoaoStatusPendente()
                            }
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    const modalBodyHTML = () => {
        return (
            <div className="modal-body">
                <p>Você confirma que deseja marcar o lançamento como não realizado? Em caso afirmativo será necessário adicionar uma justificativa para tal evento.</p>
                <div className="form-check form-check-inline">
                    <input
                        className="form-check-input"
                        type="radio"
                        name="confirmacao-justificativa"
                        id="confirmacao-justificativa1"
                        onChange={() => {
                            setIsConfirmadoJustificado(true)
                        }}
                    />
                    <label className="form-check-label" htmlFor="confirmacao-justificativa1">Sim</label>
                </div>
                <div className="form-check form-check-inline">
                    <input
                        className="form-check-input"
                        type="radio"
                        name="confirmacao-justificativa"
                        id="confirmacao-justificativa2"
                        onChange={() => {
                            setIsConfirmadoJustificado(false);
                        }}
                        defaultChecked
                    />
                    <label className="form-check-label" htmlFor="confirmacao-justificativa2">Não</label>
                </div>
                {isConfirmadoJustificado &&
                    (
                        <form>
                            <label htmlFor="justifique-textarea">Justifique</label>
                            <textarea
                                className="form-check form-check-inline w-100 pl-1"
                                style={{'resize': 'none'}}
                                onChange={(e) => setTextoConfirmadoJustificado(e.target.value)}
                                id="justifique-textarea"
                                value={textoConfirmadoJustificado} rows="7"
                            >
                            </textarea>
                        </form>
                    )
                }
            </div>
        )
    }

    const totalDeAcertosLancamentos = useMemo(() => lancamentosAjustes.length, [lancamentosAjustes]);

    const mensagemQuantidadeExibida = () => {
        return (
            <div className="row">
                <div className="col-12" style={{padding: "15px 0px", margin: "0px 15px", flex: "100%"}}>
                    Exibindo <span style={{color: "#00585E", fontWeight: "bold"}}>{totalDeAcertosLancamentos}</span> lançamentos
                </div>
            </div>
        )
    }

    // Dispara modal de Confirmação
    const verificaApagadaJustificada = (tipoAcao) => {
        setShowModalJustificadaApagada(true)
        setTipoAcao(tipoAcao)
    }

    return (
        <>
            {lancamentosSelecionados.length > 0 ?
                montagemSelecionar() :
                mensagemQuantidadeExibida()
            }
            {lancamentosAjustes && lancamentosAjustes.length > 0 ? (
                    <DataTable
                        value={lancamentosAjustes}
                        expandedRows={expandedRowsLancamentos}
                        onRowToggle={(e) => setExpandedRowsLancamentos(e.data)}
                        rowExpansionTemplate={rowExpansionTemplateLancamentos}
                        paginator={lancamentosAjustes.length > rowsPerPageAcertosLancamentos}
                        rows={rowsPerPageAcertosLancamentos}
                        paginatorTemplate="PrevPageLink PageLinks NextPageLink"
                        stripedRows
                        autoLayout={true}
                        id='tabela-acertos-lancamentos'
                    >
                        <Column
                            header='Ver Acertos'
                            expander
                            style={{width: '6%'}}/>
                        <Column
                            field='data'
                            header='Data'
                            body={dataTemplate}
                            className="align-middle text-left borda-coluna"
                            style={{width: '6%'}}
                        />
                        <Column field='tipo_transacao' header='Tipo de lançamento' style={{width: '10%'}}
                                className="align-middle text-left borda-coluna"/>
                        <Column
                            field='numero_documento'
                            header='N.º do documento'
                            body={numeroDocumentoTemplate}
                            className="align-middle text-left borda-coluna"
                            style={{width: '12%'}}
                        />
                        <Column field='descricao' header='Descrição' style={{width: '40%'}}
                                className="align-middle text-left borda-coluna"/>
                        <Column
                            field='valor_transacao_total'
                            header='Valor (R$)'
                            body={valor_template}
                            className="align-middle text-left borda-coluna"
                            style={{width: '8%'}}
                        />
                        <Column
                            field='status_realizacao'
                            header='Status'
                            className="align-middle text-left borda-coluna"
                            body={tagJustificativa}
                            style={{width: '10%'}}/>
                        {visoesService.getItemUsuarioLogado('visao_selecionada.nome') === 'UE' && visoesService.getPermissoes(["change_analise_dre"]) && prestacaoDeContas.status === "DEVOLVIDA" ?
                            <Column
                                header={selecionarTodosItensDosLancamentos()}
                                body={selecionarTodosItensDoLancamento}
                                style={{width: '4%', borderLeft: 'none'}}
                            /> : null
                        }
                    </DataTable>
                ) :
                <p className='text-center fonte-18 mt-4'><strong>Não existem acertos para serem exibidos</strong></p>
            }
            <section>
                <ModalCheckNaoPermitidoConfererenciaDeLancamentos
                    show={showModalCheckNaoPermitido}
                    handleClose={() => setShowModalCheckNaoPermitido(false)}
                    titulo={tituloModalCheckNaoPermitido}
                    texto={textoModalCheckNaoPermitido}
                    primeiroBotaoTexto="Fechar"
                    primeiroBotaoCss="success"
                />
            </section>
            <section>
                <ModalJustificarNaoRealizacao
                    show={showModalJustificarNaoRealizacao}
                    titulo='Marcar como não realizado'
                    bodyText={modalBodyHTML()}
                    primeiroBotaoTexto="Fechar"
                    primeiroBotaoCss="danger"
                    primeiroBotaoOnClick={() => setShowModalJustificarNaoRealizacao(false)}
                    segundoBotaoTexto="Confirmar"
                    segundoBotaoCss="success"
                    segundoBotaoOnclick={() => {
                        justificarNaoRealizacao(textoConfirmadoJustificado)
                    }}
                    segundoBotaoDisable={(textoConfirmadoJustificado.length === 0 && isConfirmadoJustificado) || !isConfirmadoJustificado}
                />
            </section>
            <section>
                <ModalJustificadaApagada
                    show={showModalJustificadaApagada}
                    titulo='Apagar justificativa(s)'
                    texto={'Atenção. Essa ação irá apagar as justificativas digitadas. Confirma ação?'}
                    primeiroBotaoTexto="Confirmar"
                    primeiroBotaoCss="success"
                    primeiroBotaoOnclick={() => tipoAcao === 'limpar_status' ? limparStatus() : marcarComoRealizado()}
                    segundoBotaoTexto="Cancelar"
                    segundoBotaoCss="danger"
                    handleClose={() => setShowModalJustificadaApagada(false)}
                />
            </section>
        </>
    )
}