from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from typing import Dict, List

app = FastAPI()

# Configurar CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Tu frontend corriendo en React
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Definimos el horario como en tu ejemplo
schedules = [{
    "lunes": {
        "Matemáticas": {"hora_inicio": "08:30", "hora_termino": "09:20", "sala": "101", "tipo": "Teoría"},
        "Física": {"hora_inicio": "09:30", "hora_termino": "10:20", "sala": "102", "tipo": "Teoría"},
        "Química": {"hora_inicio": "11:30", "hora_termino": "12:20", "sala": "103", "tipo": "Práctica"},
        "Programación": {"hora_inicio": "13:30", "hora_termino": "14:20", "sala": "201", "tipo": "Teoría"},
    },
    "martes": {
        "Matemáticas": {"hora_inicio": "09:30", "hora_termino": "10:20", "sala": "101", "tipo": "Teoría"},
        "Física": {"hora_inicio": "10:30", "hora_termino": "11:20", "sala": "102", "tipo": "Teoría"},
        "Biología": {"hora_inicio": "11:00", "hora_termino": "12:20", "sala": "202", "tipo": "Teoría"}, # Conflicto con Física
    },
    "miercoles": {
        "Química": {"hora_inicio": "08:30", "hora_termino": "09:20", "sala": "103", "tipo": "Teoría"},
        "Física": {"hora_inicio": "09:30", "hora_termino": "10:20", "sala": "102", "tipo": "Teoría"},
        "Inglés": {"hora_inicio": "10:30", "hora_termino": "11:20", "sala": "301", "tipo": "Teoría"},
    },
    "jueves": {
        "Matemáticas": {"hora_inicio": "08:30", "hora_termino": "09:20", "sala": "101", "tipo": "Teoría"},
        "Historia": {"hora_inicio": "09:30", "hora_termino": "10:20", "sala": "302", "tipo": "Teoría"},
        "Física": {"hora_inicio": "09:45", "hora_termino": "10:45", "sala": "102", "tipo": "Práctica"}, # Conflicto con Historia
    },
    "viernes": {
        "Programación": {"hora_inicio": "10:00", "hora_termino": "11:20", "sala": "201", "tipo": "Teoría"}, # Conflicto con Química
        "Biología": {"hora_inicio": "11:30", "hora_termino": "12:20", "sala": "202", "tipo": "Teoría"},
        "Inglés": {"hora_inicio": "13:30", "hora_termino": "14:20", "sala": "301", "tipo": "Teoría"},
    }
}]

# Endpoint para retornar el horario completo
@app.get("/schedules", response_model=List[Dict[str, Dict[str, Dict[str, str]]]])
async def get_schedules():
    return schedules