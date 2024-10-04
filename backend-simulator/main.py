from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from typing import Dict, List, Union

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


courses = [
  {"title": "Circuitos Eléctricos", "teacher": "Profesor Gómez", "area": "Eléctrica", "mayor": "Ingeniería Eléctrica", "minor": "Electrónica"},
  {"title": "Circuitos Eléctricos", "teacher": "Profesor w", "area": "Eléctrica", "mayor": "Ingeniería Eléctrica", "minor": "Electrónica"},
  {"title": "Circuitos Eléctricos", "teacher": "Profesor x", "area": "Eléctrica", "mayor": "Ingeniería Eléctrica", "minor": "Electrónica"},
  {"title": "Circuitos Eléctricos", "teacher": "Profesor y", "area": "Eléctrica", "mayor": "Ingeniería Eléctrica", "minor": "Electrónica"},
  {"title": "Circuitos Eléctricos", "teacher": "Profesor z", "area": "Eléctrica", "mayor": "Ingeniería Eléctrica", "minor": "Electrónica"},
  {"title": "Electromagnetismo", "teacher": ["Profesor López","Profesor w",  "Profesor x",  "Profesor y",  "Profesor z"], "area": "Eléctrica", "mayor": "Ingeniería Eléctrica", "minor": "Comunicaciones"},
  {"title": "Máquinas Eléctricas", "teacher": "Profesor Silva", "area": "Eléctrica", "mayor": "Ingeniería Eléctrica", "minor": "Automatización"},
  {"title": "Mecánica de Suelos", "teacher": "Profesora Martínez", "area": "Obras Civiles", "mayor": "Ingeniería Civil", "minor": "Geotécnica"},
  {"title": "Diseño Estructural", "teacher": "Profesor Pérez", "area": "Obras Civiles", "mayor": "Ingeniería Civil", "minor": "Estructuras"},
  {"title": "Hidráulica de Canales", "teacher": "Profesora Vargas", "area": "Obras Civiles", "mayor": "Ingeniería Civil", "minor": "Hidráulica"},
  {"title": "Algoritmos y Estructuras de Datos", "teacher": "Profesor Sánchez", "area": "Computación", "mayor": "Ciencias de la Computación", "minor": "Desarrollo de Software"},
  {"title": "Sistemas Operativos", "teacher": "Profesora Díaz", "area": "Computación", "mayor": "Ciencias de la Computación", "minor": "Administración de Sistemas"},
  {"title": "Inteligencia Artificial", "teacher": "Profesor Fernández", "area": "Computación", "mayor": "Ciencias de la Computación", "minor": "Aprendizaje Automático"},
  {"title": "Gestión de Operaciones", "teacher": "Profesora Rojas", "area": "Industrial", "mayor": "Ingeniería Industrial", "minor": "Optimización"},
  {"title": "Ingeniería Económica", "teacher": "Profesor Castillo", "area": "Industrial", "mayor": "Ingeniería Industrial", "minor": "Economía de Empresas"},
  {"title": "Gestión de Proyectos", "teacher": "Profesora Hernández", "area": "Industrial", "mayor": "Ingeniería Industrial", "minor": "Project Management"},
  {"title": "Sistemas de Gestión Ambiental", "teacher": "Profesor Ortega", "area": "Ambiental", "mayor": "Ingeniería Ambiental", "minor": "Sostenibilidad"},
  {"title": "Tratamiento de Aguas", "teacher": "Profesora Morales", "area": "Ambiental", "mayor": "Ingeniería Ambiental", "minor": "Recursos Hídricos"},
  {"title": "Evaluación de Impacto Ambiental", "teacher": "Profesor Ibáñez", "area": "Ambiental", "mayor": "Ingeniería Ambiental", "minor": "Legislación Ambiental"}
]

@app.get("/courses", response_model=List[Dict[str, Union[str, List[str]]]])
async def get_courses():
    return courses

selected_courses = [
  {"title": "Circuitos Eléctricos", "teacher": "Profesor Gómez", "area": "Eléctrica", "mayor": "Ingeniería Eléctrica", "minor": "Electrónica"},
  {"title": "Máquinas Eléctricas", "teacher": "Profesor Silva", "area": "Eléctrica", "mayor": "Ingeniería Eléctrica", "minor": "Automatización"},
  {"title": "Mecánica de Suelos", "teacher": "Profesora Martínez", "area": "Obras Civiles", "mayor": "Ingeniería Civil", "minor": "Geotécnica"},
  {"title": "Diseño Estructural", "teacher": "Profesor Pérez", "area": "Obras Civiles", "mayor": "Ingeniería Civil", "minor": "Estructuras"},
  {"title": "Hidráulica de Canales", "teacher": "Profesora Vargas", "area": "Obras Civiles", "mayor": "Ingeniería Civil", "minor": "Hidráulica"}
]

@app.get("/selected_courses", response_model=List[Dict[str, Union[str, List[str]]]])
async def get_selected_courses():
    return selected_courses