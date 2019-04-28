import React, { Component } from "react";
import logo from "./logo.svg";
import "./App.css";
import Card from "@material-ui/core/Card";

import CardContent from "@material-ui/core/CardContent";
import { Button } from "@material-ui/core";
import Dashboard from "./dashboard";
import Login from "./login";

const apps = [
  {
    name: "Kaliffas",
    masterKey: "",
    javascriptKey: ""
  },
  {
    name: "App 2",
    masterKey: "",
    javascriptKey: ""
  },
  {
    name: "App 3",
    masterKey: "",
    javascriptKey: ""
  }
];

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      appSelecionado: null,
      userLogado: false,
      lojas: []
    };
  }
  checkUserLogado() {
    var token = localStorage.getItem("token");
    if (token && !this.state.token) {
      this.setState({ token: token });
      const lojas = localStorage.getItem("lojas");
      if (lojas) {
        const lojasObj = JSON.parse(lojas);
        this.setState({lojas: lojasObj})
      }
    }
  }

  render() {
    return (
      <div className="App">
        {this.checkUserLogado()}
        <div className="App-header">
          {!this.state.token ? (
            <Login
              setLojas={lojas => this.setState({ lojas })}
              setToken={token => this.setState({ token: token })}
            />
          ) : (
            <Card style={{minWidth: "400px", maxWidth: "94%"}}>
              <Button
                onClick={() => {
                  this.setState({ token: "" });
                  localStorage.setItem("token", "");
                }}
              >
                Deslogar
              </Button>
              <CardContent>
                {this.state.appSelecionado ? (
                  <div>
                    <div className="app-info__container">
                      <div className="card-header">
                        <Button
                          onClick={() =>
                            this.setState({ appSelecionado: null })
                          }
                          variant="contained"
                          color="primary"
                        >
                          <i class="material-icons">arrow_back</i>
                        </Button>
                        <h3>{this.state.appSelecionado.name}</h3>
                        <a
                          style={{ marginLeft: "8px", fontSize: "14px" }}
                          href={this.state.appSelecionado.dashboard_url}
                        >
                          {" "}
                          Ir para a dashboard
                        </a>
                      </div>
                    </div>
                    <Dashboard app={this.state.appSelecionado} />
                  </div>
                ) : (
                  <div className="app-container">
                    <h3>Lojas</h3>
                    {this.state.lojas.map(app => (
                      <Button
                        onClick={() => {
                          this.setState({ appSelecionado: app });
                          console.log(app);
                        }}
                        fullWidth
                        variant="contained"
                        color="primary"
                      >
                        {app.nome}
                      </Button>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    );
  }
}

export default App;
