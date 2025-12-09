let worker = null;

function initWorker() {
  if (!worker) {
    worker = new Worker("worker.js");

    worker.onmessage = function (event) {
      const { type, data, error } = event.data;

      switch (type) {
        case "loaded":
          document.getElementById("status").textContent =
            "WASM loaded successfully";

          worker.postMessage({
            type: "generate",
            data: {
              count: 1_000_000,
              seed: null,
            },
          });
          break;

        case "result":
          const stats = data.stats;
          console.log({ data });
          document.getElementById("status").textContent = `
                                points ${stats.count.toLocaleString()};
                                time: ${stats.generationTime.toFixed(2)}
                            
                            `;
          visualizePoints(data.points);
          break;

        case "error":
          document.getElementById("status").textContent = `Ошибка`;
          break;
      }
    };

    worker.postMessage({ type: "init" });
  }
}

function generatePoints() {
  initWorker();
  worker.postMessage({
    type: "generate",
    data: { count: 1000000, sort: false },
  });
}

function generateAndSort(sortBy) {
  initWorker();
  worker.postMessage({
    type: "generate",
    data: {
      count: 1000000,
      sort: true,
      sortBy: sortBy,
    },
  });
}

function initControls() {
  const controlsSection = document.getElementById("controls");

  const controls = controlsSection.childNodes.forEach((controlNode) => {
    if (controlNode.dataset && controlNode.dataset.color) {
      controlNode.addEventListener("click", () => {
        generateAndSort(controlNode.dataset.color.toLowerCase());
      });
    }
  });
}

initControls();

function visualizePoints(pointsData) {
  const maxPoints = pointsData.length / 4;

  const canvas = document.getElementById("visualization");

  const ctx = canvas.getContext("2d");

  document.getElementById("container").appendChild(canvas);

  canvas.height = 600;
  canvas.width = 600;
  let row = 0;
  let column = 0;
  for (let i = 0; i < maxPoints; i++) {
    const idx = i * 4;
    if (column % 600 === 0 && !!column) {
      row++;
      column = 0;
    }
    ctx.fillStyle = `rgb(${pointsData[idx]}, ${pointsData[idx + 1]}, ${
      pointsData[idx + 2]
    })`;

    ctx.fillRect(column, row, 1, 1);

    column++;
  }
}

window.onload = initWorker;
