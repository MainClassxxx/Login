server:{
    port:8080,
    host:"0.0.0.0",
    proxy:{
        "api/": {
            target:"http://127.0.0.1:8000"
            changeOrigin:true,
            rewrite:(path)=>path.replace(/^\/api/,""/),
        },
    },
},