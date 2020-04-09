import React, {Component} from 'react'
import {DataTable} from 'primereact/datatable'
import {Column} from 'primereact/column'
import {Button} from 'primereact/button'
import {Row, Col} from 'reactstrap'
import {getListaRateiosDespesas} from '../../../services/RateiosDespesas.service'
import {redirect} from '../../../utils/redirect.js'
import '../../../paginas/404/pagina-404.scss'
import {Route} from 'react-router-dom'
import moment from 'moment'
import {FormFiltroPorPalavra} from "../../FormFiltroPorPalavra";
import Img404 from "../../../assets/img/img-404.svg"
import {MsgImgLadoDireito} from "../../Mensagens/MsgImgLadoDireito";
import {MsgImgCentralizada} from "../../Mensagens/MsgImgCentralizada";
import "./lista-de-despesas.scss"
import {FormFiltrosAvancados} from "../FormFiltrosAvancados/FormFiltrosAvancados";

export class ListaDeDespesas extends Component {
    constructor(props) {
        super(props)
        this.state = {
            rateiosDespesas: [],
            inputPesquisa: "",
            filtro_por_palavra: false,
            mais_filtros: false,
        }
    }

    buscaRateiosDespesas = async () => {
        const rateiosDespesas = await getListaRateiosDespesas()
        this.setState({rateiosDespesas})
    }

    componentDidMount() {
        this.buscaRateiosDespesas()
    }

    numeroDocumentoStatusTemplate(rowData, column) {
        const statusColor =
            rowData['status_despesa'] === 'COMPLETO'
                ? 'ptrf-despesa-status-ativo'
                : 'ptrf-despesa-status-inativo'
        const statusText =
            rowData['status_despesa'] === 'COMPLETO'
                ? 'Status: Completo'
                : 'Status: Incompleto'
        return (
            <div>
                <span>{rowData['numero_documento']}</span>
                <br></br>
                <span className={statusColor}>{statusText}</span>
            </div>
        )
    }

    especificacaoDataTemplate(rowData, column) {
        return (
            <div>
        <span>
          {rowData['especificacao_material_servico']
              ? rowData['especificacao_material_servico'].descricao
              : ''}
        </span>
                <br></br>
                <span>
          Data:{' '}
                    {rowData['data_documento']
                        ? moment(rowData['data_documento']).format('DD/MM/YYYY')
                        : ''}
        </span>
            </div>
        )
    }

    valorTotalTemplate(rowData, column) {
        const valorFormatado = rowData['valor_total']
            ? rowData['valor_total'].toLocaleString('pt-BR', {
                style: 'currency',
                currency: 'BRL'
            })
            : ''
        return <span>{valorFormatado}</span>
    }

    novaDespesaButton() {
        return (
            <Route
                render={({history}) => (
                    <Button
                        icon="pi pi-file"
                        label="Cadastrar despesa"
                        style={{marginBottom: '.80em'}}
                        className="btn-coad-background-outline"
                        onClick={() => {
                            history.push('/cadastro-de-despesa')
                        }}
                    />
                )}
            />
        )
    }

    redirecionaDetalhe = value => {
        console.log(value)
        const url = '/edicao-de-despesa/' + value.despesa
        redirect(url)
    }

    onClickBtnMaisFiltros = (event) => {
        console.log("Ollyver Cliquei")
        this.setState({mais_filtros: !this.state.mais_filtros})
    }

    render() {
        const {rateiosDespesas} = this.state
        const rowsPerPage = 10

        return (
            <div>
                <Row>
                    <div className="col-12">
                        <p>Filtrar por</p>
                    </div>
                    <Col lg={7} xl={7} className={`pr-0 ${!this.state.mais_filtros ? "lista-de-despesas-visible" : "lista-de-despesas-invisible"}`}>
                        <i
                            className="float-left fas fa-file-signature"
                            style={{marginRight: '5px', color: '#42474A'}}
                        ></i>

                        <FormFiltroPorPalavra
                            inputPesquisa={this.state.inputPesquisa}
                            setInputPesquisa={(inputPesquisa)=>this.setState({inputPesquisa})}
                            filtro_por_palavra={this.state.filtro_por_palavra}
                            set_filtro_por_palavra={(filtro_por_palavra)=>this.setState({filtro_por_palavra})}
                            setLista={(rateiosDespesas)=>this.setState({rateiosDespesas})}
                            origem="Despesas"
                        />
                    </Col>
                    <Col lg={2} xl={2} className={`pl-sm-0 ${!this.state.mais_filtros ? "lista-de-despesas-visible" : "lista-de-despesas-invisible"}`}>
                        <button
                            onClick={this.onClickBtnMaisFiltros}
                            type="button"
                            className="btn btn btn-outline-success"
                        >
                            Mais Filtros
                        </button>
                    </Col>
                    <Col lg={!this.state.mais_filtros ? 3 : 12} xl={!this.state.mais_filtros ? 3 : 12}>
                        <span className="float-right">{this.novaDespesaButton()}</span>
                    </Col>
                </Row>

                <div className={`row ${this.state.mais_filtros ? "lista-de-despesas-visible" : "lista-de-despesas-invisible"}`}>

                    <div className='col-12'>

                        <FormFiltrosAvancados/>

                        <div className="d-flex justify-content-end pb-3 mt-3">
                            <button
                                onClick={this.onClickBtnMaisFiltros}
                                className="btn btn-outline-success mt-2 mr-2"
                                type="button"
                            >
                                Cancelar
                            </button>
                            <button
                                type="submit"
                                className="btn btn-success mt-2 ml-2"
                            >
                                Filtrar
                            </button>
                        </div>

                    </div>

                </div>
                {rateiosDespesas.length > 0 ? (
                        <DataTable
                            value={rateiosDespesas}
                            className="mt-3 datatable-footer-coad"
                            paginator={rateiosDespesas.length > rowsPerPage}
                            rows={rowsPerPage}
                            paginatorTemplate="PrevPageLink PageLinks NextPageLink"
                            autoLayout={true}
                            selectionMode="single"
                            onRowClick={e => this.redirecionaDetalhe(e.data)}
                        >
                            <Column
                                field="numero_documento"
                                header="Número do documento"
                                body={this.numeroDocumentoStatusTemplate}
                            />
                            <Column
                                field="especificacao_material_servico.descricao"
                                header="Especificação do material ou serviço"
                                body={this.especificacaoDataTemplate}
                            />
                            <Column field="aplicacao_recurso" header="Aplicação"/>
                            <Column field="acao_associacao.nome" header="Tipo de ação"/>
                            <Column
                                field="valor_total"
                                header="Valor"
                                body={this.valorTotalTemplate}
                                style={{textAlign: 'right'}}
                            />
                        </DataTable>
                    ) :
                    this.state.filtro_por_palavra ? (
                            <MsgImgCentralizada
                                texto='Não encontramos resultados, verifique os filtros e tente novamente.'
                                img={Img404}
                            />
                        ) :
                        <MsgImgLadoDireito
                            texto='A sua escola ainda não possui despesas cadastradas, clique no botão "Cadastrar despesa" para começar.'
                            img={Img404}
                        />

                }
            </div>
        )
    }
}
