import React, { Component } from "react";
import GridContainer from "./Grid/GridContainer.jsx";
import GridItem from "./Grid/GridItem.jsx";
import LoadingSpinner from "./LoadingSpinner.jsx";
import Card from "./Card/Card";
import CardIcon from "./Card/CardIcon";
import CardText from "./Card/CardText";
import CardFooter from "./Card/CardFooter";
import CardBody from "./Card/CardBody";
import CardHeader from "./Card/CardHeader";
import { Icon } from "@material-ui/core";
import { Doughnut, Line } from "react-chartjs-2";
import withStyles from "@material-ui/core/styles/withStyles";
import PropTypes from "prop-types";
import dashboardStyle from "./assets/jss/material-dashboard-pro-react/views/dashboardStyle";
import Parse from "parse";
import moment from 'moment';

function numberToReal(numero) {
  try {
    if (numero == 0) return "R$ 0,00";
    var numero = numero.toFixed(2).split(".");
    numero[0] = "R$ " + numero[0].split(/(?=(?:...)*$)/).join(".");
    return numero.join(",");
  } catch (err) {
    return "R$ 0,00";
  }
}

const dataFaturamento = {
  labels: ["11/03", "12/03", "13/03", "14/03", "15/03", "16/03", "17/03"],
  datasets: [
    {
      label: "Faturamento (R$)",
      fill: false,
      lineTension: 0.1,
      backgroundColor: "rgba(75,192,192,0.4)",
      borderColor: "rgba(75,192,192,1)",
      borderCapStyle: "butt",
      borderDash: [],
      borderDashOffset: 0.0,
      borderJoinStyle: "miter",
      pointBorderColor: "rgba(75,192,192,1)",
      pointBackgroundColor: "#fff",
      pointBorderWidth: 1,
      pointHoverRadius: 5,
      pointHoverBackgroundColor: "rgba(75,192,192,1)",
      pointHoverBorderColor: "rgba(220,220,220,1)",
      pointHoverBorderWidth: 2,
      pointRadius: 1,
      pointHitRadius: 10,
      data: [65, 59, 80, 81, 56, 55, 40]
    }
  ]
};

const data = {
  labels: ["Dinheiro", "Ticket", "Cartão"],
  datasets: [
    {
      data: [300, 50, 100],
      backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56"],
      hoverBackgroundColor: ["#FF6384", "#36A2EB", "#FFCE56"]
    }
  ]
};

const dataPlataformas = {
  labels: ["Android", "iOS"],
  datasets: [
    {
      data: [90, 10],
      backgroundColor: ["#FF6384", "#36A2EB"],
      hoverBackgroundColor: ["#FF6384", "#36A2EB"]
    }
  ]
};

function empurra(array, indice, item){
  indice++;
  const newArray = [];
  for (let i=0; i< indice; i++){
    newArray.push(array[i])
  }
  newArray.push(item);
  for (let i=indice; i< array.length; i++){
    newArray.push(array[i])
  }
  return newArray;

}
var mapData = {
  AU: 760,
  BR: 550,
  CA: 120,
  DE: 1300,
  FR: 540,
  GB: 690,
  GE: 200,
  IN: 200,
  RO: 600,
  RU: 300,
  US: 2920
};

function stringToMoment(str){
  return moment(str, 'YYYY-MM-DD')
}
class Dashboard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      topClientes: [],
      topBairros: [],
      topProdutos: []
    };
  }
  load() {
    let self = this;
    self.setState({ isLoadingGraficos: true, isLoading: true });
    Parse.Cloud.run("dashboard").then(
      function(result) {
        var faturamento7dias = result.faturamento7dias;
        var faturamentoHoje = result.faturamentoHoje;
        var faturamentoMes = result.faturamentoMes;
        var pedidos7Dias = result.pedidos7Dias;
        var pedidosAbertos = result.pedidosAbertos;
        var pedidosMes = result.pedidosMes;
        var users = result.users;
        var usersToday = result.usersToday;
        var pedidosCancelados = result.pedidosCancelados;
        var pedidosCanceladosHoje = result.pedidosCanceladosHoje;

        self.setState({
          usersToday,
          pedidosCancelados,
          pedidosCanceladosHoje,
          faturamento7dias,
          faturamentoHoje,
          faturamentoMes,
          pedidos7Dias,
          pedidosAbertos,
          pedidosMes,
          users,
          isLoading: false
        });
      },
      function(error) {
        // error
        console.log(error);
        self.setState({ isLoading: false });
      }
    );
    Parse.Cloud.run("graficos").then(
      function(result) {
        console.log("foi");
        console.log("result :" + JSON.stringify(result));
        var topClientes = [];
        result.topClientes.forEach(cliente => {
          const c = {
            nome: cliente.nome,
            qtd: cliente.qtd,
            vendas: numberToReal(cliente.total)
          };
          topClientes.push(c);
        });

        var topPagamentos = [];
        result.pagamentos.forEach(el => {
          const c = {
            nome: el.nome,
            qtd: el.qtd,
            vendas: numberToReal(el.total)
          };
          topPagamentos.push(c);
        });

        var topBairros = [];
        result.topBairros.forEach(el => {
          const c = {
            nome: el.nome,
            qtd: el.qtd,
            vendas: numberToReal(el.total)
          };
          topBairros.push(c);
        });

        var topProdutos = [];
        result.topProdutos.forEach(el => {
          const c = {
            nome: el.nome,
            qtd: el.qtd,
            vendas: numberToReal(el.total)
          };
          topProdutos.push(c);
        });

        var pagamentos = [];

        var achou = false;
        result.pagamentos.forEach(el => {
          if (el.nome == "Dinheiro") {
            pagamentos.push(el.total);
            achou = true;
          }
        });
        if (!achou) pagamentos.push(0);

        achou = false;
        result.pagamentos.forEach(el => {
          if (el.nome == "Ticket") {
            pagamentos.push(el.total);
            achou = true;
          }
        });
        if (!achou) pagamentos.push(0);

        achou = false;
        result.pagamentos.forEach(el => {
          if (el.nome == "Cartão") {
            pagamentos.push(el.total);
            achou = true;
          }
        });
        if (!achou) pagamentos.push(0);

        var faturamento = [];
        var faturamentoData = [];
        // for (let i =0; i<result.faturamento.length; i++){
         
        //   if (i<result.faturamento.length-1){
        //     const currentDate = stringToMoment(result.faturamento[i].data);
        //     const nextDate = stringToMoment(result.faturamento[i+1].data);
        //     const diffDays = currentDate.diff(nextDate,'days');
        //     console.log("dif", diffDays)
        //     if (diffDays< -1){
        //       const newDate = currentDate.add(1,'days').format('YYYY-MM-DD')
        //       result.faturamento = empurra(result.faturamento, i, {data:newDate, valor: 0 });
        //     }
        //   }
        // }
        result.faturamento.forEach(el => {
          var newData = el.data.slice(-2) + "/" + el.data.slice(-5, -3);
          faturamentoData.push(newData);
          faturamento.push(el.valor);
        });

        const pagamentoGraf = {
          labels: ["Dinheiro", "Ticket", "Cartão"],
          datasets: [
            {
              data: pagamentos,
              backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56"],
              hoverBackgroundColor: ["#FF6384", "#36A2EB", "#FFCE56"]
            }
          ]
        };

        const faturamentoGraf = {
          labels: faturamentoData,
          datasets: [
            {
              label: "Faturamento (R$)",
              fill: false,
              lineTension: 0.8,
              backgroundColor: "rgba(75,192,192,0.4)",
              borderColor: "rgba(75,192,192,1)",
              borderCapStyle: "butt",
              borderDash: [],
              borderDashOffset: 0.0,
              borderJoinStyle: "miter",
              pointBorderColor: "rgba(75,192,192,1)",
              pointBackgroundColor: "#fff",
              pointBorderWidth: 1,
              pointHoverRadius: 5,
              pointHoverBackgroundColor: "rgba(75,192,192,1)",
              pointHoverBorderColor: "rgba(220,220,220,1)",
              pointHoverBorderWidth: 2,
              pointRadius: 1,
              pointHitRadius: 10,
              data: faturamento
            }
          ]
        };

        self.setState({
          isLoadingGraficos: false,
          faturamento: faturamentoGraf,
          pagamentoGraf,
          topProdutos,
          topPagamentos,
          topClientes,
          topBairros
        });
      },
      function(error) {
        // error
        console.log(error);
        self.setState({ isLoadingGraficos: false });
      }
    );
  }
  componentDidMount() {
    const app = this.props.app;
    Parse.initialize(app.appId, app.jsKey);
    Parse.serverURL = app.server_url;
    this.setState({ isLoading: true, errorMsg: "" });
    Parse.User.logIn("admin@admin.com", "luviguipw2019").then(user => {
      this.setState({ isLoading: false });
      const token = JSON.parse(JSON.stringify(user)).sessionToken;
      console.log("tokenApp", token);
      this.load();
    });
  }

  render() {
    const { classes } = this.props;
    return (
      <div>
        {this.state.isLoading || this.state.isLoadingGraficos ? (
          <LoadingSpinner />
        ) : (
          <GridContainer>
            <GridItem xs={12} sm={6} md={6} lg={3}>
              <Card>
                <CardHeader color="success" stats icon>
                  <CardIcon color="success">
                    <Icon>attach_money</Icon>
                  </CardIcon>
                  <br />
                  <div className={classes.cardCategory}>
                    <h3 className={classes.cardTitle}>Faturamento</h3>
                  </div>
                </CardHeader>
                <CardFooter stats>
                  <div style={{ display: "blocks" }}>
                    <p className={classes.cardCategory}>
                      Hoje: {numberToReal(this.state.faturamentoHoje)}
                    </p>
                    <br />
                    <p
                      className={classes.cardCategory2}
                      style={{ paddingTop: "0px !important" }}
                    >
                      Últimos 7 dias:{" "}
                      {numberToReal(this.state.faturamento7dias)}
                    </p>
                    <br />
                    <p
                      className={classes.cardCategory2}
                      style={{ paddingTop: "0px !important" }}
                    >
                      Mês: {numberToReal(this.state.faturamentoMes)}
                    </p>
                  </div>
                </CardFooter>
              </Card>
            </GridItem>
            <GridItem xs={12} sm={6} md={6} lg={3}>
              <Card>
                <CardHeader color="warning" stats icon>
                  <CardIcon color="warning">
                    <Icon>shopping_basket</Icon>
                  </CardIcon>
                  <br />
                  <div className={classes.cardCategory}>
                    <h3 className={classes.cardTitle}>Pedidos</h3>
                  </div>
                </CardHeader>
                <CardFooter stats>
                  <div style={{ display: "blocks" }}>
                    <p className={classes.cardCategory}>
                      Hoje: {this.state.pedidosHoje}
                    </p>
                    <br />
                    <p
                      className={classes.cardCategory2}
                      style={{ paddingTop: "0px !important" }}
                    >
                      Últimos 7 dias: {this.state.pedidos7Dias}
                    </p>
                    <br />
                    <p
                      className={classes.cardCategory2}
                      style={{ paddingTop: "0px !important" }}
                    >
                      Abertos: {this.state.pedidosAbertos}
                    </p>
                  </div>
                </CardFooter>
              </Card>
            </GridItem>
            <GridItem xs={12} sm={6} md={6} lg={3}>
              <Card>
                <CardHeader color="danger" stats icon>
                  <CardIcon color="danger">
                    <Icon>info_outline</Icon>
                  </CardIcon>
                  <br />
                  <div className={classes.cardCategory}>
                    <h3 className={classes.cardTitle}>Pedidos Cancelados</h3>
                  </div>
                </CardHeader>
                <CardFooter stats>
                  <div style={{ display: "blocks" }}>
                    <p className={classes.cardCategory}>
                      Total: {this.state.pedidosCancelados}
                    </p>
                    <br />
                    <p className={classes.cardCategory2}>
                      Hoje: {this.state.pedidosCanceladosHoje}
                    </p>
                    <br />
                  </div>
                </CardFooter>
              </Card>
            </GridItem>
            <GridItem xs={12} sm={6} md={6} lg={3}>
              <Card>
                <CardHeader color="info" stats icon>
                  <CardIcon color="info">
                    <Icon>person</Icon>
                  </CardIcon>
                  <br />
                  <div className={classes.cardCategory}>
                    <h3 className={classes.cardTitle}>Usuários</h3>
                  </div>
                </CardHeader>
                <CardFooter stats>
                  <div style={{ display: "blocks" }}>
                    <p className={classes.cardCategory}>
                      Total: {this.state.users}
                    </p>
                    <br />
                    <p className={classes.cardCategory2}>
                      Novos Usuários (Hoje): {this.state.usersToday}
                    </p>
                    <br />
                  </div>
                </CardFooter>
              </Card>
            </GridItem>
            <GridItem xs={12} sm={6} md={6} lg={3}>
              <Card>
                <CardHeader />
                <CardBody>
                  <h4 style={{ marginTop: "-18px" }}>Top 10 Clientes</h4>
                  <table
                    cellspacing="10"
                    style={{
                      width: "100%",
                      marginTop: "16px",
                      borderCollapse: "collapse"
                    }}
                  >
                    <thead>
                      <tr
                        style={{
                          borderBottom: "1px solid #d0d0d0",
                          height: "40px"
                        }}
                      >
                        <th
                          style={{
                            padding: "0 12px 0 0",
                            textAlign: "start",
                            color: "#ff9600"
                          }}
                        >
                          Nome
                        </th>
                        <th
                          style={{
                            padding: "0 12px 0 0",
                            textAlign: "start",
                            color: "#ff9600"
                          }}
                        >
                          Qtd
                        </th>
                        <th
                          style={{
                            padding: "0 12px 0 0",
                            textAlign: "start",
                            minWidth: "90px",
                            color: "#ff9600"
                          }}
                        >
                          Vendas
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {this.state.topClientes.map(pp => (
                        <tr
                          style={{
                            borderBottom: "1px solid #d0d0d0",
                            height: "40px"
                          }}
                        >
                          <td
                            style={{
                              textAlign: "start",
                              padding: "0 12px 0 0"
                            }}
                          >
                            {pp.nome}
                          </td>
                          <td>
                            <span>
                              {pp.qtd}
                              <br />
                            </span>
                          </td>
                          <td style={{ minWidth: "90px" }}>{pp.vendas}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </CardBody>
              </Card>
            </GridItem>
            <GridItem xs={12} sm={6} md={6} lg={3}>
              <Card>
                <CardHeader />
                <CardBody>
                  <h4 style={{ marginTop: "-18px" }}>Top 10 Produtos</h4>
                  <table
                    cellspacing="10"
                    style={{
                      width: "100%",
                      marginTop: "16px",
                      borderCollapse: "collapse"
                    }}
                  >
                    <thead>
                      <tr
                        style={{
                          borderBottom: "1px solid #d0d0d0",
                          height: "40px"
                        }}
                      >
                        <th
                          style={{
                            padding: "0 12px 0 0",
                            textAlign: "start",
                            color: "#ff9600"
                          }}
                        >
                          Nome
                        </th>
                        <th
                          style={{
                            padding: "0 12px 0 0",
                            textAlign: "start",
                            color: "#ff9600"
                          }}
                        >
                          Qtd
                        </th>
                        <th
                          style={{
                            padding: "0 12px 0 0",
                            textAlign: "start",
                            minWidth: "90px",
                            color: "#ff9600"
                          }}
                        >
                          Vendas
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {this.state.topProdutos.map(pp => (
                        <tr
                          style={{
                            borderBottom: "1px solid #d0d0d0",
                            height: "40px"
                          }}
                        >
                          <td
                            style={{
                              textAlign: "start",
                              padding: "0 12px 0 0"
                            }}
                          >
                            {pp.nome}
                          </td>
                          <td>
                            <span>
                              {pp.qtd}
                              <br />
                            </span>
                          </td>
                          <td style={{ minWidth: "90px" }}>{pp.vendas}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </CardBody>
              </Card>
            </GridItem>

            <GridItem xs={12} sm={6} md={6} lg={3}>
              <Card>
                <CardHeader />
                <CardBody>
                  <h4 style={{ marginTop: "-18px" }}>Top 10 Bairros</h4>
                  <table
                    cellspacing="10"
                    style={{
                      width: "100%",
                      marginTop: "16px",
                      borderCollapse: "collapse"
                    }}
                  >
                    <thead>
                      <tr
                        style={{
                          borderBottom: "1px solid #d0d0d0",
                          height: "40px"
                        }}
                      >
                        <th
                          style={{
                            padding: "0 12px 0 0",
                            textAlign: "start",
                            color: "#ff9600"
                          }}
                        >
                          Nome
                        </th>
                        <th
                          style={{
                            padding: "0 12px 0 0",
                            textAlign: "start",
                            color: "#ff9600"
                          }}
                        >
                          Qtd
                        </th>
                        <th
                          style={{
                            padding: "0 12px 0 0",
                            textAlign: "start",
                            minWidth: "90px",
                            color: "#ff9600"
                          }}
                        >
                          Vendas
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {this.state.topBairros.map(pp => (
                        <tr
                          style={{
                            borderBottom: "1px solid #d0d0d0",
                            height: "40px"
                          }}
                        >
                          <td
                            style={{
                              textAlign: "start",
                              padding: "0 12px 0 0"
                            }}
                          >
                            {pp.nome}
                          </td>
                          <td>
                            <span>
                              {pp.qtd}
                              <br />
                            </span>
                          </td>
                          <td style={{ minWidth: "90px" }}>{pp.vendas}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </CardBody>
              </Card>
            </GridItem>
            <GridItem xs={12} sm={6} md={6}>
              <Card>
                <CardHeader />
                <CardBody>
                  <h4 style={{ marginTop: "-18px" }}>Formas de Pagamento</h4>
                  <Doughnut data={this.state.pagamentoGraf} />
                </CardBody>
              </Card>
            </GridItem>
            <GridItem xs={12} sm={12} md={12}>
              <Card>
                <CardHeader />
                <CardBody>
                  <h4 style={{ marginTop: "-18px" }}>Faturamento</h4>
                  <Line data={this.state.faturamento} />
                </CardBody>
              </Card>
            </GridItem>

            {/* <GridItem xs={12} sm={6} md={6}>
              <Card>
                <CardHeader />
                <CardBody>
                  <h4 style={{ marginTop: "-18px" }}>Plataformas</h4>
                  <Doughnut data={dataPlataformas} />
                </CardBody>
              </Card>
            </GridItem> */}
          </GridContainer>
        )}
      </div>
    );
  }
}

Dashboard.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(dashboardStyle)(Dashboard);
