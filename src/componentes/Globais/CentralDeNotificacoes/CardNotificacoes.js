import React, {Fragment} from "react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faChevronUp, faChevronDown, faUser} from "@fortawesome/free-solid-svg-icons";

export const CardNotificacoes = ({toggleBtnNotificacoes, clickBtnNotificacoes}) => {


    const notificacoes = [{
            data:"Hoje, 10 Ago. 2020",
            infos: [
                {
                uuid:"28b3422a",
                tipo: "urgente",
                titulo: "Documentos faltantes na prestação de contas",
                remetente: "DRE",
                categoria: "Prestação de Contas",
                descricao: "A prestação de contas foi recebida pela Diretoria Regional de Educação Ipiranga, porém o Demonstrativo Financeiro do PTRF não consta no SEI. A prestação foi devolvida para acertos.",
            },
            {
                uuid:"-3b33-",
                tipo: "informacao",
                titulo: "Atualização do Sig_Escola realizada. Versão 2.02.111.01",
                remetente: "2 - DRE",
                categoria: "2 - Prestação de Contas",
                descricao: "2 - A prestação de contas foi recebida pela Diretoria Regional de Educação Ipiranga, porém o Demonstrativo Financeiro do PTRF não consta no SEI. A prestação foi devolvida para acertos.",
            }
            ],
        },
        {
            data:"Quarta, 05 Ago. 2020",
            infos: [
                {
                    uuid: "48c9-8af5",
                    tipo: "aviso",
                    titulo: "O repasse no ano 2021 será feito em parcela única",
                    remetente: "3 - DRE",
                    categoria: "3 - Prestação de Contas",
                    descricao: "3 - A prestação de contas foi recebida pela Diretoria Regional de Educação Ipiranga, porém o Demonstrativo Financeiro do PTRF não consta no SEI. A prestação foi devolvida para acertos.",
                },
                {
                    uuid:"-d6d78e",
                    tipo: "alerta",
                    titulo: "Nova funcionalidade no Resumo de Recursos",
                    remetente: "4 - DRE",
                    categoria: "4 - Prestação de Contas",
                    descricao: "4 - A prestação de contas foi recebida pela Diretoria Regional de Educação Ipiranga, porém o Demonstrativo Financeiro do PTRF não consta no SEI. A prestação foi devolvida para acertos.",
                },
                {
                    uuid: "7faf31",
                    tipo: "urgente",
                    titulo: "Último dia para o fechamento do período de prestação de contas",
                    remetente: "5 - DRE",
                    categoria: "5 - Prestação de Contas",
                    descricao: "5 - A prestação de contas foi recebida pela Diretoria Regional de Educação Ipiranga, porém o Demonstrativo Financeiro do PTRF não consta no SEI. A prestação foi devolvida para acertos.",
                }
            ],
        },
        {
            data:"Sexta, 31 Jul. 2020",
            infos: [
                {
                    uuid: "48c9-8af5z",
                    tipo: "aviso",
                    titulo: "O repasse no ano 2021 será feito em parcela única",
                    remetente: "3 - DRE",
                    categoria: "3 - Prestação de Contas",
                    descricao: "3 - A prestação de contas foi recebida pela Diretoria Regional de Educação Ipiranga, porém o Demonstrativo Financeiro do PTRF não consta no SEI. A prestação foi devolvida para acertos.",
                },

            ],
        }
    ];

    console.log("Notificacoes ", notificacoes)

    return (
        <>
            <div className="accordion mt-1" id="accordionNotificacoes">

                <h1>{notificacoes.data}</h1>

                {notificacoes && notificacoes && notificacoes.length > 0 && notificacoes.map((notificacao, index)=>
                    <Fragment key={index}>

                        <p className="data-notificacoes mt-3">{notificacao.data}</p>

                        {notificacao.infos && notificacao.infos.length > 0 && notificacao.infos.map((info, index)=>

                            <div className="card mt-3" key={info.uuid}>
                                <div className={`card-header card-tipo-${info.tipo}`} id={`heading_${info.uuid}`}>

                                    <div className="row">
                                        <div className="col-11">

                                            <div className="row">
                                                <div className="col-md-3 col-xl-2 align-self-center">
                                                    <span className={`span-tipo-${info.tipo}`}>{info.tipo}</span>
                                                </div>
                                                <div className="col-md-9 col-xl-10">
                                                    <p className="mb-0 titulo-notificacao">{info.titulo}</p>
                                                    <p className="mb-0"><span className="remetente-categoria"><FontAwesomeIcon style={{marginRight: "3px", color: '#7D7D7D'}} icon={faUser}/>Remetente: {info.remetente}</span> | <span className="remetente-categoria">Categoria: {info.categoria}</span></p>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-1">
                                            <button
                                                onClick={() => toggleBtnNotificacoes(info.uuid)}
                                                className="btn btn-link btn-block text-left px-0" type="button"
                                                data-toggle="collapse" data-target={`#collapse_${info.uuid}`}
                                                aria-expanded="true" aria-controls={`collapse_${info.uuid}`}
                                            >
                                                <span className='span-icone-toogle'>
                                                    <FontAwesomeIcon
                                                        style={{marginRight: "0", color: 'black'}}
                                                        icon={clickBtnNotificacoes[info.uuid] ? faChevronUp : faChevronDown}
                                                    />
                                                </span>
                                            </button>
                                        </div>
                                    </div>

                                </div>

                                <div id={`collapse_${info.uuid}`} className="collapse" aria-labelledby="headingOne" data-parent="#accordionNotificacoes">
                                    <div className="card-body">
                                        {info.descricao}
                                    </div>
                                </div>
                            </div>

                        )}
                    </Fragment>
                )}
            </div>
        </>
    );
};