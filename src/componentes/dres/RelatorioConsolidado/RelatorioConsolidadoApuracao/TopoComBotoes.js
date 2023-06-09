import React from "react";

export const TopoComBotoes = ({periodoNome, contaNome}) =>{
    return(
        <>
            <div className="d-flex bd-highlight mb-3">
                <div className="py-2 flex-grow-1 bd-highlight"><h4 className='pl-0'>Período {periodoNome} | Conta {contaNome}</h4></div>
                <div className="py-2 bd-highlight">
                    <button onClick={()=>window.location.assign('/dre-relatorio-consolidado')} className="btn btn-outline-success">Voltar</button>
                </div>
            </div>
        </>
    )
};