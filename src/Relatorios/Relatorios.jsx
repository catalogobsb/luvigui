import React from "react";

// @material-ui/core components
import withStyles from "@material-ui/core/styles/withStyles";



import PropTypes from "prop-types";

import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import MuiExpansionPanelDetails from "@material-ui/core/ExpansionPanelDetails";
import Typography from "@material-ui/core/Typography";

import RelatoriosUnico from "./RelatoriosUnico/RelatoriosUnico";
import { Card } from "@material-ui/core";




function TabContainer(props) {
  return (
    <Typography component="div" style={{ padding: 8 * 3 }}>
      {props.children}
    </Typography>
  );
}

TabContainer.propTypes = {
  children: PropTypes.node.isRequired
};

const styles = theme => ({
  root: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.paper,
    borderBottom: "1px solid #e8e8e8",
    color: "black"
  },
  tabsRoot: {
    borderBottom: "1px solid #e8e8e8",
    color: "black"
  },
  tabsIndicator: {
    backgroundColor: "#f26522"
  },
  button: {
    textPrimary: "#f26522"
  },
  tabRoot: {
    textTransform: "initial",
    minWidth: 72,
    fontWeight: theme.typography.fontWeightRegular,
    marginRight: theme.spacing.unit * 4,
    fontFamily: [
      "-apple-system",
      "BlinkMacSystemFont",
      '"Segoe UI"',
      "Roboto",
      '"Helvetica Neue"',
      "Arial",
      "sans-serif",
      '"Apple Color Emoji"',
      '"Segoe UI Emoji"',
      '"Segoe UI Symbol"'
    ].join(","),
    "&:hover": {
      color: "#40a9ff",
      opacity: 1
    },
    "&$tabSelected": {
      color: "#1890ff",
      fontWeight: theme.typography.fontWeightMedium
    },
    "&:focus": {
      color: "#40a9ff"
    }
  },
  tabSelected: {},
  typography: {
    padding: theme.spacing.unit * 3
  }
});
const tableTranslation = {
  pagination: {
      labelDisplayedRows: '{from}-{to} de {count}', // {from}-{to} of {count}
      labelRowsPerPage: 'Exibir:', // Rows per page:
      firstAriaLabel: 'Primeira Página', // First Page
      firstTooltip: 'Primeira Página', // First Page
      previousAriaLabel: 'Página Anterior', // Previous Page
      previousTooltip: 'Página Anterior', // Previous Page
      nextAriaLabel: 'Próxima Página', // Next Page
      nextTooltip: 'Próxima Página', // Next Page
      lastAriaLabel: 'Última Página', // Last Page
      lastTooltip: 'Última Página', // Last Page
  },
  toolbar: {
      nRowsSelected: '{0} registro(s) selecionados', // {0} row(s) selected
      showColumnsTitle: 'Mostrar Colunas', // Show Columns
      showColumnsAriaLabel: 'Mostrar Colunas', // Show Columns
      exportTitle: 'Exportar', // Export
      exportAriaLabel: 'Exportar', // Export
      exportName: 'Exportar como CSV', // Export as CSV
      searchTooltip: 'Filtrar', // Search
  },
  header: {
      actions: 'Ações', // Actions
  },
  body: {
      emptyDataSourceMessage: 'Não há registros', // No records to display
      filterRow: {
          filterTooltip: 'Filtrar', // Filter
      },
  }
}

class Relatorios extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: 0
    };
  }
  componentDidMount() {}
  handleChange = (event, value) => {
    this.setState({ value });
  };
  handleChangePanel = panel => (event, expanded) => {
    this.setState({
      expanded: expanded ? panel : false
    });
  };

  render() {
    const { classes } = this.props;
    return (
      <div>
        <Card style={{ marginTop: "-24px" }}>
          <Tabs
            classes={{
              root: classes.tabsRoot,
              indicator: classes.tabsIndicator
            }}
            color="primary"
            centered
            value={this.state.value}
            onChange={this.handleChange}
          >
            <Tab label="Faturamento" />
            <Tab label="Produtos" />
            <Tab label="Vendas" />
            <Tab label="Clientes" />
          </Tabs>
          
          {this.state.value === 0 && (
            <TabContainer>
              {/* <Categorias /> */}
              <RelatoriosUnico
            
                endpoint="relatoriofaturamento"
                title="Faturamento"
                column={[
                  { title: "Mês", field: "mes" },
                  { title: "Lucro", field: "lucro" },
                  { title: "Arrecadado", field: "venda" },
                  { title: "Custo", field: "custo" },
                  { title: "Entrega", field: "entrega" },
                  { title: "Ticket Médio", field: "ticketMedio" },
                ]}
              />
            </TabContainer>
          )}
          {this.state.value === 1 && (
            <TabContainer>
              {/* <Categorias /> */}
              <RelatoriosUnico
            
                endpoint="relatorioprodutos"
                title="Produtos"
                column={[
                  { title: "Nome", field: "nome" },
                  { title: "Qtd", field: "qtd" },
                  { title: "Vendas", field: "venda" },
                  { title: "Custo", field: "custo" },
                  { title: "Lucro", field: "lucro" }
                ]}
              />
            </TabContainer>
          )}
          {this.state.value === 3 && (
            <TabContainer>
              <RelatoriosUnico
            
                endpoint="relatoriopedidoscliente"
                title="Pedidos"
                column={[
                  { title: "Cliente", field: "cliente" },
                  { title: "Qtd Pedidos", field: "qtd" },
                  { title: "Total", field: "total" }
                ]}
              />
            </TabContainer>
          )}

          {this.state.value === 2 && (
            <TabContainer>
              <RelatoriosUnico
            
                endpoint="relatoriovendas"
                title="Vendas"
                column={[
                  { title: "Cliente", field: "cliente" },
                  { title: "Total", field: "total" },
                  { title: "Forma Pgto", field: "forma_pagamento" },
                  { title: "Data", field: "data" }
                ]}
              />
            </TabContainer>
          )}
        </Card>
      </div>
    );
  }
}

export default withStyles(styles)(Relatorios);
