from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
import os

from app.api import auth, recipes
from app.database.database import engine, Base

# Criar as tabelas do banco de dados
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Confeitaria MVP API",
    description="API para precificação automática de receitas de confeitaria",
    version="1.0.0"
)

# Configurar CORS para permitir requisições de qualquer origem (para deploy)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Em produção, especificar domínios específicos
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Incluir rotas da API
app.include_router(auth.router, prefix="/api/auth", tags=["auth"])
app.include_router(recipes.router, prefix="/api/recipes", tags=["recipes"])

# Servir arquivos estáticos do frontend (para deploy full-stack)
frontend_dist = os.path.join(os.path.dirname(__file__), "frontend")
if os.path.exists(frontend_dist):
    app.mount("/static", StaticFiles(directory=frontend_dist), name="static")
    
    @app.get("/")
    async def serve_frontend():
        return FileResponse(os.path.join(frontend_dist, "index.html"))
    
    @app.get("/{path:path}")
    async def serve_frontend_routes(path: str):
        file_path = os.path.join(frontend_dist, path)
        if os.path.exists(file_path) and os.path.isfile(file_path):
            return FileResponse(file_path)
        return FileResponse(os.path.join(frontend_dist, "index.html"))
else:
    @app.get("/")
    async def root():
        return {"message": "Confeitaria MVP API está funcionando!"}

@app.get("/health")
async def health_check():
    return {"status": "healthy", "message": "Confeitaria MVP API está funcionando!"}
