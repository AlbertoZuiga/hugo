from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from typing import Dict, List

app = FastAPI()


app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


schedules = [
    {
        "lunes": {
            "Matemáticas": {"hora_inicio": "08:30", "hora_termino": "09:20", "sala": "101", "tipo": "Teoría"},
            "Física": {"hora_inicio": "09:30", "hora_termino": "10:20", "sala": "102", "tipo": "Teoría"},
            "Química": {"hora_inicio": "11:30", "hora_termino": "12:20", "sala": "103", "tipo": "Práctica"},
            "Programación": {"hora_inicio": "13:30", "hora_termino": "14:20", "sala": "201", "tipo": "Teoría"},
        },
        "martes": {
            "Matemáticas": {"hora_inicio": "09:30", "hora_termino": "10:20", "sala": "101", "tipo": "Teoría"},
            "Física": {"hora_inicio": "10:30", "hora_termino": "11:20", "sala": "102", "tipo": "Teoría"},
            "Biología": {"hora_inicio": "11:20", "hora_termino": "12:20", "sala": "202", "tipo": "Teoría"}, 
        },
        "miercoles": {
            "Química": {"hora_inicio": "08:30", "hora_termino": "09:20", "sala": "103", "tipo": "Teoría"},
            "Física": {"hora_inicio": "09:30", "hora_termino": "10:20", "sala": "102", "tipo": "Teoría"},
            "Inglés": {"hora_inicio": "10:30", "hora_termino": "11:20", "sala": "301", "tipo": "Teoría"},
        },
        "jueves": {
            "Matemáticas": {"hora_inicio": "08:30", "hora_termino": "09:20", "sala": "101", "tipo": "Teoría"},
            "Historia": {"hora_inicio": "09:30", "hora_termino": "10:20", "sala": "302", "tipo": "Teoría"},
            "Física": {"hora_inicio": "09:30", "hora_termino": "10:20", "sala": "102", "tipo": "Práctica"}, 
        },
        "viernes": {
            "Programación": {"hora_inicio": "10:30", "hora_termino": "11:20", "sala": "201", "tipo": "Teoría"}, 
            "Biología": {"hora_inicio": "11:30", "hora_termino": "12:20", "sala": "202", "tipo": "Teoría"},
            "Inglés": {"hora_inicio": "13:30", "hora_termino": "14:20", "sala": "301", "tipo": "Teoría"},
        }
    },
    {
        "lunes": {
            "Historia": {"hora_inicio": "08:30", "hora_termino": "10:20", "sala": "101", "tipo": "Teoría"},
            "Geografía": {"hora_inicio": "08:30", "hora_termino": "10:20", "sala": "102", "tipo": "Teoría"},
        },
        "martes": {
            "Física": {"hora_inicio": "08:30", "hora_termino": "09:20", "sala": "103", "tipo": "Teoría"},
            "Química": {"hora_inicio": "09:30", "hora_termino": "10:20", "sala": "104", "tipo": "Práctica"},
        },
        "miercoles": {
            "Biología": {"hora_inicio": "10:20", "hora_termino": "11:20", "sala": "105", "tipo": "Teoría"},
            "Educación Física": {"hora_inicio": "11:30", "hora_termino": "12:20", "sala": "106", "tipo": "Práctica"},
        },
        "jueves": {
            "Programación": {"hora_inicio": "08:30", "hora_termino": "09:20", "sala": "201", "tipo": "Teoría"},
            "Matemáticas": {"hora_inicio": "09:30", "hora_termino": "10:20", "sala": "202", "tipo": "Teoría"},
        },
        "viernes": {
            "Química": {"hora_inicio": "08:30", "hora_termino": "09:20", "sala": "103", "tipo": "Práctica"},
            "Inglés": {"hora_inicio": "10:20", "hora_termino": "11:20", "sala": "301", "tipo": "Teoría"},
        }
    },
    {
        "lunes": {
            "Matemáticas": {"hora_inicio": "08:30", "hora_termino": "09:20", "sala": "101", "tipo": "Teoría"},
            "Física": {"hora_inicio": "09:30", "hora_termino": "10:20", "sala": "102", "tipo": "Teoría"},
        },
        "martes": {
            "Historia": {"hora_inicio": "09:20", "hora_termino": "10:20", "sala": "103", "tipo": "Teoría"},
            "Educación Física": {"hora_inicio": "10:30", "hora_termino": "11:20", "sala": "Gym", "tipo": "Práctica"},
        },
        "miercoles": {
            "Biología": {"hora_inicio": "08:30", "hora_termino": "09:20", "sala": "104", "tipo": "Teoría"},
            "Física": {"hora_inicio": "10:20", "hora_termino": "11:20", "sala": "102", "tipo": "Práctica"},
        },
        "jueves": {
            "Inglés": {"hora_inicio": "09:20", "hora_termino": "10:20", "sala": "301", "tipo": "Teoría"},
            "Matemáticas": {"hora_inicio": "10:30", "hora_termino": "11:20", "sala": "101", "tipo": "Teoría"},
        },
        "viernes": {
            "Química": {"hora_inicio": "08:30", "hora_termino": "09:20", "sala": "103", "tipo": "Práctica"},
            "Programación": {"hora_inicio": "10:20", "hora_termino": "11:20", "sala": "201", "tipo": "Teoría"},
        }
    }
]


@app.get("/schedules", response_model=List[Dict[str, Dict[str, Dict[str, str]]]])
async def get_schedules():
    return schedules