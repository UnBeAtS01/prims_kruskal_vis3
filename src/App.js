import React, { useEffect, useState } from "react";
import "./App.css";
import { createCanvas } from "algorithmx";
import { network1, network2 } from "./networks";

let UnionFind = require("union-find");

function App() {
  const [alog, setAlgo] = useState(null);
  const [network, updateNetwork] = useState(network1);
  const [isClicked, startAnimation] = useState(false);
  const [data, setData] = useState([0, 0, 0]);
  const [number_nodes, setNonodes] = useState(0);
  let networktrial = { edges: [], nodes: [] };

  useEffect(() => {
    if (alog === "kruskal") KruskalAlgo();
    else if (alog === "prims") PrimsAlgo();
  });
  const prim = (net, nods, canvas) => {
    let i = 0;
    let l = 0;

    let sorted = net.sort(function (a, b) {
      var x = a.w < b.w ? -1 : 1;
      return x;
    });

    // console.log(sorted);

    let forest = new UnionFind(nods.length);

    let parent = [];
    let rank = [];
    let minNode, u, v, x, y;

    for (let node of nods) {
      parent.push(node);
      rank.push(0);
    }
    //console.log("parent", parent);

    while (l < nods.length - 1 && i < net.length) {
      minNode = sorted[i];
      // console.log(minNode);
      u = minNode.e[0];
      v = minNode.e[1];

      i = i + 1;
      //console.log("u v w", u, v, w);

      x = forest.find(u);
      y = forest.find(v);
      //console.log("x,y", x, y);

      if (x !== y) {
        l = l + 1;
        forest.link(u, v);
        //console.log(u, v);

        canvas.node(v).highlight().size("1.25x");
        canvas.node(v).color("purple");
        canvas.pause(0.5);

        canvas.edge([v, u]).highlight(0);
        canvas.edge([v, u]).traverse("#00FF7F").thickness(5);
        canvas.node(u).highlight().size("1.25x");
        canvas.node(u).color("purple");
        canvas.pause(0.5);
      }
    }
  };

  const prim2 = (net, nods, canvas) => {
    console.log("andar1");
    let visit = [];
    let parent = [];
    for (let i = 0; i <= nods.length; i++) {
      visit.push(0);
      parent.push(-1);
    }
    let array = [];

    array.push([net[0].e[0], net[0].e[1], net[0].w]);

    console.log(array[0]);
    console.log(net);
    console.log(nods);
    while (array.length > 0) {
      array.sort(function (a, b) {
        return a[2] - b[2];
      });

      console.log(array[0], array.length);
      const currval = array[0];
      array.shift();
      console.log(currval);
      if (visit[currval[0]]) continue;
      visit[currval[0]] = 1;
      parent[currval[0]] = currval[1];

      for (let i = 0; i < net.length; i++) {
        if (net[i].e[0] === currval[0] && !visit[net[i].e[1]]) {
          array.push([net[i].e[1], currval[0], net[i].w]);
        } else if (net[i].e[1] === currval[0] && !visit[net[i].e[0]])
          array.push([net[i].e[0], currval[0], net[i].w]);
      }
      if (currval[0] === 0 || currval[1] === 0) continue;
      let u = currval[0];
      let v = currval[1];

      canvas.node(v).highlight().size("1.25x");
      canvas.node(v).color("orange");
      canvas.pause(0.5);

      canvas.edge([v, u]).highlight(0);
      canvas.edge([v, u]).traverse("red").thickness(5);
      canvas.node(u).highlight().size("1.25x");
      canvas.node(u).color("orange");
      canvas.pause(0.5);
    }
  };

  const KruskalAlgo = () => {
    const canvas = createCanvas("graph");
    canvas.remove();
    canvas.size([500, 500]);
    canvas.zoom(1.5);
    canvas.edgelayout("symmetric");
    canvas.nodes(network.nodes).add().color("blue");

    network.edges.map((item) => {
      return canvas
        .edge(item.e)
        .add({ length: item.w })
        .label()
        .add({ text: item.w });
    });
    canvas.pause(2);

    if (isClicked) {
      if (network.edges.length === 0) {
        alert("please enter valid input");
        return;
      }
      prim(network.edges, network.nodes, canvas);
      startAnimation(false);
    }
  };
  const PrimsAlgo = () => {
    const canvas = createCanvas("graph");
    canvas.remove();
    canvas.size([500, 500]);
    canvas.zoom(1.5);
    canvas.edgelayout("symmetric");
    canvas.nodes(network.nodes).add().color("blue");

    network.edges.map((item) => {
      return canvas
        .edge(item.e)
        .add({ length: item.w })
        .label()
        .add({ text: item.w });
    });
    canvas.pause(2);

    if (isClicked) {
      if (network.edges.length === 0) {
        alert("please enter valid input");
        return;
      }
      prim2(network.edges, network.nodes, canvas);
      startAnimation(false);
    }
  };
  const handle_add = () => {
    console.log(data);
    networktrial.edges.push({ e: [data[0], data[1]], w: data[2] });
    networktrial.nodes = [];
    for (let i = 1; i <= number_nodes; i++) networktrial.nodes.push(i);
  };
  return (
    <div className="App">
      <div className="add_section">
        <div className="add_graph_m">ADD GRAPHS</div>
        <div style={{ margin: "5%" }}>
          <div
            style={{
              font: "2rem",
              display: "flex",
              justifyContent: "center",
              fontWeight: "lighter",
            }}
          >
            <div
              style={{
                display: "flex",

                justifyContent: "space-around",
              }}
            >
              <div style={{}}>Enter number of Nodes :</div>
              <input
                type="number"
                placeholder="number"
                onChange={(e) => {
                  setNonodes(e.target.value);
                  updateNetwork(null);
                  networktrial = { edges: [], nodes: [] };
                  setAlgo(null);
                }}
              />
            </div>
          </div>
        </div>
        <div className="input_nodes">
          <div
            style={{
              font: "2rem",
              display: "flex",
              justifyContent: "center",
              fontWeight: "lighter",
            }}
          >
            Input nodes should between {`1 to ${number_nodes}`}
          </div>
          <div style={{ display: "flex", justifyContent: "space-around" }}>
            {" "}
            <input
              type="number"
              //value={data[0]}
              placeholder="start"
              onChange={(e) => {
                let tempdata = [];
                tempdata = data;
                tempdata[0] = e.target.value;
                setData(tempdata);
              }}
            />
            <input
              type="number"
              //value={data[1]}
              placeholder="end"
              onChange={(e) => {
                let tempdata = [];
                tempdata = data;
                tempdata[1] = e.target.value;
                setData(tempdata);
              }}
            />
            <input
              type="number"
              placeholder="weight"
              onChange={(e) => {
                let tempdata = [];
                tempdata = data;
                tempdata[2] = e.target.value;
                setData(tempdata);
              }}
            />
          </div>
        </div>
        <div className="graph_add_btns">
          {" "}
          <button className="button_add" onClick={handle_add}>
            +ADD
          </button>
          <button
            className="button_add"
            onClick={() => updateNetwork(networktrial)}
          >
            +GRAPH
          </button>
        </div>
      </div>
      <div className="graph-section">
        <div className="algos">
          <button
            className={`${alog === "kruskal" ? "btn" : "btnn"}`}
            onClick={() => {
              setAlgo("kruskal");
              startAnimation(true);
            }}
          >
            Kruskal Algorithm
          </button>
          <button
            className={`${alog === "prims" ? "btn" : "btnn"}`}
            onClick={() => {
              setAlgo("prims");
              startAnimation(true);
            }}
          >
            Prims Algorithm
          </button>
        </div>

        <div id="graph"></div>
        <div className="options">
          <button
            className={`${network === network1 ? "btnf" : "btn2"}`}
            onClick={() => {
              updateNetwork(network1);
              startAnimation(true);
            }}
          >
            Graph1
          </button>
          <button
            className={`${network === network2 ? "btnf" : "btn2"}`}
            onClick={() => {
              updateNetwork(network2);
              startAnimation(true);
            }}
          >
            Graph2
          </button>
          <button className="btn2" onClick={() => startAnimation(true)}>
            Replay
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;
