import React, {useEffect, useState} from "react";
import {useParams, Redirect} from "react-router-dom";
import {PaginasContainer} from "../../../../paginas/PaginasContainer";
import {getPrestacaoDeContasDetalhe} from "../../../../services/dres/PrestacaoDeContas.service";
import {Cabecalho} from "./Cabecalho";
import {TrilhaDeStatus} from "./TrilhaDeStatus";
import {BotoesAvancarRetroceder} from "./BotoesAvancarRetroceder";
import {FormRecebimentoPelaDiretoria} from "./FormRecebimentoPelaDiretoria";
import {getTabelasPrestacoesDeContas, getReceberPrestacaoDeContas, getReabrirPrestacaoDeContas, getListaDeCobrancas, getAddCobranca, getDeletarCobranca, getDesfazerRecebimento, getAnalisarPrestacaoDeContas, getDesfazerAnalise, getSalvarAnalise, getInfoAta} from "../../../../services/dres/PrestacaoDeContas.service";
import moment from "moment";
import {ModalReabrirPc} from "../ModalReabrirPC";
import {ModalNaoRecebida} from "../ModalNaoRecebida";
import {ModalRecebida} from "../ModalRecebida";
import {CobrancaPrestacaoDeContas} from "./CobrancaPrestacaoDeContas";
import {DevolucoesPrestacaoDeContas} from "./DevolucoesPrestacaoDeContas";
import {InformacoesPrestacaoDeContas} from "./InformacoesPrestacaoDeContas";
import {ResumoFinanceiroSeletorDeContas} from "./ResumoFinanceiroSeletorDeContas";
import {ResumoFinanceiroTabelaTotais} from "./ResumoFinanceiroTabelaTotais";
import {ResumoFinanceiroTabelaAcoes} from "./ResumoFinanceiroTabelaAcoes";
import {AnalisesDeContaDaPrestacao} from "./AnalisesDeContaDaPrestacao";

require("ordinal-pt-br");

export const DetalhePrestacaoDeContas = () =>{
    let {prestacao_conta_uuid} = useParams();

    const initialFormRecebimentoPelaDiretoria = {
        tecnico_atribuido: "",
        data_recebimento: "",
        status: "",
    };

    const initialListaCobranca = {
        uuid: "",
        prestacao_conta: '',
        data:'',
        tipo: '',
    };

    const initialInformacoesPrestacaoDeContas = {
        processo_sei: "",
        ultima_analise: '',
        devolucao_ao_tesouro:'',
    };

    const [prestacaoDeContas, setPrestacaoDeContas] = useState({});
    const [stateFormRecebimentoPelaDiretoria, setStateFormRecebimentoPelaDiretoria] = useState(initialFormRecebimentoPelaDiretoria);
    const [tabelaPrestacoes, setTabelaPrestacoes] = useState({});
    const [showReabrirPc, setShowReabrirPc] = useState(false);
    const [showNaoRecebida, setShowNaoRecebida] = useState(false);
    const [showRecebida, setShowRecebida] = useState(false);
    const [redirectListaPc, setRedirectListaPc] = useState(false);
    const [listaDeCobrancas, setListaDeCobrancas] = useState(initialListaCobranca);
    const [dataCobranca, setDataCobranca] = useState('');
    const [informacoesPrestacaoDeContas, setInformacoesPrestacaoDeContas] = useState(initialInformacoesPrestacaoDeContas);
    const [clickBtnEscolheConta, setClickBtnEscolheConta] = useState({0: true});
    const [infoAta, setInfoAta] = useState({});
    const [infoAtaPorConta, setInfoAtaPorConta] = useState({});
    const [clickBtnTabelaAcoes, setClickBtnTabelaAcoes] = useState(false);
    const [analisesDeContaDaPrestacao, setAnalisesDeContaDaPrestacao] = useState([]);


    useEffect(()=>{
        carregaPrestacaoDeContas();
        carregaTabelaPrestacaoDeContas();
    }, []);

    useEffect(()=>{
        carregaListaDeCobrancas();
        carregaInfoAta();
    }, [prestacaoDeContas]);

    useEffect(()=>{
        getPrimeiraAtaPorConta()
    }, [infoAta]);

    const carregaPrestacaoDeContas = async () => {
        if (prestacao_conta_uuid){
            let prestacao = await getPrestacaoDeContasDetalhe(prestacao_conta_uuid);
            setPrestacaoDeContas(prestacao);
            setStateFormRecebimentoPelaDiretoria({
                ...stateFormRecebimentoPelaDiretoria,
                tecnico_atribuido: prestacao && prestacao.tecnico_responsavel && prestacao.tecnico_responsavel.nome ? prestacao.tecnico_responsavel.nome : '',
                data_recebimento: prestacao && prestacao.data_recebimento ? prestacao.data_recebimento : '',
                status: prestacao && prestacao.status ? prestacao.status : '',
            });

            setInformacoesPrestacaoDeContas({
                ...informacoesPrestacaoDeContas,
                processo_sei: prestacao && prestacao.processo_sei ? prestacao.processo_sei : '',
                ultima_analise: prestacao && prestacao.data_ultima_analise ? prestacao.data_ultima_analise : '',
                devolucao_ao_tesouro: prestacao && prestacao.devolucao_ao_tesouro ? prestacao.devolucao_ao_tesouro : '',
            });

        }
    };

    const carregaTabelaPrestacaoDeContas = async () => {
        let tabela_prestacoes = await getTabelasPrestacoesDeContas();
        setTabelaPrestacoes(tabela_prestacoes);
    };

    const carregaListaDeCobrancas = async () =>{
        if (prestacaoDeContas && prestacaoDeContas.uuid){
            let lista = await getListaDeCobrancas(prestacaoDeContas.uuid);
            setListaDeCobrancas(lista)
        }
    };

    const addCobranca = async () =>{
        let data_cobranca = dataCobranca ? moment(new Date(dataCobranca), "YYYY-MM-DD").format("YYYY-MM-DD") : "";
        if (data_cobranca){
            let payload = {
                prestacao_conta: prestacaoDeContas.uuid,
                data: data_cobranca,
                tipo: 'RECEBIMENTO'
            };
            await getAddCobranca(payload);
            await carregaListaDeCobrancas();
            setDataCobranca('')
        }
    };

    const deleteCobranca = async (cobranca_uuid) =>{
        await getDeletarCobranca(cobranca_uuid);
        if (cobranca_uuid){
            await carregaListaDeCobrancas()
        }
    };

    const receberPrestacaoDeContas = async ()=>{
        let dt_recebimento = stateFormRecebimentoPelaDiretoria.data_recebimento ? moment(new Date(stateFormRecebimentoPelaDiretoria.data_recebimento), "YYYY-MM-DD").format("YYYY-MM-DD") : "";
        let payload = {
            data_recebimento: dt_recebimento,
        };
        await getReceberPrestacaoDeContas(prestacaoDeContas.uuid, payload);
        await carregaPrestacaoDeContas();
        setRedirectListaPc(false);
    };

    const reabrirPrestacaoDeContas = async ()=>{
        await getReabrirPrestacaoDeContas(prestacaoDeContas.uuid);
        setRedirectListaPc(true)
    };

    const desfazerRecebimento = async () =>{
        await getDesfazerRecebimento(prestacaoDeContas.uuid);
        await carregaPrestacaoDeContas();
    };

    const analisarPrestacaoDeContas = async () =>{
        await getAnalisarPrestacaoDeContas(prestacaoDeContas.uuid);
        await carregaPrestacaoDeContas();
    };

    const desfazerAnalise = async () =>{
        await getDesfazerAnalise(prestacaoDeContas.uuid);
        await carregaPrestacaoDeContas();
    };

    // Ata
    const carregaInfoAta = async () =>{
        if (prestacaoDeContas.uuid){
            let info_ata = await getInfoAta(prestacaoDeContas.uuid);
            setInfoAta(info_ata);
        }

    };

    const toggleBtnEscolheConta = (id) => {
        setClickBtnEscolheConta({
            [id]: !clickBtnEscolheConta[id]
        });
    };

    const toggleBtnTabelaAcoes = (id) => {
        setClickBtnTabelaAcoes({
            [id]: !clickBtnTabelaAcoes[id]
        });
    };

    const getPrimeiraAtaPorConta = async ()=>{
        if (infoAta && infoAta.contas && infoAta.contas.length > 0){
            let conta = infoAta.contas[0];
            setInfoAtaPorConta(conta)

            setAnalisesDeContaDaPrestacao(analise=>[
                ...analise,
                {
                    conta_associacao: conta.conta_associacao.uuid,
                    data_extrato: '',
                    saldo_extrato:'',
                }
            ])
        }
    };

    const exibeAtaPorConta = async (conta) =>{
        let info_ata_por_conta = infoAta.contas.find(element => element.conta_associacao.nome === conta);
        setInfoAtaPorConta(info_ata_por_conta);

        let analise = analisesDeContaDaPrestacao.find(element => element.conta_associacao === info_ata_por_conta.conta_associacao.uuid)

        if (analise === undefined){
            setAnalisesDeContaDaPrestacao(analise=>[
                ...analise,
                {
                    conta_associacao: info_ata_por_conta.conta_associacao.uuid,
                    data_extrato: '',
                    saldo_extrato:'',
                }
            ])
        }

    };

    const valorTemplate = (valor) => {
        let valor_formatado = Number(valor).toLocaleString('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        });
        valor_formatado = valor_formatado.replace(/R/, "").replace(/\$/, "");
        return valor_formatado
    };

    const getObjetoIndexAnalise = () =>{
        let analise_obj = analisesDeContaDaPrestacao.find(element => element.conta_associacao === infoAtaPorConta.conta_associacao.uuid);
        let analise_index = analisesDeContaDaPrestacao.indexOf(analise_obj);
        return {
            analise_obj: analise_obj,
            analise_index: analise_index,
        }
    }

    const handleChangeAnalisesDeContaDaPrestacao = (name, value) =>{
        let arrayAnalise = analisesDeContaDaPrestacao;
        let analise_index = getObjetoIndexAnalise().analise_index;

        arrayAnalise[analise_index].conta_associacao = infoAtaPorConta.conta_associacao.uuid;
        arrayAnalise[analise_index][name] = value;

        setAnalisesDeContaDaPrestacao(()=>[
            ...arrayAnalise
        ])

    };

    const handleSubmitAnalisesDeContaDaPrestacao = (uuid_conta) =>{
        console.log("SUBMIT analisesDeContaDaPrestacao ", analisesDeContaDaPrestacao)
    };

    // Fim Ata

    const handleChangeDataCobranca = (name, value) =>{
        setDataCobranca(value);
    };

    const handleChangeFormRecebimentoPelaDiretoria = (name, value) => {
        setStateFormRecebimentoPelaDiretoria({
            ...stateFormRecebimentoPelaDiretoria,
            [name]: value
        });
    };

    const handleChangeFormInformacoesPrestacaoDeContas = (name, value) => {
        setInformacoesPrestacaoDeContas({
            ...informacoesPrestacaoDeContas,
            [name]: value
        });
    };

    const salvarAnalise = async () =>{
        const payload = {
            devolucao_tesouro: informacoesPrestacaoDeContas.devolucao_ao_tesouro === 'Sim',
            analises_de_conta_da_prestacao: [],
        };
        await getSalvarAnalise(prestacaoDeContas.uuid, payload);
        await carregaPrestacaoDeContas();
    };

    const onHandleClose = () => {
        setShowReabrirPc(false);
        setShowNaoRecebida(false);
        setShowRecebida(false)
    };

    const onReabrirTrue = async () => {
        setShowReabrirPc(false);
        await reabrirPrestacaoDeContas();
    };

    const onNaoRecebida = async () => {
        setShowNaoRecebida(false);
        await desfazerRecebimento();
    };

    const onRecebida = async () => {
        setShowRecebida(false);
        await desfazerAnalise();
    };

    const retornaNumeroOrdinal = (index) =>{

        let _index = index + 1;

        if (_index === 10){
            return 'Décima'
        }else if(_index === 20){
            return 'Vigésima'
        }else if(_index === 30){
            return 'Trigésima'
        }else if(_index === 40){
            return 'Quadragésima'
        }else{
            let oridinal = _index.toOrdinal({ genero: "a"});
            let array = oridinal.split(' ');
            let primeira_palavra = array[0];
            let modificada = primeira_palavra.substring(0, primeira_palavra.length - 1) + 'a';
            if (array[1] === undefined){
                return modificada.charAt(0).toUpperCase() + modificada.slice(1)
            }else {
                return modificada.charAt(0).toUpperCase() + modificada.slice(1) + " " + array[1]
            }
        }
    };

    //console.log("Info Ata ", infoAta);
    //console.log("Prestacao  ", prestacaoDeContas);

    const getComportamentoPorStatus = () =>{
        if (prestacaoDeContas.status === 'NAO_RECEBIDA'){
            return (
                <>
                    <Cabecalho
                        prestacaoDeContas={prestacaoDeContas}
                        exibeSalvar={false}
                    />
                    <BotoesAvancarRetroceder
                        prestacaoDeContas={prestacaoDeContas}
                        textoBtnAvancar={"Receber"}
                        textoBtnRetroceder={"Reabrir PC"}
                        metodoAvancar={receberPrestacaoDeContas}
                        metodoRetroceder={()=>setShowReabrirPc(true)}
                        disabledBtnAvancar={!stateFormRecebimentoPelaDiretoria.data_recebimento}
                        disabledBtnRetroceder={false}
                    />
                    <TrilhaDeStatus
                        prestacaoDeContas={prestacaoDeContas}
                    />
                    <FormRecebimentoPelaDiretoria
                        handleChangeFormRecebimentoPelaDiretoria={handleChangeFormRecebimentoPelaDiretoria}
                        stateFormRecebimentoPelaDiretoria={stateFormRecebimentoPelaDiretoria}
                        tabelaPrestacoes={tabelaPrestacoes}
                        disabledNome={true}
                        disabledData={false}
                        disabledStatus={true}
                    />
                    <CobrancaPrestacaoDeContas
                        listaDeCobrancas={listaDeCobrancas}
                        dataCobranca={dataCobranca}
                        handleChangeDataCobranca={handleChangeDataCobranca}
                        addCobranca={addCobranca}
                        deleteCobranca={deleteCobranca}
                        editavel={true}
                        retornaNumeroOrdinal={retornaNumeroOrdinal}
                    />
                </>
            )
        }else if (prestacaoDeContas.status === 'RECEBIDA'){
            return (
                <>
                    <Cabecalho
                        prestacaoDeContas={prestacaoDeContas}
                        exibeSalvar={false}
                    />
                    <BotoesAvancarRetroceder
                        prestacaoDeContas={prestacaoDeContas}
                        textoBtnAvancar={"Analisar"}
                        textoBtnRetroceder={"Não recebida"}
                        metodoAvancar={analisarPrestacaoDeContas}
                        metodoRetroceder={()=>setShowNaoRecebida(true)}
                        disabledBtnAvancar={false}
                        disabledBtnRetroceder={false}
                    />
                    <TrilhaDeStatus
                        prestacaoDeContas={prestacaoDeContas}
                    />
                    <FormRecebimentoPelaDiretoria
                        handleChangeFormRecebimentoPelaDiretoria={handleChangeFormRecebimentoPelaDiretoria}
                        stateFormRecebimentoPelaDiretoria={stateFormRecebimentoPelaDiretoria}
                        tabelaPrestacoes={tabelaPrestacoes}
                        disabledNome={true}
                        disabledData={true}
                        disabledStatus={true}
                    />
                    <CobrancaPrestacaoDeContas
                        listaDeCobrancas={listaDeCobrancas}
                        dataCobranca={dataCobranca}
                        handleChangeDataCobranca={handleChangeDataCobranca}
                        addCobranca={addCobranca}
                        deleteCobranca={deleteCobranca}
                        editavel={false}
                        retornaNumeroOrdinal={retornaNumeroOrdinal}
                    />
                </>
            )

        }else if (prestacaoDeContas.status === 'EM_ANALISE') {
            return (
                <>
                    <Cabecalho
                        prestacaoDeContas={prestacaoDeContas}
                        exibeSalvar={true}
                        metodoSalvarAnalise={salvarAnalise}
                    />
                    <BotoesAvancarRetroceder
                        prestacaoDeContas={prestacaoDeContas}
                        textoBtnAvancar={"Concluir análise"}
                        textoBtnRetroceder={"Recebida"}
                        metodoAvancar={analisarPrestacaoDeContas}
                        metodoRetroceder={() => setShowRecebida(true)}
                        disabledBtnAvancar={false}
                        disabledBtnRetroceder={false}
                    />
                    <TrilhaDeStatus
                        prestacaoDeContas={prestacaoDeContas}
                    />
                    <FormRecebimentoPelaDiretoria
                        handleChangeFormRecebimentoPelaDiretoria={handleChangeFormRecebimentoPelaDiretoria}
                        stateFormRecebimentoPelaDiretoria={stateFormRecebimentoPelaDiretoria}
                        tabelaPrestacoes={tabelaPrestacoes}
                        disabledNome={true}
                        disabledData={true}
                        disabledStatus={true}
                    />
                    <DevolucoesPrestacaoDeContas
                        prestacaoDeContas={prestacaoDeContas}
                        retornaNumeroOrdinal={retornaNumeroOrdinal}
                    />
                    <InformacoesPrestacaoDeContas
                        handleChangeFormInformacoesPrestacaoDeContas={handleChangeFormInformacoesPrestacaoDeContas}
                        informacoesPrestacaoDeContas={informacoesPrestacaoDeContas}
                    />
                    <ResumoFinanceiroSeletorDeContas
                        infoAta={infoAta}
                        clickBtnEscolheConta={clickBtnEscolheConta}
                        toggleBtnEscolheConta={toggleBtnEscolheConta}
                        exibeAtaPorConta={exibeAtaPorConta}
                    />
                    <ResumoFinanceiroTabelaTotais
                        infoAta={infoAtaPorConta}
                        valorTemplate={valorTemplate}
                    />
                    <ResumoFinanceiroTabelaAcoes
                        infoAta={infoAtaPorConta}
                        valorTemplate={valorTemplate}
                        toggleBtnTabelaAcoes={toggleBtnTabelaAcoes}
                        clickBtnTabelaAcoes={clickBtnTabelaAcoes}
                    />
                    <AnalisesDeContaDaPrestacao
                        infoAta={infoAtaPorConta}
                        analisesDeContaDaPrestacao={analisesDeContaDaPrestacao}
                        handleChangeAnalisesDeContaDaPrestacao={handleChangeAnalisesDeContaDaPrestacao}
                        handleSubmitAnalisesDeContaDaPrestacao={handleSubmitAnalisesDeContaDaPrestacao}
                        getObjetoIndexAnalise={getObjetoIndexAnalise}
                    />

                </>
            )
        }
    };

    return(
        <PaginasContainer>
            <h1 className="titulo-itens-painel mt-5">Acompanhamento das Prestações de Contas</h1>
            <div className="page-content-inner">
                {!prestacao_conta_uuid ? (
                        <Redirect
                            to={{
                                pathname: `/dre-lista-prestacao-de-contas/`,
                            }}
                        />
                    ) :
                    <>
                        {getComportamentoPorStatus()}
                    </>
                }
                <section>
                    <ModalReabrirPc
                        show={showReabrirPc}
                        handleClose={onHandleClose}
                        onReabrirTrue={onReabrirTrue}
                        titulo="Reabrir período de Prestação de Contas"
                        texto="<p><strong>Atenção,</strong> a prestação de contas será reaberta para a Associação que poderá fazer alteração e precisará concluí-la novamente.</p>"
                        primeiroBotaoTexto="Cancelar"
                        primeiroBotaoCss="outline-success"
                        segundoBotaoCss="success"
                        segundoBotaoTexto="Confirmar"
                    />
                </section>
                <section>
                    <ModalNaoRecebida
                        show={showNaoRecebida}
                        handleClose={onHandleClose}
                        onReabrirTrue={onNaoRecebida}
                        titulo="Não receber Prestação de Contas"
                        texto="<p><strong>Atenção,</strong> a prestação de contas voltará para o status de Não recebida. As informações de recebimento serão perdidas. Confirma operação?</p>"
                        primeiroBotaoTexto="Cancelar"
                        primeiroBotaoCss="outline-success"
                        segundoBotaoCss="success"
                        segundoBotaoTexto="Confirmar"
                    />
                </section>
                <section>
                    <ModalRecebida
                        show={showRecebida}
                        handleClose={onHandleClose}
                        onReabrirTrue={onRecebida}
                        titulo="Receber Prestação de Contas"
                        texto="<p><strong>Atenção,</strong> a prestação de contas voltará para o status de Recebida. As informações de análise serão perdidas. Confirma operação?</p>"
                        primeiroBotaoTexto="Cancelar"
                        primeiroBotaoCss="outline-success"
                        segundoBotaoCss="success"
                        segundoBotaoTexto="Confirmar"
                    />
                </section>
                {redirectListaPc &&
                    <Redirect
                        to={{
                            pathname: `/dre-lista-prestacao-de-contas/${prestacaoDeContas.periodo_uuid}/${prestacaoDeContas.status}`,
                        }}
                    />
                }
            </div>
        </PaginasContainer>
    )
};