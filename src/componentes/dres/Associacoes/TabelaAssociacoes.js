import React from "react";
import {Column} from "primereact/column";
import {DataTable} from "primereact/datatable";

export const TabelaAssociacoes = ({associacoes, rowsPerPage, unidadeEscolarTemplate, acoesTemplate}) =>{
  return(
      <DataTable
          value={associacoes}
          className="mt-3 container-tabela-associacoes"
          paginator={associacoes.length > rowsPerPage}
          rows={rowsPerPage}
          paginatorTemplate="PrevPageLink PageLinks NextPageLink"
          autoLayout={true}
          selectionMode="single"
      >
          <Column field="unidade.codigo_eol" header="Código Eol" />
          <Column
              field="unidade.nome_com_tipo"
              header="Unidade escolar"
              body={unidadeEscolarTemplate}
          />
          <Column
              field="uuid"
              header="Ações"
              body={acoesTemplate}
          />
      </DataTable>
  );
};