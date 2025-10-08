from flask import Flask
import uvicorn
import threading
import time

# Importar a aplicação FastAPI
from main import app as fastapi_app

# Criar uma aplicação Flask simples para compatibilidade
flask_app = Flask(__name__)

@flask_app.route('/')
def index():
    return "Confeitaria MVP está rodando!"

@flask_app.route('/health')
def health():
    return {"status": "healthy"}

# Função para rodar FastAPI em thread separada
def run_fastapi():
    uvicorn.run(fastapi_app, host="0.0.0.0", port=8001)

if __name__ == "__main__":
    # Iniciar FastAPI em thread separada
    fastapi_thread = threading.Thread(target=run_fastapi, daemon=True)
    fastapi_thread.start()
    
    # Aguardar um pouco para FastAPI inicializar
    time.sleep(2)
    
    # Rodar Flask na porta principal
    flask_app.run(host="0.0.0.0", port=5000)

# Para deploy, exportar a aplicação Flask
app = flask_app
