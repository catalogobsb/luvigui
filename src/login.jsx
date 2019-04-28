import React, { Component } from "react";
import Parse from "parse";
import { Input, Card, Button, CardContent } from "@material-ui/core";

export default class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: "",
      password: ""
    };
  }
  doLogin() {
    Parse.initialize(
      "v784bH11LDaQkQLAdds7DMUoQYfMQUgYPNMNIOAP",
      "2guzDdcJhIrbpyEEQdUH4ZKUVPYUPQUQSXMMfYfN"
    );
    Parse.serverURL =
      "https://pg-app-v8u5cg9lpqnuyj2pfa9lfhs42rvvdj.scalabl.cloud/1/";
    this.setState({ isLoading: true, errorMsg: "" });
    Parse.User.logIn(this.state.user, this.state.password)
      .then(user => {
        this.setState({ isLoading: false });
        const token = JSON.parse(JSON.stringify(user)).sessionToken;
        console.log("token", token);

        const filialRaw = Parse.Object.extend("lojas");
        const query = new Parse.Query(filialRaw);
        query.ascending("nome");
        query.find().then(results => {
            const lojas = [];
            results.forEach(loja=>{
                const lojaC = loja.attributes;
                lojas.push({nome: lojaC.nome, appId: lojaC.appId, jsKey: lojaC.jsKey, server_url: lojaC.server_url, dashboard_url: lojaC.dashboard_url})
            })
            console.log(lojas)
          //   localStorage.setItem("email", email);
            localStorage.setItem("token", token);
            localStorage.setItem("lojas", JSON.stringify(lojas));
            this.props.setToken(token);
            this.props.setLojas(lojas);
          //   localStorage.setItem("permission", JSON.stringify(permission));
          //   localStorage.setItem("filiais", JSON.stringify(filiais));
          //   window.location.replace("/dashboard");
        });
      })
      .catch(error => {
        const text = error.message;
        console.log(error);
        this.setState({ errorMsg: text });
        this.setState({ isLoading: false });
        // Translate(msgEnglish, {to: 'ptbr'}).then(res => {
        //   alert(res.text);
        //    //=> I speak English
        // }).catch(err => {
        //    console.error(err);
        // });

        //alert(`Error while logging in user: ${JSON.stringify(error.message)}`);
        //console.error('Error while logging in user', error);
      })
      .finally(a => {});
  }
  onChange = e => this.setState({ [e.target.name]: e.target.value });
  render() {
    const { user, password } = this.state;
    return (
      <Card>
        <CardContent>
          <div
            style={{ display: "flex", width: "300px", flexDirection: "column" }}
          >
            <span style={{ color: "grey", marginBottom: "15px" }}>
              LUVIGUI Master
            </span>
            {this.state.isLoading ? 
             <div style={{
                display: "flex",
                width: "300px",
                flexDirection: "column"
              }}>Carregando...</div>
             : (
              <div
                style={{
                  display: "flex",
                  width: "300px",
                  flexDirection: "column"
                }}
              >
                <span style={{marginBottom:"6px",fontSize:"10px", color: "red" }}>{this.state.errorMsg}</span>
                <Input
                  onChange={this.onChange}
                  name="user"
                  value={user}
                  style={{ marginBottom: "6px" }}
                  placeholder="Usuário"
                />
                <Input
                  onChange={this.onChange}
                  name="password"
                  value={password}
                  style={{ marginBottom: "6px" }}
                  placeholder="Senha"
                />
                <Button onClick={()=> this.doLogin()} variant="contained" fullWidth>
                  Entrar
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    );
  }
}
