import React from "react";

export const TopoComBotoes = ({handleClickCadastrarDespesa}) => {

    return (
        <div className="row">
            <div className='col-12 col-md-5 mt-2'>
                <p className='detalhe-das-prestacoes-titulo'>Demonstrativo financeiro da conta cheque</p>
            </div>

            <div className='col-12 col-md-7 text-right'>
                <button onClick={handleClickCadastrarDespesa} type="button" className="btn btn-outline-success mr-2 mt-2"><strong>Cadastrar despesa</strong></button>
                <button type="button" className="btn btn-outline-success mr-2 mt-2"><strong>Cancelar</strong></button>
                <button type="button" className="btn btn-outline-success mt-2"><strong>Salvar</strong></button>
                <button disabled="" type="button" className="btn btn-success btn-readonly ml-2 mt-2"><strong>Concluir a conciliação</strong></button>
            </div>
        </div>
    );
}