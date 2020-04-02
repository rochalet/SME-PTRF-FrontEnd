import React from "react";
import {Route, Switch} from 'react-router-dom'
import {Login} from "../paginas/Login";
import {Pagina404} from "../paginas/404";
import {Dashboard} from "../paginas/Dashboard";
import {CadastroDeDespesa} from "../paginas/Despesas/CadastroDeDespesa";
import {EdicaoDeDespesa} from "../paginas/Despesas/EdicaoDeDespesa";
import { ListaDeDespesasPage } from '../paginas/Despesas/ListaDeDespesas'
import { CadastroDeReceita } from '../paginas/Receitas/CadastroReceita';
import {ListaDeReceitasPage} from "../paginas/Receitas/ListaDeReceitas";

export const Rotas = () => {
    return(
        <Switch>
            <Route path="/login" component={Login}/>
            <Route path="/dashboard" component={Dashboard}/>
            <Route path="/cadastro-de-despesa" component={CadastroDeDespesa}/>
            <Route path="/edicao-de-despesa/:associacao?" component={EdicaoDeDespesa}/>
            <Route path="/lista-de-despesas" component={ListaDeDespesasPage} />
            <Route path="/cadastro-de-credito" render={props => <CadastroDeReceita {...props} />}/>
            <Route path="/lista-de-receitas" component={ListaDeReceitasPage}/>
            <Route path="*" component={Pagina404}/>
        </Switch>
    )
}

