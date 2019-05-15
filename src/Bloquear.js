import React, { Component } from "react";
import { Button } from "@material-ui/core";
import Parse from "parse";

export default class Bloquear extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isBlocked: false,
      isLoading: true
    };
    this.bloquear = this.bloquear.bind(this);
    this.desbloquear = this.desbloquear.bind(this);
  }

  componentDidMount() {
    let self = this;
    const Bloqueio = Parse.Object.extend("Bloqueio");
    const query = new Parse.Query(Bloqueio);
    query.ascending("nome");
    query.equalTo("key", 1);
    query.find().then(function(results) {
      if (results[0].attributes.isBlock) {
        self.setState({
          isLoading: false,
          isBlocked: true
        });
      } else {
        self.setState({
          isLoading: false
        });
      }
    });
  }
  bloquear() {
    const Bloqueio = Parse.Object.extend("Bloqueio");
    let self = this;
    const query = new Parse.Query(Bloqueio);
    const motivo = window.prompt(
      "Digite aqui o motivo",
      "Bloqueado pelo administrador"
    );
    if (motivo != null) {
      self.setState({ isLoading: true });
      query.ascending("nome");
      query.equalTo("key", 1);
      query.find().then(function(results) {
        results.forEach(r => {
          if (r.attributes.isBlock) {
            self.setState({ isLoading: false, isBlocked: true });
          } else {
            const element = r;
            element.set("isBlock", true);
            element.set("motivo", motivo);
            element.save().then(() => {
              self.setState({ isLoading: false, isBlocked: true });
            });
          }
        });
      });
    }
  }
  desbloquear() {
    const Bloqueio = Parse.Object.extend("Bloqueio");
    let self = this;
    const query = new Parse.Query(Bloqueio);
    self.setState({ isLoading: true });
    query.ascending("nome");
    query.equalTo("key", 1);
    query.find().then(function(results) {
      results.forEach(r => {
        if (results[0].attributes.isBlock) {
          const element = results[0];
          element.set("isBlock", false);
          element.save().then(() => {
            self.setState({ isLoading: false, isBlocked: false });
          });
        } else {
          self.setState({ isLoading: false, isBlocked: false });
        }
      });
    });
  }
  render() {
    return (
      <div>
        {!this.state.isLoading && this.state.isBlocked ? (
          <Button
            onClick={this.desbloquear}
            variant="contained"
            color="secondary"
          >
            Desbloquear
          </Button>
        ) : (
          <Button onClick={this.bloquear} variant="contained" color="secondary">
            Bloquear
          </Button>
        )}
      </div>
    );
  }
}
