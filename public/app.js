const { useState, useEffect } = React;
const { HashRouter, Routes, Route, Link, useParams } = ReactRouterDOM;

function Sidebar({ sheets }) {
  return React.createElement("div", { className: "sidebar" },
    React.createElement("h2", null, "Sheets"),
    sheets.map(s => React.createElement(Link, { key: s.name, to: "/sheet/" + encodeURIComponent(s.name) },
      s.name + " (" + s.rows + ")"))
  );
}

function SheetView() {
  const { name } = useParams();
  const [rows, setRows] = useState([]);
  const [columns, setColumns] = useState([]);

  useEffect(() => {
    fetch("/api/sheet/" + name)
      .then(r => r.json())
      .then(data => {
        setRows(data);
        setColumns(data.length ? Object.keys(data[0]) : []);
      });
  }, [name]);

  return React.createElement("div", { className: "content" },
    React.createElement("h2", null, name),
    React.createElement("table", null,
      React.createElement("thead", null,
        React.createElement("tr", null, columns.map(c => React.createElement("th", { key: c }, c)))
      ),
      React.createElement("tbody", null,
        rows.map((row, i) => React.createElement("tr", { key: i },
          columns.map(c => {
            const val = row[c];
            const isLink = typeof val === 'string' && /https?:\/\//.test(val);
            return React.createElement("td", { key: c },
              isLink ? React.createElement("a", { href: val, target: "_blank" }, val) : val
            );
          })
        ))
      )
    )
  );
}

function App() {
  const [sheets, setSheets] = useState([]);

  useEffect(() => {
    fetch("/api/sheets").then(r => r.json()).then(setSheets);
  }, []);

  return React.createElement(HashRouter, null,
    React.createElement("div", { id: "root-container" },
      React.createElement(Sidebar, { sheets }),
      React.createElement(Routes, null,
        React.createElement(Route, { path: "/sheet/:name", element: React.createElement(SheetView) }),
        React.createElement(Route, { path: "*", element: React.createElement("div", { className: "content" },
          React.createElement("h2", null, "Select a sheet from sidebar")
        ) })
      )
    )
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(React.createElement(App));
