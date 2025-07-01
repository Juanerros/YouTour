const loadStaticFiles = (app) => {
    console.log('Sirviendo archivos estaticos')
    // Ruta específica para archivos estáticos
    app.use('/assets', express.static(path.join(__dirname, '../client/dist/assets')));

    // Servir el archivo index.html para rutas del frontend
    app.use(express.static(path.join(__dirname, '../client/dist')));

    // Ruta fallback para SPA
    app.use((req, res, next) => {
        if (!req.path.startsWith('/api/')) {
            res.sendFile(path.join(__dirname, '../client/dist/index.html'));
        } else {
            next();
        }
    });
}

export default loadStaticFiles;