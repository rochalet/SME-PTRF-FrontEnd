import React from "react";
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';

export const TabelaValoresReprogramados = ({
    listaDeValoresReprogramados,
    rowsPerPage,
    valorTemplateCheque, 
    valorTemplateCartao,
    statusTemplate,
    acoesTemplate
}) => {

    return(
        <DataTable
            value={listaDeValoresReprogramados}
            rows={rowsPerPage}
            paginator={listaDeValoresReprogramados.length > rowsPerPage}
            paginatorTemplate="PrevPageLink PageLinks NextPageLink"
        >
            <Column field="associacao.unidade.codigo_eol" header="Código Eol" style={{width: '11%'}}/>
            <Column 
                field="associacao.unidade.nome_com_tipo" 
                header="Nome da unidade" 
                style={{width: '29%'}}
            />
            <Column field="periodo.referencia" header="Período" style={{width: '8%'}}/>
            <Column 
                field="total_conta_um" 
                header="Saldo Cheque" 
                body={valorTemplateCheque} 
                style={{width: '14%'}}
            />
            <Column 
                field="total_conta_dois" 
                header="Saldo Cartão" 
                body={valorTemplateCartao} 
                style={{width: '14%'}}
            />
            <Column 
                field="associacao.status_valores_reprogramados" 
                header="Status" 
                body={statusTemplate} 
                style={{width: '17%'}}
            />
            <Column field="" header="Ações" body={acoesTemplate} style={{width: '7%'}}/>
            
        </DataTable>
    )
}