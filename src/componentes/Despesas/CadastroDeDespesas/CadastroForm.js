import React, {Component, Fragment, useContext, useEffect, useState} from "react";
import {Formik, FieldArray, Field} from "formik";
import { YupSignupSchemaCadastroDespesa, validaPayloadDespesas, validateFormDespesas, cpfMaskContitional, calculaValorRecursoAcoes,  } from "../../../utils/ValidacoesAdicionaisFormularios";
import MaskedInput from 'react-text-mask'
import { getDespesasTabelas, criarDespesa, alterarDespesa, deleteDespesa, getEspecificacoesCapital, getEspecificacoesCusteio} from "../../../services/Despesas.service";
import {DatePickerField} from "../../DatePickerField";
import {Button, Modal} from "react-bootstrap";
import {useHistory} from 'react-router-dom'
import {CadastroFormCusteio} from "./CadastroFormCusteio";
import {CadastroFormCapital} from "./CadastroFormCapital";
import {DespesaContext} from "../../../context/Despesa";
import HTTP_STATUS from "http-status-codes";
import {ASSOCIACAO_UUID} from "../../../services/auth.service";

import CurrencyInput from "react-currency-input";

class CancelarModal extends Component {
    render() {
        return (
            <Fragment>
                <Modal centered show={this.props.show} onHide={this.props.handleClose}>
                    <Modal.Header closeButton>
                        <Modal.Title>Cancelar cadastro</Modal.Title>
                    </Modal.Header>
                     <Modal.Body>
                         <p>Tem certeza que deseja cancelar esse cadastramento? As informações não serão salvas</p>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="primary" onClick={this.props.onCancelarTrue}>
                            OK
                        </Button>
                        <Button variant="primary" onClick={this.props.handleClose}>
                            Fechar
                        </Button>
                    </Modal.Footer>
                </Modal>
            </Fragment>
        )
    }
}

class DeletarModal extends Component {

    render () {
        return (
            <Fragment>
                <Modal centered show={this.props.show} onHide={this.props.handleClose}>
                    <Modal.Header closeButton>
                        <Modal.Title>Deseja excluir esta Despesa?</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <p>Tem certeza que deseja excluir esta despesa? A ação não poderá ser desfeita.</p>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="primary" onClick={this.props.onDeletarTrue}>
                            OK
                        </Button>
                        <Button variant="primary" onClick={this.props.handleClose}>
                            Fechar
                        </Button>
                    </Modal.Footer>
                </Modal>
            </Fragment>
        )
    }
}

export const CadastroForm = () => {


    let history = useHistory();

    const despesaContext = useContext(DespesaContext)

    const [despesasTabelas, setDespesasTabelas] = useState([])
    const [show, setShow] = useState(false);
    const [showDelete, setShowDelete] = useState(false);
    const [especificaoes_capital, set_especificaoes_capital] = useState("");
    const [especificacoes_custeio, set_especificacoes_custeio] = useState([]);


    useEffect(() => {
        const carregaTabelasDespesas = async () => {
            const resp = await getDespesasTabelas();
            setDespesasTabelas(resp);

            const array_tipos_custeio = resp.tipos_custeio;
            let let_especificacoes_custeio = [];

            array_tipos_custeio.map( async (tipoCusteio, index) => {
                const resposta = await getEspecificacoesCusteio(tipoCusteio.id)
                let_especificacoes_custeio[tipoCusteio.id] = await resposta
            })

            set_especificacoes_custeio(let_especificacoes_custeio)

        };
        carregaTabelasDespesas();

    }, [])


    useEffect(() => {
        (async function get_especificacoes_capital() {
            const resp = await getEspecificacoesCapital();
            set_especificaoes_capital(resp)
        })();
    }, []);

    const initialValues = () => {
        return despesaContext.initialValues
    }

    const onSubmit = async (values, {resetForm}) => {

        validaPayloadDespesas(values)

        console.log("onSubmit", values)

        if( despesaContext.verboHttp === "POST"){
            try {
                const response = await criarDespesa(values)
                if (response.status === HTTP_STATUS.CREATED) {
                    console.log("Operação realizada com sucesso!");
                    resetForm({values: ""})
                    let path = `/lista-de-despesas`;
                    history.push(path);
                } else {
                    console.log(response)
                   return
                }
            } catch (error) {
                console.log(error)
                return
            }
        }else if(despesaContext.verboHttp === "PUT"){
            console.log("onsubmit Método PUT")
            try {
                const response = await alterarDespesa(values, despesaContext.idDespesa)
                if (response.status === 200) {
                    console.log("Operação realizada com sucesso!");
                    resetForm({values: ""})
                    let path = `/lista-de-despesas`;
                    history.push(path);
                } else {
                    console.log(response)
                    return
                }
            } catch (error) {
                console.log(error)
                return
            }
        }

    }

    const onCancelarTrue = () => {
        setShow(false);
        let path = `/lista-de-despesas`;
        history.push(path);
    }

    const onHandleClose = () => {
        setShow(false);
        setShowDelete(false);
    }

    const onShowModal = () => {
        setShow(true);
    }

    const onShowDeleteModal = () => {
        setShowDelete(true);
    }

    const onDeletarTrue = () => {
        deleteDespesa(despesaContext.idDespesa)
        .then(response => {
            console.log("Despesa deletada com sucesso.");
            setShowDelete(false);
            let path = `/lista-de-despesas`;
            history.push(path);
        })
        .catch(error => {
            console.log(error);
            alert("Um Problema Ocorreu. Entre em contato com a equipe para reportar o problema, obrigado.");
        });
    }

    return (
        <>
            <Formik
                initialValues={initialValues()}
                validationSchema={YupSignupSchemaCadastroDespesa}
                validateOnBlur={false}
                onSubmit={onSubmit}
                enableReinitialize={true}
                validate={validateFormDespesas}
            >
                {props => {
                    const {
                        values,
                        setFieldValue,
                        errors,
                    } = props;
                    return (
                        <form onSubmit={props.handleSubmit}>
                            <div className="form-row">
                                <div className="col-12 col-md-6 mt-4">
                                    <label htmlFor="cpf_cnpj_fornecedor">CNPJ ou CPF do fornecedor</label>
                                    <MaskedInput
                                        mask={(valor) => cpfMaskContitional(valor)}
                                        value={props.values.cpf_cnpj_fornecedor}
                                        onChange={props.handleChange}
                                        onBlur={props.handleBlur}
                                        name="cpf_cnpj_fornecedor" id="cpf_cnpj_fornecedor" type="text"
                                        className="form-control"
                                        placeholder="Digite o número do documento"
                                    />
                                    {props.errors.cpf_cnpj_fornecedor && <span
                                        className="span_erro text-danger mt-1"> {props.errors.cpf_cnpj_fornecedor}</span>}
                                </div>
                                <div className="col-12 col-md-6  mt-4">
                                    <label htmlFor="nome_fornecedor">Razão social do fornecedor</label>
                                    <input
                                        value={props.values.nome_fornecedor}
                                        onChange={props.handleChange}
                                        onBlur={props.handleBlur}
                                        name="nome_fornecedor" id="nome_fornecedor" type="text" className="form-control"
                                        placeholder="Digite o nome"/>
                                </div>
                            </div>

                            <div className="form-row">
                                <div className="col-12 col-md-3 mt-4">
                                    <label htmlFor="tipo_documento">Tipo de documento</label>
                                    <select
                                        value={
                                            props.values.tipo_documento !== null ? (
                                                props.values.tipo_documento === "object" ? props.values.tipo_documento.id : props.values.tipo_documento.id
                                            ) : 0
                                        }
                                        onChange={props.handleChange}
                                        onBlur={props.handleBlur}
                                        name='tipo_documento'
                                        id='tipo_documento'
                                        className="form-control">
                                        <option key={0} value={0}>Selecione o tipo</option>
                                        {despesasTabelas.tipos_documento && despesasTabelas.tipos_documento.map(item =>
                                            <option key={item.id} value={item.id}>{item.nome}</option>
                                        )
                                        }
                                    </select>
                                </div>

                                <div className="col-12 col-md-3 mt-4">
                                    <label htmlFor="numero_documento">Número do documento</label>
                                    <input
                                        value={props.values.numero_documento}
                                        onChange={props.handleChange}
                                        onBlur={props.handleBlur}
                                        name="numero_documento" id="numero_documento" type="text"
                                        className="form-control" placeholder="Digite o número"/>
                                </div>

                                <div className="col-12 col-md-3 mt-4">
                                    <label htmlFor="data_documento">Data do documento</label>
                                    <DatePickerField
                                        name="data_documento"
                                        id="data_documento"
                                        value={values.data_documento != null ? values.data_documento : ""}
                                        onChange={setFieldValue}
                                    />
                                    {props.errors.data_documento &&
                                    <span className="span_erro text-danger mt-1"> {props.errors.data_documento}</span>}
                                </div>

                                <div className="col-12 col-md-3 mt-4">
                                    <label htmlFor="tipo_transacao">Tipo de transação</label>
                                    <select
                                        value={
                                            props.values.tipo_transacao !== null ? (
                                                props.values.tipo_transacao === "object" ? props.values.tipo_transacao.id : props.values.tipo_transacao.id
                                            ) : 0
                                        }
                                        onChange={props.handleChange}
                                        onBlur={props.handleBlur}
                                        name='tipo_transacao'
                                        id='tipo_transacao'
                                        className="form-control"
                                    >
                                        <option key={0} value={0}>Selecione o tipo</option>
                                        {despesasTabelas.tipos_transacao && despesasTabelas.tipos_transacao.map(item => (
                                            <option key={item.id} value={item.id}>{item.nome}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div className="form-row">
                                <div className="col-12 col-md-3 mt-4">
                                    <label htmlFor="data_transacao">Data da transação</label>
                                    <DatePickerField
                                        name="data_transacao"
                                        id="data_transacao"
                                        value={values.data_transacao != null ? values.data_transacao : ""}
                                        onChange={setFieldValue}
                                    />
                                    {props.errors.data_transacao &&
                                    <span className="span_erro text-danger mt-1"> {props.errors.data_transacao}</span>}
                                </div>

                                <div className="col-12 col-md-3 mt-4">
                                    <label htmlFor="valor_total">Valor total</label>

                                    <CurrencyInput
                                        allowNegative={false}
                                        prefix='R$'
                                        decimalSeparator=","
                                        thousandSeparator="."
                                        value={props.values.valor_total}
                                        name="valor_total"
                                        id="valor_total"
                                        className="form-control"
                                        onChangeEvent={props.handleChange}
                                    />
                                    {props.errors.valor_total &&
                                    <span className="span_erro text-danger mt-1"> {props.errors.valor_total}</span>}
                                </div>

                                <div className="col-12 col-md-3 mt-4">
                                    <label htmlFor="valor_recursos_proprios">Valor do recurso próprio</label>

                                    <CurrencyInput
                                        allowNegative={false}
                                        prefix='R$'
                                        decimalSeparator=","
                                        thousandSeparator="."
                                        value={props.values.valor_recursos_proprios}
                                        name="valor_recursos_proprios"
                                        id="valor_recursos_proprios"
                                        className="form-control"
                                        onChangeEvent={props.handleChange}
                                    />
                                    {props.errors.valor_recursos_proprios && <span className="span_erro text-danger mt-1"> {props.errors.valor_recursos_proprios}</span>}
                                </div>

                                <div className="col-12 col-md-3 mt-4">
                                    <label htmlFor="valor_recusos_acoes">Valor do recurso das ações</label>

                                    <Field name="valor_recusos_acoes">
                                        {({ field, form, meta }) => (
                                            <CurrencyInput
                                                allowNegative={false}
                                                prefix='R$'
                                                decimalSeparator=","
                                                thousandSeparator="."
                                                value={calculaValorRecursoAcoes(props)}
                                                id="valor_recusos_acoes"
                                                className="form-control"
                                                onChangeEvent={props.handleChange}
                                                readOnly={true}
                                            />
                                        )}
                                    </Field>
                                    {errors.valor_recusos_acoes && <span className="span_erro text-danger mt-1"> {errors.valor_recusos_acoes}</span>}
                                </div>
                            </div>

                            <hr/>
                            <h2 className="subtitulo-itens-painel">Dados do gasto</h2>
                            <p>Esse gasto se encaixa em mais de um tipo de despesa ou ação?</p>
                            <div className="form-row">
                                <div className="col-12 col-md-3 ">
                                    <select
                                        value={props.values.mais_de_um_tipo_despesa}
                                        onChange={props.handleChange}
                                        onBlur={props.handleBlur}
                                        name='mais_de_um_tipo_despesa'
                                        id='mais_de_um_tipo_despesa'
                                        className="form-control"
                                    >
                                        <option value="0">Selecione</option>
                                        <option value="nao">Não</option>
                                        <option value="sim">Sim</option>
                                    </select>
                                </div>
                            </div>


                            <FieldArray
                                name="rateios"
                                render={({insert, remove, push}) => (
                                    <>
                                        {values.rateios.length > 0 && values.rateios.map((rateio, index) => {
                                            return (

                                                <div key={index}>

                                                    <div className="form-row">
                                                            <div className="col-12 mt-4 ml-0">
                                                                <p className='mb-0'><strong>Despesa {index+1}</strong></p>
                                                                <hr className='mt-0 mb-1'/>
                                                            </div>

                                                        <div className="col-12 col-md-6 mt-4">

                                                            <label htmlFor="aplicacao_recurso">Tipo de aplicação do recurso</label>
                                                            <select
                                                                value={rateio.aplicacao_recurso}
                                                                onChange={(e) => {
                                                                    props.handleChange(e);
                                                                }}
                                                                name={`rateios[${index}].aplicacao_recurso`}
                                                                id='aplicacao_recurso'
                                                                className="form-control"
                                                            >
                                                                <option key={0} value={0}>Escolha uma opção</option>
                                                                {despesasTabelas.tipos_aplicacao_recurso && despesasTabelas.tipos_aplicacao_recurso.map(item => (
                                                                    <option key={item.id} value={item.id}>{item.nome}</option>
                                                                ))}
                                                            </select>
                                                        </div>
                                                    </div>

                                                    { rateio.aplicacao_recurso && rateio.aplicacao_recurso === 'CUSTEIO' ? (
                                                        <CadastroFormCusteio
                                                            formikProps={props}
                                                            rateio={rateio}
                                                            index={index}
                                                            despesasTabelas={despesasTabelas}
                                                            especificacoes_custeio={especificacoes_custeio}
                                                        />
                                                    ):
                                                        rateio.aplicacao_recurso && rateio.aplicacao_recurso === 'CAPITAL' ? (
                                                            <CadastroFormCapital
                                                                formikProps={props}
                                                                rateio={rateio}
                                                                index={index}
                                                                despesasTabelas={despesasTabelas}
                                                                especificaoes_capital={especificaoes_capital}
                                                            />

                                                            ): null}


                                                        {index >= 1 && values.rateios.length > 1 && (
                                                            <div className="d-flex  justify-content-start mt-3 mb-3">
                                                                <button
                                                                    type="button"
                                                                    className="btn btn btn-outline-success mt-2 mr-2"
                                                                    onClick={() => remove(index )}
                                                                >
                                                                    - Remover Despesa
                                                                </button>
                                                            </div>
                                                    )}
                                                </div> /*div key*/
                                            )
                                        })}

                                        {props.values.mais_de_um_tipo_despesa === "sim" &&
                                        <div className="d-flex  justify-content-start mt-3 mb-3">

                                            <button
                                                type="button"
                                                className="btn btn btn-outline-success mt-2 mr-2"
                                                onClick={() => push(
                                                    {
                                                        associacao: localStorage.getItem(ASSOCIACAO_UUID),
                                                        conta_associacao: "",
                                                        acao_associacao: "",
                                                        aplicacao_recurso: "",
                                                        tipo_custeio: "",
                                                        especificacao_material_servico: "",
                                                        valor_rateio: "",
                                                        quantidade_itens_capital: "",
                                                        valor_item_capital: "",
                                                        numero_processo_incorporacao_capital: ""
                                                    }
                                                )
                                                }
                                            >
                                                + Adicionar despesa parcial
                                            </button>
                                        </div>
                                        }
                                    </>
                                )}
                            />
                            <div className="d-flex  justify-content-end pb-3">
                                <button type="reset" onClick={onShowModal} className="btn btn btn-outline-success mt-2 mr-2">Cancelar </button>
                                {despesaContext.idDespesa
                                    ? <button type="reset" onClick={onShowDeleteModal} className="btn btn btn-danger mt-2">Deletar</button>
                                    : null}
                                <button type="submit" className="btn btn-success mt-2 ml-2">Salvar</button>
                            </div>
                        </form>

                    ); /*Return metodo principal*/

                }}
            </Formik>
            <section>
                <CancelarModal show={show} handleClose={onHandleClose} onCancelarTrue={onCancelarTrue}/>
            </section>
            {despesaContext.idDespesa
                ?
                <DeletarModal show={showDelete} handleClose={onHandleClose} onDeletarTrue={onDeletarTrue}/>
                : null
            }
        </>
    );
}