let wasmModule = null;

async function loadWasm() {
  try {
    wasmModule = await import("./rust_module.js");
    await wasmModule.default("./rust_module_bg.wasm");

    self.postMessage({ type: "loaded" });
  } catch (error) {
    self.postMessage({
      type: "error",
      error: error.message,
    });
  }
}

self.onmessage = async function (event) {
  const { type, data } = event.data;

  switch (type) {
    case "init":
      await loadWasm();
      break;

    case "generate":
      if (!wasmModule) {
        self.postMessage({ type: "error", error: "loading error" });
        return;
      }

      try {
        const startTime = performance.now();

        const points = new wasmModule.ColorPoints();
        points.generate_random_points(data.count || 1000000, data.seed);

        const genTime = performance.now();

        if (data.sort) {
          switch (data.sortBy) {
            case "r":
              points.sort_by_r();
              break;
            case "g":
              points.sort_by_g();
              break;
            case "b":
              points.sort_by_b();
              break;
            case "a":
              points.sort_by_a();
              break;
            default:
              points.sort_by_all();
          }
        }

        const sortTime = performance.now();

        const pointsData = points.get_points_as_bytes();

        const endTime = performance.now();
        self.postMessage(
          {
            type: "result",
            data: {
              points: pointsData,
              stats: {
                generationTime: genTime - startTime,
                sortTime: sortTime - genTime,
                totalTime: endTime - startTime,
                count: points.len(),
              },
            },
          },
          [pointsData.buffer]
        );

        points.clear();
      } catch (error) {

        self.postMessage({
          type: "error",
          error: error.message,
        });
      }
      break;
  }
};
