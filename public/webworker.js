// webworker.js

// Setup your project to serve `py-worker.js`. You should also serve
// `pyodide.js`, and all its associated `.asm.js`, `.json`,
// and `.wasm` files as well:
importScripts('https://cdn.jsdelivr.net/pyodide/v0.23.4/full/pyodide.js');

async function loadPyodideAndPackages() {
  self.pyodide = await loadPyodide();
  await self.pyodide.loadPackage(['pandas']);
  const response = await fetch('python-script.py');
  const pythonScript = await response.text();
  pyFuncs = pyodide.runPython(pythonScript);
}
let pyodideReadyPromise = loadPyodideAndPackages();

self.onmessage = async (event) => {
  // make sure loading is done
  await pyodideReadyPromise;

  try {
    // console.log({ eventData: event.data });
    const { action, data } = event.data;
    const { fileStr, groups = [] } = data;
    const results = pyFuncs.groupDataframe(
      ...[fileStr, JSON.stringify(groups)]
    );
    self.postMessage({ action, results });
  } catch (error) {
    console.error(error);
    self.postMessage({ error: error.message });
  }
};
