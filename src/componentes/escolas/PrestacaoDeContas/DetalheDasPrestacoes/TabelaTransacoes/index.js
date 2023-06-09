import React, {memo, useState} from "react";
import {useHistory} from 'react-router-dom';
import {DataTable} from "primereact/datatable";
import {Column} from "primereact/column";
import moment from "moment";
import IconeNaoDemonstrado from "../../../../../assets/img/icone-nao-demonstrado.svg";
import ReactTooltip from "react-tooltip";
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faInfoCircle} from '@fortawesome/free-solid-svg-icons'
import bookmarkRegular from "../../../../../assets/img/bookmark-regular.svg"
import bookmarkSolid from "../../../../../assets/img/bookmark-solid.svg"

import {RedirectModalTabelaLancamentos} from "../../../../../utils/Modais";

const TabelaTransacoes = ({
                              transacoes,
                              checkboxTransacoes,
                              handleChangeCheckboxTransacoes,
                              periodoFechado,
                              tabelasDespesa
                          }) => {

    let history = useHistory();
    const rowsPerPage = 10;

    const [expandedRows, setExpandedRows] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [urlRedirect, setUrlRedirect] = useState('');
    const [uuid, setUuid] = useState('');

    const onShowModal = () => {
        setShowModal(true);
    };

    const onHandleClose = () => {
        setShowModal(false);
    };

    const onCancelarTrue = () => {
        setShowModal(false);
        const url = urlRedirect + uuid + '/tabela-de-lancamentos-despesas';
        history.push(url);
    };

    const redirecionaDetalhe = value => {
        setUuid(value.documento_mestre.uuid);
        let url;
        if (value.tipo_transacao === 'Crédito') {
            url = '/edicao-de-receita/'
        } else {
            url = '/edicao-de-despesa/'
        }
        setUrlRedirect(url)
        onShowModal();
    };

    const dataTip = (notificar_dias_nao_conferido) => {
        let meses = Math.trunc(notificar_dias_nao_conferido / 30);
        let msg = (notificar_dias_nao_conferido <= 59) ? `1 mês.` : `${meses} meses.`;

        return `Não demonstrado por ${msg}`;
    };

    const notificarNaoConciliado = (notificarDiasNaoConferido) => {
        return notificarDiasNaoConferido > 0 ? {color: 'red', fontWeight: 'bold'} : {color: 'black'}
    };

    const dataTemplate = (rowData = null, column = null, data = null) => {
        let data_para_verificar;
        if (data) {
            data_para_verificar = data
        } else {
            data_para_verificar = rowData.documento_mestre.data_documento
        }
        if (rowData && rowData.notificar_dias_nao_conferido && rowData.notificar_dias_nao_conferido > 0) {
            return (
                <div data-tip={dataTip(rowData.notificar_dias_nao_conferido)}>
                    <img
                        src={IconeNaoDemonstrado}
                        alt=""
                        className="img-fluid mb-1 mr-1"
                    />
                    <span style={notificarNaoConciliado(rowData['notificar_dias_nao_conferido'])}>
                        {data_para_verificar ? moment(data_para_verificar).format('DD/MM/YYYY') : '-'}
                    </span>
                    <ReactTooltip/>
                </div>
            )
        } else {
            return (
                <span>
                    {data_para_verificar ? moment(data_para_verificar).format('DD/MM/YYYY') : '-'}
                </span>
            )
        }
    };

    const valorTemplate = (rowData = null, column = null, valor = null) => {
        let valor_para_formatar;
        if (valor) {
            valor_para_formatar = valor
        } else {
            valor_para_formatar = rowData[column.field]
        }
        let valor_formatado = Number(valor_para_formatar).toLocaleString('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        });
        valor_formatado = valor_formatado.replace(/R/, "").replace(/\$/, "");

        let texto_exibir = rowData?.informacoes?.map(info => {
            if (info.tag_nome === 'Parcial'){
                return info.tag_hint
            }}).filter((texto) => texto !== undefined).join(', ');

            if (!texto_exibir){
                return (
                    <div data-tip={texto_exibir} data-html={true}>
                        <span>
                            {valor_formatado}
                        </span>
                        <FontAwesomeIcon
                            style={{fontSize: '18px', marginLeft: "3px", color: '#C65D00'}}
                            icon={faInfoCircle}
                        />
                        <ReactTooltip/>
                    </div>
                )
            }
            else {
                return valor_formatado
        }
    };

    const rowExpansionTemplate = (data) => {
        return (
            despesaTemplate(data)
        )
    };

    const conferidoTemplate = (rowData) => {
        return (
            <div className="align-middle text-center">
                <input
                    checked={rowData.conferido}
                    type="checkbox"
                    value={checkboxTransacoes}
                    onChange={(e) => handleChangeCheckboxTransacoes(e, rowData.documento_mestre.uuid, true, rowData.tipo_transacao)}
                    name="checkConferido"
                    id="checkConferido"
                    disabled={periodoFechado}
                />
            </div>
        )
    };

    const conferidoRateioTemplate = (rateio) => {
        return (
            <div style={{marginTop: "1.3rem"}}>
                <input
                    checked={rateio.conferido}
                    type="checkbox"
                    value={checkboxTransacoes}
                    onChange={(e) => handleChangeCheckboxTransacoes(e, rateio.uuid, false, rateio.tipo_transacao)}
                    name="checkConferido"
                    id="checkConferido"
                    disabled={periodoFechado}
                />
            </div>
        )
    };

    const tagDataTemplate = (rateio) => {
        return (
            <>
                {rateio.tag
                    ?
                    <span className="badge badge-primary p-1"
                          style={{backgroundColor: '#086397'}}>{rateio.tag.nome}</span>
                    :
                    <span>-</span>
                }
            </>
        )
    }

    const despesaTemplate = (data) => {
        return (
            <div className="border pb-2">
                <div className="row pl-3 pr-3">
                    <div className='col border-bottom p-2'>
                        <p className='mb-0 font-weight-bold'>CNPJ</p>
                        {data.documento_mestre.cpf_cnpj_fornecedor}
                    </div>

                    <div className='col border-left border-bottom p-2'>
                        <p className='mb-0 font-weight-bold'>Tipo de documento</p>
                        {data.documento_mestre.tipo_documento && data.documento_mestre.tipo_documento.nome ? data.documento_mestre.tipo_documento.nome : ''}
                    </div>

                    <div className='col border-left border-bottom p-2'>
                        <p className='mb-0 font-weight-bold'>Forma de pagamento</p>
                        {data.documento_mestre.tipo_transacao && data.documento_mestre.tipo_transacao.nome ? data.documento_mestre.tipo_transacao.nome : ''}
                    </div>

                    <div className='col border-left border-bottom p-2'>
                        <p className='mb-0 font-weight-bold'>Data do pagamento</p>
                        {data.documento_mestre.data_transacao ? dataTemplate(null, null, data.documento_mestre.data_transacao) : ''}
                    </div>

                    {data.documento_mestre.tipo_transacao && data.documento_mestre.tipo_transacao.nome && data.documento_mestre.tipo_transacao.nome === 'Cheque' ? (
                            <div className='col border-left border-bottom p-2'>
                                <p className='mb-0 font-weight-bold'>Número do cheque</p>
                                {data.documento_mestre.documento_transacao}
                            </div>
                        ) :
                        <div className='col border-left border-bottom p-2'>
                            <p className='mb-0 font-weight-bold'>Número do documento</p>
                            {data.documento_mestre.documento_transacao}
                        </div>
                    }
                </div>

                {data.rateios && data.rateios.length > 0 && data.rateios.map((rateio, index) => (
                    <div key={index} className="border-bottom pb-2">
                        <div key={`${index}-info`} className='row mt-2 mb-2'>
                            <div className='col-12 mb-2 pl-4 pr-4'>
                                <p className='font-weight-bold mb-1 pb-2 border-bottom-row-expanded titulo-row-expanded'>Despesa {index + 1}</p>
                            </div>
                        </div>

                        <div className="row pl-4 pr-4" key={`${index}-info-rateio-top`}>
                            <div className='col-lg-2 border pb-2'>
                                <p className='mb-0 font-weight-bold mt-2'>Tipo de despesa</p>
                                {rateio.tipo_custeio && rateio.tipo_custeio.nome ? rateio.tipo_custeio.nome : ''}
                            </div>

                            <div className='col-lg-5 border pb-2'>
                                <p className='mb-0 font-weight-bold mt-2'>Especificação</p>
                                {rateio.especificacao_material_servico && rateio.especificacao_material_servico.descricao ? rateio.especificacao_material_servico.descricao : ''}
                            </div>

                            <div className='col-lg-3 border pb-2'>
                                <p className='mb-0 font-weight-bold mt-2'>Tipo de aplicação</p>
                                {rateio.aplicacao_recurso ? tabelasDespesa.tipos_aplicacao_recurso.find(element => element.id === rateio.aplicacao_recurso).nome : ''}
                            </div>

                            <div className='col-lg-2 border align-middle text-center pb-2'>
                                <p className='mb-0 font-weight-bold mt-2'>Demonstrado</p>
                            </div>
                        </div>

                        <div className="row pl-4 pr-4" key={`${index}-info-rateio-bottom`}>
                            <div className='col-lg-2 border pb-2'>
                                <p className='mb-0 font-weight-bold mt-2'>Ação</p>
                                {rateio.acao_associacao && rateio.acao_associacao.nome ? rateio.acao_associacao.nome : ''}
                            </div>

                            <div className='col-lg-5 border pb-2'>
                                <p className='mb-0 font-weight-bold mt-2'>Valor</p>
                                {rateio.valor_rateio ? valorTemplate(null, null, rateio.valor_rateio) : 0}
                            </div>

                            <div className='col-lg-3 border pb-2'>
                                <p className='mb-0 font-weight-bold mt-2'>Vínculo a atividade</p>
                                {tagDataTemplate(rateio)}
                            </div>

                            <div className='col-lg-2 border align-middle text-center pb-2'>
                                {conferidoRateioTemplate(rateio)}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        )
    };

    const tipoLancamentoTemplateDespesaGeradoraDoImposto = (rowData) => {
        let numero_documento = rowData.despesa_geradora_do_imposto.numero_documento ? "de número " + rowData.despesa_geradora_do_imposto.numero_documento + ", " : ''
        let data_transacao = rowData.despesa_geradora_do_imposto.data_transacao ? "paga em " + moment(rowData.despesa_geradora_do_imposto.data_transacao).format('DD/MM/YYYY') : 'pagamento ainda não realizado';
        let texto_exibir = `Esse imposto está relacionado à despesa</br> ${numero_documento} ${data_transacao}`
        return (
            <div className='d-flex justify-content-between' data-tip={texto_exibir} data-html={true}>
                <span>{rowData.tipo_transacao}</span>
                <img src={bookmarkSolid} alt='' style={{width: '12px'}}/>
                <ReactTooltip/>
            </div>
        )
    }

    const tipoLancamentoTemplateDespesasImpostos = (rowData) => {
        let qtde_impostos = rowData.despesas_impostos.length

        if (qtde_impostos === 1) {
            let valor_imposto = rowData.despesas_impostos[0].valor_total ? valorTemplate(null, null, rowData.despesas_impostos[0].valor_total) + ", " : "0,00 , "
            let data_transacao = rowData.despesas_impostos[0].data_transacao ? "pago em " + moment(rowData.despesas_impostos[0].data_transacao).format('DD/MM/YYYY') : 'pagamento ainda não realizado';
            let texto_exibir = `Essa despesa teve retenção de imposto: R$${valor_imposto}</br> ${data_transacao}`
            return (
                <div className='d-flex justify-content-between' data-tip={texto_exibir} data-html={true}>
                    <span>{rowData.tipo_transacao}</span>
                    <img src={bookmarkRegular} alt='' style={{width: '12px'}}/>
                    <ReactTooltip/>
                </div>
            )
        } else {
            let texto_exibir = "Essa despesa teve retenções de impostos:</br>";

            rowData.despesas_impostos.map((imposto) => (
                texto_exibir += `<p class="mb-0">
                                    R$${imposto.valor_total ? valorTemplate(null, null, imposto.valor_total) + ", " : "0,00 , "}
                                    ${imposto.data_transacao ? "pago em " + moment(imposto.data_transacao).format('DD/MM/YYYY') : 'pagamento ainda não realizado'}
                                </p>`

            ))

            return (
                <div className='d-flex justify-content-between' data-tip={texto_exibir} data-html={true}>
                    <span>{rowData.tipo_transacao}</span>
                    <img src={bookmarkRegular} alt='' style={{width: '12px'}}/>
                    <ReactTooltip/>
                </div>
            )


        }
    }

    const tipoLancamentoTemplate = (rowData) => {
        if (rowData.despesa_geradora_do_imposto && rowData.despesa_geradora_do_imposto.uuid) {
            return tipoLancamentoTemplateDespesaGeradoraDoImposto(rowData)
        } else if (rowData.despesas_impostos && rowData.despesas_impostos.length > 0) {
            return tipoLancamentoTemplateDespesasImpostos(rowData)
        }else{
            return(
                <span>{rowData.tipo_transacao}</span>
            )
        }
    }

    return (
        <div className="row mt-4">
            <div className="col-12">
                <div className="datatable-responsive-demo">
                    <DataTable
                        value={transacoes}
                        expandedRows={expandedRows}
                        onRowToggle={(e) => setExpandedRows(e.data)}
                        rowExpansionTemplate={rowExpansionTemplate}
                        dataKey="documento_mestre.uuid"
                        className='tabela-transacoes tabela-transacoes tabela-lancamentos-despesas p-datatable-responsive-demo'
                        paginator={transacoes.length > rowsPerPage}
                        rows={rowsPerPage}
                        paginatorTemplate="PrevPageLink PageLinks NextPageLink"
                        onRowClick={e => redirecionaDetalhe(e.data)}
                    >
                        <Column expander style={{width: '3em', borderRight: 'none'}}/>
                        <Column
                            field="data"
                            header="Data"
                            style={{borderLeft: 'none'}}
                            body={dataTemplate}
                        />
                        <Column
                            field="tipo_transacao"
                            header="Tipo de lançamento"
                            body={tipoLancamentoTemplate}
                        />
                        <Column className='quebra-palavra' field="numero_documento" header="N.º do documento"
                                style={{width: '160px'}}/>
                        <Column field="descricao" header="Descrição"/>
                        <Column
                            field="valor_transacao_na_conta"
                            header="Valor (R$)"
                            body={valorTemplate}
                        />
                        <Column
                            field="conferido"
                            header="Demonstrado"
                            className='align-middle text-center'
                            body={conferidoTemplate}
                        />
                    </DataTable>
                </div>
            </div>
            <section>
                <RedirectModalTabelaLancamentos show={showModal} handleClose={onHandleClose}
                                                onCancelarTrue={onCancelarTrue}/>
            </section>
        </div>
    )
};

export default memo(TabelaTransacoes)

