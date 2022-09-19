import React, {memo, useEffect, useRef, useState} from "react";
import DevolverParaAcertos from "./DevolverParaAcertos";
import { RelatorioDosAcertos } from "./RelatorioDosAcertos";
import ExibeAcertosEmLancamentosEDocumentosPorConta from "../../../../Globais/ExibeAcertosEmLancamentosEDocumentosPorConta";
import {MsgImgCentralizada} from "../../../../Globais/Mensagens/MsgImgCentralizada";
import Img404 from "../../../../../assets/img/img-404.svg";
import CardsDevolucoesParaAcertoDaDre from "../../../../Globais/CardsDevolucoesParaAcertoDaDre";

const TabsConferenciaAtualHistorico = ({dataLimiteDevolucao, handleChangeDataLimiteDevolucao, prestacao_conta_uuid, analiseAtualUuid, exibeMsg, textoMsg, totalAnalisesDePcDevolvidas, setAnaliseAtualUuidComPCAnaliseAtualUuid, setPrimeiraAnalisePcDevolvida, setAnaliseAtualUuid, editavel, pcEmAnalise}) =>{

    const ref_click_historico = useRef(null);

    // Necessário para controlar quando o ref_click_historico.current.click() é disparado
    const [permitirTriggerOnclick, setPermitirTriggerOnclick] = useState(true)

    useEffect(()=>{
        // Necessário para forçar o re-render quando analiseAtualUuid for alterado
        if (analiseAtualUuid){}

        if (totalAnalisesDePcDevolvidas > 0 && !pcEmAnalise && permitirTriggerOnclick){
            if (ref_click_historico){
                ref_click_historico.current.click();
            }
        }
    }, [totalAnalisesDePcDevolvidas, analiseAtualUuid, pcEmAnalise, permitirTriggerOnclick])

    return(
        <>
            <nav>
                <div className="nav nav-tabs mb-3 tabs-resumo-dos-acertos" id="nav-tab-conferencia-de-lancamentos" role="tablist">      
                    { pcEmAnalise &&
                        <a
                            onClick={setAnaliseAtualUuidComPCAnaliseAtualUuid}
                            className="nav-link btn-escolhe-acao active"
                            id="nav-conferencia-atual-tab" data-toggle="tab"
                            href="#nav-conferencia-atual"
                            role="tab"
                            aria-controls="nav-conferencia-atual"
                            aria-selected="true"
                        >
                            Conferência atual
                        </a>
                    }
                    {totalAnalisesDePcDevolvidas > 0 &&
                        <a
                            onClick={setPrimeiraAnalisePcDevolvida}
                            className={`nav-link btn-escolhe-acao ${pcEmAnalise === false ? 'active' : ''}`}
                            id="nav-historico-tab"
                            data-toggle="tab"
                            href="#nav-historico"
                            role="tab"
                            aria-controls="nav-historico"
                            aria-selected={pcEmAnalise === false ? 'true' : 'false'}
                            ref={ref_click_historico}
                        >
                            Histórico
                        </a>
                    }
                </div>
            </nav>
            <div className="tab-content" id="nav-tabContent">
                <div className={`tab-pane fade ${pcEmAnalise ? 'show active' : ''}`} id="nav-conferencia-atual" role="tabpanel" aria-labelledby="nav-conferencia-atual-tab">
                    {exibeMsg ? (
                            <MsgImgCentralizada
                                texto={textoMsg}
                                img={Img404}
                            />
                    ):
                        <>
                            <DevolverParaAcertos
                                dataLimiteDevolucao={dataLimiteDevolucao}
                                handleChangeDataLimiteDevolucao={handleChangeDataLimiteDevolucao}
                                editavel={editavel}
                            />
                            <ExibeAcertosEmLancamentosEDocumentosPorConta
                                prestacaoDeContasUuid={prestacao_conta_uuid}
                                analiseAtualUuid={analiseAtualUuid}
                                editavel={editavel}
                            />

                            <RelatorioDosAcertos
                                prestacaoDeContasUuid={prestacao_conta_uuid}
                                analiseAtualUuid={analiseAtualUuid}
                                podeGerarPrevia={true}
                            />
                        </>
                    }
                </div>
                <div className={`tab-pane fade ${pcEmAnalise === false ? 'show active' : ''}`} id="nav-historico" role="tabpanel" aria-labelledby="nav-historico-tab">
                    <>
                        <CardsDevolucoesParaAcertoDaDre
                            prestacao_conta_uuid={prestacao_conta_uuid}
                            setAnaliseAtualUuid={setAnaliseAtualUuid}
                            analiseAtualUuid={analiseAtualUuid}
                            setPermitirTriggerOnclick={setPermitirTriggerOnclick}
                        />

                        <ExibeAcertosEmLancamentosEDocumentosPorConta
                            prestacaoDeContasUuid={prestacao_conta_uuid}
                            analiseAtualUuid={analiseAtualUuid}
                            editavel={editavel}
                        />

                        <RelatorioDosAcertos
                            prestacaoDeContasUuid={prestacao_conta_uuid}
                            analiseAtualUuid={analiseAtualUuid}
                            podeGerarPrevia={false}
                        />
                    </>

                </div>
            </div>
        </>
    )
}
export default memo(TabsConferenciaAtualHistorico)