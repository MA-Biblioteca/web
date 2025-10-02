import React from "react";
import { useAporte } from "./AporteContext";
import "./AporteForm.css";
import { useNavigate } from "react-router-dom";

const AporteForm: React.FC = () => {
  const { data, setData } = useAporte();
  const navigate = useNavigate();

  const carreras = ["Ingeniería", "Medicina", "Derecho"];
  const anios = ["1° Año", "2° Año", "3° Año"];
  const materias = ["Matemática", "Biología", "Historia"];
  const tipos = ["Primer Parcial", "Final", "TP","Segundo Parcial","Primer parcial-primer recuperatorio","Primer parcial-segundo recuperatorio","Segundo parcial-primer recuperatorio","Segundo parcial-segundo recuperatorio"];

  const handleNext = () => {
    console.log("Datos cargados:", data);
    navigate("/upload");
  };

  return (
    <div className="aporte-form">
      <h2>Carga de Aporte</h2>

      <label>
        Carrera:
        <select
          value={data.carrera}
          onChange={(e) => setData("carrera", e.target.value)}
          disabled={!!data.anio}
        >
          <option value="">Seleccione...</option>
          {carreras.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </label>

      <label>
        Año:
        <select
          value={data.anio}
          onChange={(e) => setData("anio", e.target.value)}
          disabled={!data.carrera || !!data.materia}
        >
          <option value="">Seleccione...</option>
          {anios.map((a) => (
            <option key={a} value={a}>
              {a}
            </option>
          ))}
        </select>
      </label>

      <label>
        Materia:
        <select
          value={data.materia}
          onChange={(e) => setData("materia", e.target.value)}
          disabled={!data.anio}
        >
          <option value="">Seleccione...</option>
          {materias.map((m) => (
            <option key={m} value={m}>
              {m}
            </option>
          ))}
        </select>
      </label>

      <fieldset>
        <legend>Tipo:</legend>
        {tipos.map((t) => (
          <label key={t}>
            <input
              type="radio"
              name="tipo"
              value={t}
              checked={data.tipo === t}
              onChange={(e) => setData("tipo", e.target.value)}
            />
            {t}
          </label>
        ))}
      </fieldset>

      <button onClick={handleNext} disabled={!data.materia || !data.tipo}>
        Siguiente
      </button>
    </div>
  );
};

export default AporteForm;
