//webworker

onmessage = (e) => {
    if (e.data.actie === 'start') {
        postMessage('Web Worker gestart: ' + e.data.bericht);
    }
};
