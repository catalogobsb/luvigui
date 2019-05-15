import React, { Component } from "react";

import MaterialTable from "material-table";
import "moment-timezone";
import Parse from "parse";
import Datetime from "react-datetime";
import withStyles from "@material-ui/core/styles/withStyles";
import moment from "moment";
import orange from "@material-ui/core/colors/orange";
import { Button } from "@material-ui/core";

const styles = theme => ({
  colorSwitchBase: {
    color: orange[300],
    "&$colorChecked": {
      color: orange[500],
      "& + $colorBar": {
        backgroundColor: orange[500]
      }
    }
  },
  colorBar: {},
  colorChecked: {},
  iOSSwitchBase: {
    "&$iOSChecked": {
      color: theme.palette.common.white,
      "& + $iOSBar": {
        backgroundColor: "#52d869"
      }
    },
    transition: theme.transitions.create("transform", {
      duration: theme.transitions.duration.shortest,
      easing: theme.transitions.easing.sharp
    })
  },
  iOSChecked: {
    transform: "translateX(15px)",
    "& + $iOSBar": {
      opacity: 1,
      border: "none"
    }
  },
  iOSBar: {
    borderRadius: 13,
    width: 42,
    height: 26,
    marginTop: -13,
    marginLeft: -21,
    border: "solid 1px",
    borderColor: theme.palette.grey[400],
    backgroundColor: theme.palette.grey[50],
    opacity: 1,
    transition: theme.transitions.create(["background-color", "border"])
  },
  iOSIcon: {
    width: 24,
    height: 24
  },
  iOSIconChecked: {
    boxShadow: theme.shadows[1]
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

class RelatoriosUnico extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      dataIn: null, dataFim:null,
      
      data: []
    };
  }
  componentDidMount = () => {
    //{ title: 'Nome', field: 'nome' },
    this.setState({ isLoading: true });
    const self = this;
    Parse.Cloud.run(this.props.endpoint).then(
      function(result) {
        console.log(self.props.title, result);
        self.setState({ isLoading: false });
        switch (self.props.title) {
          case "Faturamento":
            self.setState({ data: result.faturamento });
            break;
          case "Pedidos":
            self.setState({ data: result.pedidosMonth });
            break;
          case "Pedidos":
            self.setState({ data: result.pedidosMonth });
            break;
          case "Vendas":
            self.setState({ data: result.vendasMonth });
            break;
          default:
            self.setState({ data: [] });
        }
      },
      function(error) {
        // error
        self.setState({ isLoading: false });
        console.log(error);
      }
    );
  };
  handleClickOpen() {}
  doFilter(dataInState, dataFimState){
    const self = this;
    dataInState = moment(dataInState).format("YYYY-MM-DD")
    dataFimState = moment(dataFimState).format("YYYY-MM-DD")
    self.setState({ isLoading: true });
    Parse.Cloud.run(this.props.endpoint, {
      dateStart: dataInState,
      dateEnd: dataFimState
    }).then(
      function(result) {
        self.setState({ isLoading: false });
        switch (self.props.title) {
          case "Faturamento":
            self.setState({ data: result.faturamento });
            break;
          case "Pedidos":
            self.setState({ data: result.pedidosMonth });
            break;
          case "Pedidos":
            self.setState({ data: result.pedidosMonth });
            break;
          case "Vendas":
            self.setState({ data: result.vendasMonth });
            break;
          default:
            self.setState({ data: [] });
        }
      },
      function(error) {
        // error
        self.setState({ isLoading: false });
        console.log(error);
      }
    );


    console.log(dataInState, dataFimState)
  }
  render() {
    const { title, column } = this.props;
    console.log(this.props);
    const { data } = this.state;
    return (
      <div style={{ width: "100%", padding: "0 !important" }}>
       {this.props.title != "Faturamento" &&  <div style={{ display: "flex", marginBottom: "16px" }}>
          <div style={{ display: "content", margin: "0 6px" }}>
            <Datetime
              dateFormat="DD/MM/YYYY"
              timeFormat={false}
              value={this.state.dataIn}
              onChange={e => {
                this.setState({ dataIn: e });
              }}
              inputProps={{
                tabIndex: "1",
                style: { fontSize: "18px", opacity: "0.8" },
                placeholder: "Início"
              }}
            />
          </div>

          <div style={{ display: "content", margin: "0 6px" }}>
            <Datetime
              dateFormat="DD/MM/YYYY"
              timeFormat={false}
              value={this.state.dataFim}
              onChange={e => {
                this.setState({ dataFim: e });
              }}
              inputProps={{
                tabIndex: "1",
                style: { fontSize: "18px", opacity: "0.8" },
                placeholder: "Fim"
              }}
            />
          </div>
          <div style={{ display: "content" }}>
              <Button disabled={this.state.isLoading || !(this.state.dataIn && this.state.dataFim)} onClick={()=> this.doFilter(this.state.dataIn, this.state.dataFim)} fullWidth>Filtrar</Button>
          </div>
        </div> }

        <MaterialTable
          title={title}
          onRowClick={(event, rowData) => {
            console.log(rowData);
            // this.editing(rowData.nome, rowData.id, rowData.preco)
          }}
          style={{ width: "100%" }}
          isLoading={this.state.isLoading}
          options={{
            toolbar: true,
            emptyRowsWhenPaging: false,
            pageSize: 20
          }}
          localization={tableTranslation}
          columns={column}
          data={data}
        />
        {/* <pre>
                    {JSON.stringify(this.state, null, 2)}
                </pre> */}
      </div>
    );
  }
}

export default withStyles(styles)(RelatoriosUnico);
